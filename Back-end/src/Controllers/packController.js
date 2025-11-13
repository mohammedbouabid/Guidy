// Controllers/packController.js
import mongoose from "mongoose";
import Pack from "../Models/Pack.js";
import Rating from "../Models/Rating.js";
import Category from "../Models/Category.js";  // ✅ Add this import
/**
 * Helper: compute average ratings for a list of pack IDs in one aggregation.
 * Returns a Map: packId(string) -> avg(number with 2 decimals)
 */
const computeAvgMap = async (packIds) => {
  if (!packIds || !packIds.length) return new Map();

  const objectIds = packIds.map((id) => new mongoose.Types.ObjectId(id));
  const result = await Rating.aggregate([
    { $match: { packID: { $in: objectIds } } },
    { $group: { _id: "$packID", avgRating: { $avg: "$stars" } } },
  ]);

  const map = new Map();
  for (const row of result) {
    map.set(String(row._id), Number(Number(row.avgRating).toFixed(2)));
  }
  return map;
};
// helper
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const computeDurationDays = (start, end) => {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 0;
  }
  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs <= 0) return 0;
  const dayMs = 1000 * 60 * 60 * 24;
  return Math.ceil(diffMs / dayMs);
};


export const getPacksFiltered = async (req, res) => {
  try {
    const {
      priceMin,
      priceMax,
      startLocation,
      startDateFrom,
      startDateTo,
      avgRatingMin,
      avgRatingMax,
      category, // CSV of category NAMES (e.g., "Hiking & Trekking,Water Sports")
      page = "1",
      limit = "10",
      sort = "" // e.g. "price" or "-price"
    } = req.query;

    // Build MongoDB filter using ONLY the requested fields
    const filter = {};

    // Price range
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    // Start date range
    if (startDateFrom || startDateTo) {
      filter.startDate = {};
      if (startDateFrom) filter.startDate.$gte = new Date(startDateFrom);
      if (startDateTo) filter.startDate.$lte = new Date(startDateTo);
    }

 if (startLocation) {
  filter.startLocation = { $regex: escapeRegex(startLocation), $options: "i" };
}
    // avgRating range (uses stored avgRating on Pack)
    if (avgRatingMin || avgRatingMax) {
      filter.avgRating = {};
      if (avgRatingMin) filter.avgRating.$gte = Number(avgRatingMin);
      if (avgRatingMax) filter.avgRating.$lte = Number(avgRatingMax);
    }



    // Category by NAME (CSV). If provided, map partial names -> IDs then filter packs that have ANY of them
    if (category) {
      // split CSV, trim empties
      const values = String(category)
        .split(",")
        .map((s) => String(s || "").trim())
        .filter(Boolean);

      if (values.length) {
        // ❗ Change: use "contains" regex (no ^$ anchors), case-insensitive
        const categoriesFound = await Category.find({
          name: { $in: values.map((v) => new RegExp(escapeRegex(v), "i")) },
        }).select("_id");

        const categoryIds = categoriesFound.map((c) => c._id);

        if (categoryIds.length) {
          filter.categories = { $in: categoryIds };
        } else {
          // No category matched -> return empty pagination
          return res.status(200).json({
            docs: [],
            totalDocs: 0,
            limit: Number(limit) || 10,
            totalPages: 1,
            page: Number(page) || 1,
          });
        }
      }
    }

    // Pagination + sort
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    };
    if (sort) options.sort = sort;

    const packs = await Pack.paginate(filter, options);

    return res.status(200).json(packs);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error filtering packs", error: error.message });
  }
};

// Gets all the packs. Makes sure the guides get only the packs they need, which are their packs.
const getAllPacks = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
      ,
      populate: [
        { path: "guidesPlacesId", select: "name city country images description" },
        { path: "categories", select: "name" },
      ],
    };
    if (req.query.sort) {
      options.sort = req.query.sort;
    }

    const packs = await Pack.paginate({}, options);

    // --- compute averages for this page in a single aggregation
    const ids = (packs.docs || []).map((p) => p._id);
    const avgMap = await computeAvgMap(ids);

    // Prepare bulk updates to persist avgRating into Pack documents
    const bulkOps = [];
    for (const doc of packs.docs) {
      const avg = avgMap.get(String(doc._id)) ?? 0;
      // attach to response
      doc.avgRating = avg;
      // If categories were populated, convert to array of names for consistency
      if (Array.isArray(doc.categories)) {
        try {
          doc.categories = doc.categories.map((c) => (c && c.name) ? c.name : String(c));
        } catch (e) {
          // ignore and leave as-is
        }
      }
      // schedule DB persistence
      bulkOps.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { avgRating: avg } },
        },
      });
    }

    if (bulkOps.length) {
      await Pack.bulkWrite(bulkOps);
    }

    return res.status(200).json(packs);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching packs", error: error.message });
  }
};

