// Controllers/packController.js
import mongoose from "mongoose";
import Pack from "../Models/Pack.js";
import Rating from "../Models/Rating.js";

/**
 * Helper: compute average ratings for a list of pack IDs in one aggregation.
 * Returns a Map: packId(string) -> avg(number with 2 decimals)
 */
const computeAvgMap = async (packIds) => {
  if (!packIds || !packIds.length) return new Map();

  const objectIds = packIds.map(id => new mongoose.Types.ObjectId(id));
  const result = await Rating.aggregate([
    { $match: { packID: { $in: objectIds } } },
    { $group: { _id: "$packID", avgRating: { $avg: "$stars" } } }
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
      priceMin, priceMax,
      startDateFrom, startDateTo,
      endDateFrom, endDateTo,
      startLocation, endLocation,
      avgRatingMin, avgRatingMax,
      maxClientsMin, maxClientsMax,
    } = req.query;

    // Build MongoDB filter object
    const filter = {};

    // If caller is a GUIDE, restrict to their packs automatically
    if (req.user?.role?.toLowerCase() === "guide") {
      filter.guideId = req.user.id;
    }

    // id/guideId (admin/client can pass guideId; guide already restricted)
    if (id) {
      try { filter._id = new mongoose.Types.ObjectId(id); } catch { }
    }
    if (guideId && req.user?.role?.toLowerCase() !== "guide") {
      try { filter.guideId = new mongoose.Types.ObjectId(guideId); } catch { }
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

    // pagination + sort
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortParam = req.query.sort || ""; // e.g. "price" or "-price"
    // build options without sort by default
    const options = { page, limit };
    if (sortParam) options.sort = sortParam;  // only attach when non-empty

    const packs = await Pack.paginate(filter, options);
    return res.status(200).json(packs);
  } catch (error) {
    return res.status(500).json({ message: "Error filtering packs", error: error.message });
  }
};

// Gets all the packs. Makes sure the guides get only the packs they need, which are their packs.
const getAllPacks = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    let packs;
    
      packs = await Pack.paginate({}, options);
    

    // --- NEW: compute averages for all packs in this page in a single aggregation
    const ids = (packs.docs || []).map(p => p._id);
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
          update: { $set: { avgRating: avg } }
        }
      });
    }

    if (bulkOps.length) {
      await Pack.bulkWrite(bulkOps);
    }

    return res.status(200).json(packs);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching packs', error: error.message });
  }
};

const getAllPacksForGuide  = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      populate: {
        path: 'guidesPlacesId',
        select: 'name city country images description'
      }
    };

    // 🎯 Récupérer uniquement les packs du user connecté avec populate
    const packs = await Pack.paginate({ guideId: req?.user?.id }, options);

    // 🔢 Récupérer les IDs pour calculer les moyennes
    const ids = (packs.docs || []).map((p) => p._id);
    const avgMap = await computeAvgMap(ids);

    // 🔁 Mettre à jour la moyenne de chaque pack
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
    if (req.user.role.toLowerCase() !== 'guide') {
      return res.status(403).json({ message: 'You don\'t seem to have the right permissions to perform this action' });
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
      maxClients
    } = req.body;

    // Parse guidesPlacesId if it's a string (from FormData)
    if (guidesPlacesId && typeof guidesPlacesId === 'string') {
      try {
        guidesPlacesId = JSON.parse(guidesPlacesId);
      } catch (e) {
        // If it's not valid JSON, try to split by comma
        guidesPlacesId = guidesPlacesId.split(',').map(id => id.trim());
      }
    }
    
    // Ensure guidesPlacesId is an array
    if (guidesPlacesId && !Array.isArray(guidesPlacesId)) {
      guidesPlacesId = [guidesPlacesId];
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
      profileImg: profileImgUrl, // <— store the URL in MongoDB
    });
    const savedPack = await newPack.save();
    res.status(201).json(savedPack);
  } catch (error) {
    res.status(500).json({ message: 'Error creating pack', error: error.message });
  }
};

// Gets a pack by it's ID. Makes sure the guides only get access to their packs and not to other guides packs.
const getPackById = async (req, res) => {
  try {
    let pack;
    if (req.user.role.toLowerCase() === "guide") {
      pack = await Pack.findOne({ _id: req.params.id, guideId: req.user.id })
        .populate('guidesPlacesId', 'name city country images description');
    } else {
      pack = await Pack.findById(req.params.id)
        .populate('guidesPlacesId', 'name city country images description');
    }

    if (!pack) {
      return res.status(404).json({ message: 'Pack not found' });
    }

    // --- NEW: compute average for this single pack and persist it
    const result = await Rating.aggregate([
      { $match: { packID: new mongoose.Types.ObjectId(pack._id) } },
      { $group: { _id: "$packID", avgRating: { $avg: "$stars" } } }
    ]);
    const avg = result.length ? Number(Number(result[0].avgRating).toFixed(2)) : 0;

    // attach to response (ensure plain object if needed)
    const packObj = typeof pack.toObject === "function" ? pack.toObject() : pack;
    packObj.avgRating = avg;

    // persist in DB
    await Pack.updateOne({ _id: pack._id }, { $set: { avgRating: avg } });

    return res.status(200).json(packObj);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pack', error: error.message });
  }
};

// Update a pack. Makes sure only the owner guides have access to the pack update.
const updatePack = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== 'guide') {
      return res.status(403).json({ message: 'You don\'t seem to have the right permissions to perform this action' });
    }

    // Prepare update data
    const updateData = { ...req.body };
    
    // Parse guidesPlacesId if it's a string (from FormData)
    if (updateData.guidesPlacesId && typeof updateData.guidesPlacesId === 'string') {
      try {
        updateData.guidesPlacesId = JSON.parse(updateData.guidesPlacesId);
      } catch (e) {
        // If it's not valid JSON, try to split by comma
        updateData.guidesPlacesId = updateData.guidesPlacesId.split(',').map(id => id.trim());
      }
    }
    
    // Ensure guidesPlacesId is an array
    if (updateData.guidesPlacesId && !Array.isArray(updateData.guidesPlacesId)) {
      updateData.guidesPlacesId = [updateData.guidesPlacesId];
    }
    
    // If a new image was uploaded, use its URL
    if (req.file?.path) {
      updateData.profileImg = req.file.path;
    }

    const updatedPack = await Pack.findOneAndUpdate(
      { _id: req.params.id, guideId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPack) {
      return res.status(404).json({ message: 'Pack not found' });
    }

    res.status(200).json(updatedPack);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pack', error: error.message });
  }
};

// Delete a pack. Makes sure only guides have access to this controller
const deletePack = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== 'guide') {
      return res.status(403).json({ message: 'You don\'t seem to have the right permissions to perform this action' });
    }
    const pack = await Pack.findOneAndDelete({ _id: req.params.id, guideId: req.user.id });

    if (!pack) {
      return res.status(404).json({ message: 'Pack not found' });
    }

    res.status(202).json(pack);
  } catch (error) {   
    res.status(500).json({ message: 'Error deleting pack', error: error.message });
  }
};
const getPopularPacks = async (req, res) => {
  try {
    const packs = await Pack.find({
       // only packs with a rating above 0
    })
      .sort({ avgRating: -1 }) // highest rated first
      .limit(8); // top 8 for homepage

    res.json({ docs: packs });
  } catch (err) {
    console.error("Error in getPopularPacks:", err);
    res.status(500).json({ message: "Error fetching popular packs" });
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
};
