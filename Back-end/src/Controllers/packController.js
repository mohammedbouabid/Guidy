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

export const getPacksFiltered = async (req, res) => {
  try {
    const {
      id,
      guideId,
      title,
      priceMin,
      priceMax,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      startLocation,
      endLocation,
      avgRatingMin,
      avgRatingMax,
      maxClientsMin,
      maxClientsMax,
      // NEW: CSV of category ObjectIds
      categoryIds,
    } = req.query;

    // Build MongoDB filter object
    const filter = {};

    // If caller is a GUIDE, restrict to their packs automatically
    if (req.user?.role?.toLowerCase() === "guide") {
      filter.guideId = req.user.id;
    }

    // id/guideId (admin/client can pass guideId; guide already restricted)
    if (id) {
      try {
        filter._id = new mongoose.Types.ObjectId(id);
      } catch {}
    }
    if (guideId && req.user?.role?.toLowerCase() !== "guide") {
      try {
        filter.guideId = new mongoose.Types.ObjectId(guideId);
      } catch {}
    }

    // title contains (case-insensitive)
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    // price range
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    // startDate / endDate ranges
    if (startDateFrom || startDateTo) {
      filter.startDate = {};
      if (startDateFrom) filter.startDate.$gte = new Date(startDateFrom);
      if (startDateTo) filter.startDate.$lte = new Date(startDateTo);
    }
    if (endDateFrom || endDateTo) {
      filter.endDate = {};
      if (endDateFrom) filter.endDate.$gte = new Date(endDateFrom);
      if (endDateTo) filter.endDate.$lte = new Date(endDateTo);
    }

    // locations (exact, case-insensitive)
    if (startLocation) {
      filter.startLocation = { $regex: `^${startLocation}$`, $options: "i" };
    }
    if (endLocation) {
      filter.endLocation = { $regex: `^${endLocation}$`, $options: "i" };
    }

    // avgRating range (uses stored avgRating on Pack)
    if (avgRatingMin || avgRatingMax) {
      filter.avgRating = {};
      if (avgRatingMin) filter.avgRating.$gte = Number(avgRatingMin);
      if (avgRatingMax) filter.avgRating.$lte = Number(avgRatingMax);
    }

    // maxClients range
    if (maxClientsMin || maxClientsMax) {
      filter.maxClients = {};
      if (maxClientsMin) filter.maxClients.$gte = Number(maxClientsMin);
      if (maxClientsMax) filter.maxClients.$lte = Number(maxClientsMax);
    }

 // Filter by category VALUE (name), e.g. ?categoryValue=Adventure,Desert
if (req.query.categoryValue) {
  const values = req.query.categoryValue
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Find categories whose name matches (case-insensitive, exact)
  const categoriesFound = await Category.find({
    name: { $in: values.map((v) => new RegExp(`^${v}$`, "i")) },
  }).select("_id");

  const categoryIds = categoriesFound.map((c) => c._id);

  if (categoryIds.length) {
    // Packs that have ANY of these categories
    filter.categories = { $in: categoryIds };
  } else {
    // No category matched the provided names → force empty result
    filter._id = { $in: [] };
  }
}


    // pagination + sort
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortParam = req.query.sort || ""; // e.g. "price" or "-price"
    const options = { page, limit };
    if (sortParam) options.sort = sortParam;

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
      limit: parseInt(req.query.limit) || 10,
    };

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

    // NEW: normalize categories (JSON string / CSV / single)
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

    // 🆕 Convert category names → IDs if needed
    if (categories && categories.length > 0) {
      const first = categories[0];
      // If looks like a name (not ObjectId)
      if (typeof first === "string" && first.length < 24) {
        // Find matching categories in DB
        const foundCategories = await Category.find({ name: { $in: categories } });

        // ⚠️ If not all category names were found, throw error
        if (foundCategories.length !== categories.length) {
          const foundNames = foundCategories.map((c) => c.name.toLowerCase());
          const missing = categories.filter(
            (n) => !foundNames.includes(n.toLowerCase())
          );
          return res.status(400).json({
            message: `These categories were not found: ${missing.join(", ")}`,
          });
        }

        categories = foundCategories.map((c) => c._id);
      }
    }

    const guideId = req.user.id;
    const profileImgUrl = req.file?.path; // e.g. https://res.cloudinary.com/...

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
      profileImg: profileImgUrl, // store the URL in MongoDB
      categories,
    });

    const savedPack = await newPack.save();
    res.status(201).json(savedPack);
  } catch (error) {
    res.status(500).json({ message: "Error creating pack", error: error.message });
  }
};