const getAllPacksForGuide = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      populate: {
        path: "guidesPlacesId",
        select: "name city country images description",
      },
    };

    // Only packs of connected guide
    const packs = await Pack.paginate({ guideId: req?.user?.id }, options);

    // Compute averages
    const ids = (packs.docs || []).map((p) => p._id);
    const avgMap = await computeAvgMap(ids);

    // Persist
    const bulkOps = [];
    for (const doc of packs.docs) {
      const avg = avgMap.get(String(doc._id)) ?? 0;
      doc.avgRating = avg;
      bulkOps.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { avgRating: avg } },
        },
      });
    }

    if (bulkOps.length) {
      await Pack.bulkWrite(bulkOps);
    }

    return res.status(200).json(packs);
  } catch (error) {
    console.error("❌ Erreur lors du chargement des packs :", error);
    return res.status(500).json({
      message: "Erreur lors du chargement des packs",
      error: error.message,
    });
  }
};

// Create a pack. Makes sure only guides have access to this controller
const createPack = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== "guide") {
      return res.status(403).json({
        message: "You don't seem to have the right permissions to perform this action",
      });
    }

    let {
      guidesPlacesId,
      profileImg,
      title,
      description,
      price,
      startDate,
      endDate,
      availability,
      startLocation,
      endLocation,
      maxClients,
      // NEW
      categories,
    } = req.body;

    // Parse guidesPlacesId if it's a string (from FormData)
    if (guidesPlacesId && typeof guidesPlacesId === "string") {
      try {
        guidesPlacesId = JSON.parse(guidesPlacesId);
      } catch (e) {
        guidesPlacesId = guidesPlacesId.split(",").map((id) => id.trim());
      }
    }
    if (guidesPlacesId && !Array.isArray(guidesPlacesId)) {
      guidesPlacesId = [guidesPlacesId];
    }

    // --- Normalize categories (JSON string / CSV / single) ---
    if (categories && typeof categories === "string") {
      try {
        const parsed = JSON.parse(categories);
        categories = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        categories = categories.split(",").map((id) => id.trim());
      }
    }
    if (categories && !Array.isArray(categories)) {
      categories = [categories];
    }

    // --- IDs ONLY: validate and convert ---
    if (categories && categories.length > 0) {
      // normalize to clean strings, remove empties, dedupe
      categories = Array.from(
        new Set(
          categories
            .map((v) => String(v).trim())
            .filter(Boolean)
        )
      );

      // 2) existence check (recommended)
      const existing = await Category.find({ _id: { $in: categories } }).select("_id");
      if (existing.length !== categories.length) {
        const existingSet = new Set(existing.map((c) => String(c._id)));
        const missing = categories.filter((id) => !existingSet.has(id));
        return res.status(400).json({
          message: `These category ID(s) do not exist: ${missing.join(", ")}`,
        });
      }

      // 3) convert to ObjectId[]
      categories = categories.map((id) => new mongoose.Types.ObjectId(id));
    }

    const guideId = req.user.id;
    const profileImgUrl = req.file?.path; // e.g. https://res.cloudinary.com/...
    const durationTime = computeDurationDays(startDate, endDate);

    const newPack = new Pack({
      guideId,
      guidesPlacesId,
      profileImg,
      title,
      description,
      price,
      startDate,
      endDate,
      availability,
      startLocation,
      endLocation,
      maxClients,
      durationTime,
      profileImg: profileImgUrl, // store the URL in MongoDB
      categories,                 // <-- ObjectId[] only
    });

    const savedPack = await newPack.save();
    return res.status(201).json(savedPack);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating pack", error: error.message });
  }
};


