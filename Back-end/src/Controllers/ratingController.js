import mongoose from "mongoose";
import Rating from "../Models/Rating.js";
import Pack from "../Models/Pack.js";
import Booking from "../Models/Booking.js";

// Create New Rating
export const addRating = async (req, res, next) => {
  try {
    const { stars, comment, packID } = req.body;

    const userId = req.user.id;

    const pack = await Pack.findById(packID);

    if (!pack) {
      const error = new Error("pack doesn't exist");
      error.statusCode = 404;
      throw error;
    }

    // Check if the user already booked this pack (Booking model uses userID)
    const booking = await Booking.findOne({
      userID: userId,
      packID: packID,
      isCancelled: false,
      isCompleted: true,
    });

    if (!booking) {
      const error = new Error("you can only rate a pack you have booked");
      error.statusCode = 403;
      throw error;
    }

    // Prevent rating the same pack multiple times
    const alreadyRated = await Rating.findOne({
      clientID: userId,
      packID,
    });

    if (alreadyRated) {
      const error = new Error("you already rated this pack");
      error.statusCode = 400;
      throw error;
    }

    const rating = await Rating.create({
      stars,
      comment,
      packID,
      clientID: userId,
    });

    res.status(201).json({
      success: true,
      message: "rating added successfully"
    });
  } catch (err) {
    next(err);
  }
};

// Update Rating
export const updateRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stars, comment } = req.body;

    const userId = req.user?.id;

    if (!stars) {
      const error = new Error("please provide a stars value");
      error.statusCode = 400;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("rating not found");
      error.statusCode = 404;
      throw error;
    }

    // Find the rating
    const ratingExist = await Rating.findById(id);
    if (!ratingExist) {
      const error = new Error("rating not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if the logged-in client is the rating owner
    if (ratingExist.clientID.toString() !== userId) {
      const error = new Error("you are not allowed to update this rating");
      error.statusCode = 403;
      throw error;
    }

    const updateData = { stars };
    if (comment !== undefined) updateData.comment = comment;

    const rating = await Rating.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "rating updated successfully"
    });
  } catch (err) {
    next(err);
  }
};

// Delete Ratings
export const deleteRating = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("rating not found");
      error.statusCode = 404;
      throw error;
    }

    const userId = req.user?.id;
    const userRole = req.user?.role;
    const ratingToDelete = await Rating.findById(id);

    if (!ratingToDelete) {
      const error = new Error("rating not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if the logged in client is the rating owner
    if (userRole === "client" && ratingToDelete.clientID.toString() !== userId) {
      const error = new Error("you are not allowed to delete this rating");
      error.statusCode = 403;
      throw error;
    }

    await Rating.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "rating deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get All Ratings (Enhanced for Admin)
export const getAllRatings = async (req, res, next) => {
  try {
    const { 
      page, 
      limit, 
      search = "",
      sortField = "createdAt", 
      sortOrder = "desc",
      stars: starsFilter,
      dateFilter = ""
    } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    let filterQuery = {};
    
    // Date filter
    if (dateFilter) {
      const now = new Date();
      let startDate;

      switch (dateFilter) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
      }

      if (startDate) {
        filterQuery.createdAt = { $gte: startDate };
      }
    }

    // Filter by stars
    if (starsFilter) {
      filterQuery.stars = parseInt(starsFilter);
    }

    // Build sort option
    let sortOption = {};
    if (sortField) {
      const sortOrderValue = sortOrder === "asc" ? 1 : -1;
      sortOption[sortField] = sortOrderValue;
    } else {
      sortOption = { createdAt: -1 };
    }

    // First, get all ratings with population for search
    let query = Rating.find(filterQuery)
      .populate("packID", "title price profileImg")
      .populate("clientID", "name email");

    // If search exists, we need to filter after population
    if (search) {
      const allRatings = await query
        .select("stars comment createdAt packID clientID")
        .sort(sortOption);

      // Filter in memory based on populated fields
      const filteredRatings = allRatings.filter(rating => {
        const searchLower = search.toLowerCase();
        const commentMatch = rating.comment?.toLowerCase().includes(searchLower);
        const packTitleMatch = rating.packID?.title?.toLowerCase().includes(searchLower);
        const clientNameMatch = rating.clientID?.name?.toLowerCase().includes(searchLower);
        const clientEmailMatch = rating.clientID?.email?.toLowerCase().includes(searchLower);
        
        return commentMatch || packTitleMatch || clientNameMatch || clientEmailMatch;
      });

      // Apply pagination to filtered results
      const paginatedRatings = filteredRatings.slice(skip, skip + limitNum);
      const total = filteredRatings.length;
      const totalPages = Math.ceil(total / limitNum);

      return res.status(200).json({
        success: true,
        count: total,
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages,
        ratings: paginatedRatings,
      });
    }

    // No search - use normal query with pagination
    const ratings = await Rating.find(filterQuery)
      .populate("packID", "title price")
      .populate("clientID", "name email")
      .select("stars comment createdAt")
      .skip(skip)
      .limit(limitNum)
      .sort(sortOption);

    const total = await Rating.countDocuments(filterQuery);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: total,
      page: pageNum,
      limit: limitNum,
      totalPages: totalPages,
      ratings: ratings,
    });
  } catch (err) {
    next(err);
  }
};

// Get Rating By ID (New)
export const getRatingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("rating not found");
      error.statusCode = 404;
      throw error;
    }

    const rating = await Rating.findById(id)
      .populate("packID", "title price images")
      .populate("clientID", "name email");

    if (!rating) {
      const error = new Error("rating not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(rating);
  } catch (err) {
    next(err);
  }
};

// Get Ratings By Pack
export const getRatingsByPack = async (req, res, next) => {
  try {
    const { page, limit, stars = "stars", order } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5;
    const skip = (pageNum - 1) * limitNum;

    let sortOption = {};
    if (stars) {
      const sortOrder = order === "asc" ? 1 : -1;
      sortOption["stars"] = sortOrder;
    } else {
      sortOption = { createdAt: -1 };
    }
    const { packId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(packId)) {
      const error = new Error("pack not found");
      error.statusCode = 404;
      throw error;
    }

    const pack = await Pack.findById(packId);

    if (!pack) {
      const error = new Error("pack not found");
      error.statusCode = 404;
      throw error;
    }

    const ratings = await Rating.find({ packID: packId })
      .populate("clientID", "name email")
      .populate("packID", "profileImg")
      .select("stars comment createdAt")
      .skip(skip)
      .limit(limitNum)
      .sort(sortOption);
    // Return empty list gracefully when there are no ratings

    const total = await Rating.countDocuments({ packID: packId });

    res.status(200).json({
      success: true,
      totalRatings: total,
      page: pageNum,
      limit: limitNum,
      ratings: ratings,
    });
  } catch (err) {
    next(err);
  }
};