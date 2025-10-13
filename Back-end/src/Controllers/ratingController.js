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

    // Check if the user already booked this pack
    const booking = await Booking.findOne({
      clientID: userId,
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
    const { stars } = req.body;

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

    const rating = await Rating.findByIdAndUpdate(
      id,
      { stars },
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

    // Check if the logged in client is the rating owner
    if (userRole === "client" && ratingToDelete.clientID.toString() !== userId) {
      const error = new Error("you are not allowed to delete this rating");
      error.statusCode = 403;
      throw error;
    }

    const rating = await Rating.findByIdAndDelete(id);

    if (!rating) {
      const error = new Error("rating not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "rating deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get All Ratings
export const getAllRatings = async (req, res, next) => {
  try {
    const { page, limit, stars = "stars", order } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    let sortOption = {};
    if (stars) {
      const sortOrder = order === "asc" ? 1 : -1;
      sortOption["stars"] = sortOrder;
    } else {
      sortOption = { createdAt: -1 };
    }

    const ratings = await Rating.find()
      .populate("packID", "title")
      .populate("clientID", "name email")
      .select("stars comment createdAt")
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    if (!ratings) {
      const error = new Error("no rating found");
      error.statusCode = 404;
      throw error;
    }

    const total = await Rating.countDocuments();

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
      .select("stars comment createdAt")
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    if (ratings.length === 0) {
      const error = new Error("no rating yet for this pack");
      error.statusCode = 404;
      throw error;
    }

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