// Gets a pack by it's ID. Makes sure the guides only get access to their packs and not to other guides packs.
const getPackById = async (req, res) => {
  try {
    // For public access, always fetch the pack
    // Only apply guide restriction if user is authenticated AND is a guide
    const role = req.user?.role ? String(req.user.role).toLowerCase() : null;
    let pack;
    if (role === "guide" && req.user?.id) {
      pack = await Pack.findOne({
        _id: req.params.id,
        guideId: req.user.id,
      })
        .populate("guidesPlacesId", "name city country images description")
        .populate("categories", "name");
    } else {
      pack = await Pack.findById(req.params.id)
        .populate("guidesPlacesId", "name city country images description")
        .populate("categories", "name");
    }

    if (!pack) {
      return res.status(404).json({ message: "Pack not found" });
    }

    // Compute average for this single pack and persist it
    const result = await Rating.aggregate([
      { $match: { packID: new mongoose.Types.ObjectId(pack._id) } },
      { $group: { _id: "$packID", avgRating: { $avg: "$stars" } } },
    ]);
    const avg = result.length
      ? Number(Number(result[0].avgRating).toFixed(2))
      : 0;

    // attach to response (ensure plain object if needed)
    const packObj = typeof pack.toObject === "function" ? pack.toObject() : pack;

    // Convert populated categories to array of names (fallback to id string)
    if (Array.isArray(packObj.categories)) {
      packObj.categories = packObj.categories.map((c) => (c && c.name) ? c.name : String(c));
    }

    packObj.avgRating = avg;

    // Persist in DB
    await Pack.updateOne({ _id: pack._id }, { $set: { avgRating: avg } });

    return res.status(200).json(packObj);
  } catch (error) {
    console.error('Error in getPackById:', error);
    res.status(500).json({ 
      message: 'Error fetching pack', 
      error: error.message 
    });
  }
};

// Update a pack. Makes sure only the owner guides have access to the pack update.
const updatePack = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== "guide") {
      return res.status(403).json({
        message: "You don't seem to have the right permissions to perform this action",
      });
    }

    const updateData = { ...req.body };

    // Parse guidesPlacesId if it's a string (from FormData)
    if (updateData.guidesPlacesId && typeof updateData.guidesPlacesId === "string") {
      try {
        updateData.guidesPlacesId = JSON.parse(updateData.guidesPlacesId);
      } catch {
        updateData.guidesPlacesId = updateData.guidesPlacesId.split(",").map((s) => s.trim());
      }
    }
    if (updateData.guidesPlacesId && !Array.isArray(updateData.guidesPlacesId)) {
      updateData.guidesPlacesId = [updateData.guidesPlacesId];
    }

    // 🆕 IDs-only categories (mirror createPack rules)
    if (updateData.categories !== undefined) {
      if (typeof updateData.categories === "string") {
        try {
          const parsed = JSON.parse(updateData.categories);
          updateData.categories = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          updateData.categories = updateData.categories.split(",").map((s) => s.trim());
        }
      }
      if (!Array.isArray(updateData.categories)) {
        updateData.categories = [updateData.categories];
      }

      updateData.categories = Array.from(
        new Set(
          updateData.categories
            .map((v) => String(v).trim())
            .filter(Boolean)
        )
      );

      if (updateData.categories.length === 0) {
        // allow clearing categories
      } else {
        const invalid = updateData.categories.filter((id) => !mongoose.Types.ObjectId.isValid(id));
        if (invalid.length) {
          return res.status(400).json({
            message: `Invalid category ID(s): ${invalid.join(", ")}`,
          });
        }

        const existing = await Category.find({ _id: { $in: updateData.categories } }).select("_id");
        if (existing.length !== updateData.categories.length) {
          const existingSet = new Set(existing.map((c) => String(c._id)));
          const missing = updateData.categories.filter((id) => !existingSet.has(id));
          return res.status(400).json({
            message: `These category ID(s) do not exist: ${missing.join(", ")}`,
          });
        }

        updateData.categories = updateData.categories.map((id) => new mongoose.Types.ObjectId(id));
      }
    }

    // If new image uploaded
    if (req.file?.path) {
      updateData.profileImg = req.file.path;
    }

    const existingPack = await Pack.findOne({ _id: req.params.id, guideId: req.user.id });
    if (!existingPack) {
      return res.status(404).json({ message: "Pack not found" });
    }

    const startSource = updateData.startDate ?? existingPack.startDate;
    const endSource = updateData.endDate ?? existingPack.endDate;
    updateData.durationTime = computeDurationDays(startSource, endSource);

    existingPack.set(updateData);
    const updatedPack = await existingPack.save();

    return res.status(200).json(updatedPack);
  } catch (error) {
    return res.status(500).json({ message: "Error updating pack", error: error.message });
  }
};