// Gets a pack by it's ID. Makes sure the guides only get access to their packs and not to other guides packs.
const getPackById = async (req, res) => {
  try {
    // For public access, always fetch the pack
    // Only apply guide restriction if user is authenticated AND is a guide
    let pack;
    
    if (req.user && req.user.role.toLowerCase() === "guide") {
      // Authenticated guide: only show their own packs
      pack = await Pack.findOne({ 
        _id: req.params.id, 
        guideId: req.user.id 
      }).populate('guidesPlacesId', 'name city country images description');
    } else {
      // Public or non-guide: show any pack
      pack = await Pack.findById(req.params.id)
        .populate('guidesPlacesId', 'name city country images description');
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
    const packObj =
      typeof pack.toObject === "function" ? pack.toObject() : pack;
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

    // 🆕 Handle categories by name only
    if (updateData.categories) {
      // Normalize to array
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

      // Clean up values
      updateData.categories = updateData.categories
        .map((s) => (typeof s === "string" ? s.trim() : s))
        .filter(Boolean);

      // Find categories by name (case-insensitive)
      const nameRegexes = updateData.categories.map((n) => new RegExp(`^${n}$`, "i"));
      const found = await Category.find({ name: { $in: nameRegexes } });

      // Check for missing ones
      if (found.length !== updateData.categories.length) {
        const foundLower = found.map((c) => c.name.toLowerCase());
        const missing = updateData.categories.filter(
          (n) => !foundLower.includes(n.toLowerCase())
        );
        return res.status(400).json({
          message: `These categories were not found: ${missing.join(", ")}`,
        });
      }

      // Replace names with IDs
      updateData.categories = found.map((c) => c._id);
    }

    // If new image uploaded
    if (req.file?.path) {
      updateData.profileImg = req.file.path;
    }

    const updatedPack = await Pack.findOneAndUpdate(
      { _id: req.params.id, guideId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPack) {
      return res.status(404).json({ message: "Pack not found" });
    }

    res.status(200).json(updatedPack);
  } catch (error) {
    res.status(500).json({ message: "Error updating pack", error: error.message });
  }
};


// Delete a pack. Makes sure only guides have access to this controller
const deletePack = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== "guide") {
      return res
        .status(403)
        .json({
          message:
            "You don't seem to have the right permissions to perform this action",
        });
    }
    const pack = await Pack.findOneAndDelete({
      _id: req.params.id,
      guideId: req.user.id,
    });

    if (!pack) {
      return res.status(404).json({ message: "Pack not found" });
    }

    res.status(202).json(pack);
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


// Get monthly pack creation stats
const getMonthlyPackStats = async (req, res) => {
  try {
    const guideId = req.user?.id;
    const userRole = req.user?.role;

    // Get year from query or use current year
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    // Define date range for the year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    let matchCondition = {};

    // If user is a guide, filter by their packs only
    if (userRole === 'guide') {
      matchCondition.guideId = new mongoose.Types.ObjectId(guideId);
    }

    // First, check if packs have createdAt field
    const samplePack = await Pack.findOne(matchCondition);
    const hasCreatedAt = samplePack && samplePack.createdAt;

    console.log("📊 Sample pack:", samplePack);
    console.log("📊 Has createdAt:", hasCreatedAt);

    let stats;
    
    if (hasCreatedAt) {
      // If packs have createdAt, filter by year
      matchCondition.createdAt = { $gte: startDate, $lte: endDate };
      
      stats = await Pack.aggregate([
        { $match: matchCondition },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    } else {
      // If no createdAt, distribute all packs across months evenly or use startDate
      stats = await Pack.aggregate([
        { $match: matchCondition },
        {
          $group: {
            _id: { $month: "$startDate" }, // Use startDate as fallback
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    }

    console.log("📊 Stats from DB:", stats);

    // Create array with all 12 months
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const result = monthNames.map((month, index) => {
      const monthData = stats.find(s => s._id === index + 1);
      return {
        month: month,
        packs: monthData ? monthData.count : 0
      };
    });

    console.log("📊 Final result:", result);

    res.status(200).json({
      success: true,
      year: year,
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