const deletePack = async (req, res) => {
  try {
    const role = req.user?.role?.toLowerCase();
    if (!role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let pack = null;

    if (role === "admin") {
      pack = await Pack.findByIdAndDelete(req.params.id);
    } else if (role === "guide") {
      pack = await Pack.findOneAndDelete({
        _id: req.params.id,
        guideId: req.user.id,
      });
    } else {
      return res.status(403).json({
        message: "You don't seem to have the right permissions to perform this action",
      });
    }

    if (!pack) {
      return res.status(404).json({ message: "Pack not found" });
    }

    res.status(200).json({
      success: true,
      message: "Pack deleted successfully",
      data: pack,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pack", error: error.message });
  }
};

const getPopularPacks = async (req, res) => {
  try {
    const packs = await Pack.find({
      // only packs with a rating above 0 (optional)
    })
      .sort({ avgRating: -1 }) // highest rated first
      .limit(8); // top 8 for homepage

    res.json({ docs: packs });
  } catch (err) {
    console.error("Error in getPopularPacks:", err);
    res.status(500).json({ message: "Error fetching popular packs" });
  }
};

const getMonthlyPackStats = async (req, res) => {
  try {
    const guideId = req.user?.id;
    const userRole = req.user?.role;

    // Paramètres de filtrage
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    const filterType = req.query.filterType || 'year';
    const month = req.query.month ? parseInt(req.query.month) : null;
    const week = req.query.week ? parseInt(req.query.week) : null;

    let startDate, endDate;
    
    // Définir les dates selon le type de filtre
    if (filterType === 'year') {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    } else if (filterType === 'month' && month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
    } else if (filterType === 'week' && week) {
      const firstDay = new Date(year, 0, 1);
      const dayOfWeek = firstDay.getDay();
      const daysToAdd = (week - 1) * 7 - dayOfWeek + 1;
      startDate = new Date(year, 0, 1 + daysToAdd);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59);
    } else {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    }

    let matchCondition = {};

    // If user is a guide, filter by their packs only
    if (userRole === 'guide') {
      matchCondition.guideId = new mongoose.Types.ObjectId(guideId);
    }

    // First, check if packs have createdAt field
    const samplePack = await Pack.findOne(matchCondition);
    const hasCreatedAt = samplePack && samplePack.createdAt;

    console.log("📊 Filter params:", { year, filterType, month, week });
    console.log("📊 Date range:", { startDate, endDate });

    let stats;
    let result;
    
    if (filterType === 'year') {
      // Agrégation par mois pour l'année
      if (hasCreatedAt) {
        matchCondition.createdAt = { $gte: startDate, $lte: endDate };
        stats = await Pack.aggregate([
          { $match: matchCondition },
          { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]);
      } else {
        matchCondition.startDate = { $gte: startDate, $lte: endDate };
        stats = await Pack.aggregate([
          { $match: matchCondition },
          { $group: { _id: { $month: "$startDate" }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]);
      }

      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      result = monthNames.map((monthName, index) => {
        const monthData = stats.find(s => s._id === index + 1);
        return { month: monthName, packs: monthData ? monthData.count : 0 };
      });

    } else if (filterType === 'month') {
      // Agrégation par jour du mois
      if (hasCreatedAt) {
        matchCondition.createdAt = { $gte: startDate, $lte: endDate };
        stats = await Pack.aggregate([
          { $match: matchCondition },
          { $group: { _id: { $dayOfMonth: "$createdAt" }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]);
      } else {
        matchCondition.startDate = { $gte: startDate, $lte: endDate };
        stats = await Pack.aggregate([
          { $match: matchCondition },
          { $group: { _id: { $dayOfMonth: "$startDate" }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]);
      }

      const daysInMonth = new Date(year, month, 0).getDate();
      result = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dayData = stats.find(s => s._id === day);
        return { month: day.toString(), packs: dayData ? dayData.count : 0 };
      });

    } else if (filterType === 'week') {
      // Agrégation par jour de la semaine
      if (hasCreatedAt) {
        matchCondition.createdAt = { $gte: startDate, $lte: endDate };
        stats = await Pack.aggregate([
          { $match: matchCondition },
          { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]);
      } else {
        matchCondition.startDate = { $gte: startDate, $lte: endDate };
        stats = await Pack.aggregate([
          { $match: matchCondition },
          { $group: { _id: { $dayOfWeek: "$startDate" }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]);
      }

      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      result = dayNames.map((day, index) => {
        const dayData = stats.find(s => s._id === index + 1);
        return { month: day, packs: dayData ? dayData.count : 0 };
      });
    }

    console.log("📊 Final result:", result);

    res.status(200).json({
      success: true,
      year: year,
      filterType: filterType,
      month: month,
      week: week,
      data: result
    });
  } catch (error) {
    console.error("❌ Error in getMonthlyPackStats:", error);
    res.status(500).json({
      success: false,
      message: 'Error fetching monthly pack stats',
      error: error.message
    });
  }
};


export {
  getAllPacks,
  getAllPacksForGuide,
  getPopularPacks,
  createPack,
  getPackById,
  updatePack,
  deletePack,
  getMonthlyPackStats,
};
