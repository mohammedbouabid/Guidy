import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../Models/User.js";

// Add New User
const addUser = async (req, res, next) => {
  try {
    const newUser = { ...req.body };
    newUser.email = newUser.email.toLowerCase();
    newUser.name = newUser.name.toLowerCase();

    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) {
      const error = new Error("email already exists");
      error.statusCode = 400;
      throw error;
    }

    newUser.password = await bcrypt.hash(newUser.password, 10);
    await User.create(newUser);

    res
      .status(201)
      .json({ success: true, message: `${newUser.role} successfuly created` });
  } catch (err) {
    next(err);
  }
};

// Update User by His Id
const updateUser = async (req, res, next) => {
  try {
    const update = { ...req.body };

    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (req.file) {
      const profileImage = req.file.path;
      update.profileImage = profileImage;
    }

    const user = await User.findById(userId);

    if (
      ["client", "guide"].includes(userRole) &&
      user._id.toString() !== userId
    ) {
      const error = new Error("not allowed to update other " + user.role);
      error.statusCode = 404;
      throw error;
    }

    if (update.email) {
      update.email = update.email.toLowerCase();
      const existingUser = await User.findOne({ email: update.email });
      if (existingUser) {
        const error = new Error("email already exists");
        error.statusCode = 400;
        throw error;
      }
    }

    if (update.name) {
      update.name = update.name.toLowerCase();
    }

    if (update.phone) {
      const existingPhone = await User.findOne({ phone: update.phone });
      if (existingPhone) {
        const error = new Error("phone already exists");
        error.statusCode = 400;
        throw error;
      }
    }

    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }

    delete update.refreshToken;
    delete update.cin;
    delete update.role;

    await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .json({ success: true, user: `${userRole} updated successfuly` });
  } catch (error) {
    next(error);
  }
};

// Delete single user by ID
const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (
      ["client", "guide"].includes(userRole) &&
      user._id.toString() !== userId
    ) {
      const error = new Error("not allowed to delete other " + user.role);
      error.statusCode = 404;
      throw error;
    }

    if (user.role === "admin") {
      const error = new Error("admin can't be deleted");
      error.statusCode = 400;
      throw error;
    }

    if (user.isDeleted) {
      const error = new Error("user already deleted");
      error.statusCode = 400;
      throw error;
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    // Check if the logged-in client delete himself
    if (user._id.toString() === userId) {
      next();
    } else {
      res.status(200).json({
        success: true,
        message: "user soft-deleted successfully",
      });
    }
  } catch (err) {
    next(err);
  }
};

// Delete multiple users by IDs
const deleteManyUsers = async (req, res, next) => {
  try {
    let { id } = req.body;

    if (!id) {
      const error = new Error("please provide users ID's to delete");
      error.statusCode = 400;
      throw error;
    }

    if (!id.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      const error = new Error("one or more user not found");
      error.statusCode = 400;
      throw error;
    }
    // Find users that actually exist
    const existingUsers = await User.find({ _id: { $in: id } });

    if (existingUsers.length !== id.length) {
      const error = new Error("one or more user not found");
      error.statusCode = 400;
      throw error;
    }

    if (!Array.isArray(id)) id = [id];

    const result = await User.updateMany(
      { _id: { $in: id }, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} users soft-deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};

// Get all Users (Guide and Client)
const getAllUsers = async (req, res, next) => {
  try {
    const {
      role,
      search,
      page,
      limit,
      sort,
      order,
      dateFilter,
      profileCompletionFilter,
    } = req.query;
    const normalizedRole = role ? role.toLowerCase() : null;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    let sortOption = {};
    if (sort) {
      const sortOrder = order === "desc" ? -1 : 1;
      sortOption[sort] = sortOrder;
    } else {
      sortOption = { createdAt: -1 };
    }

    let query = { role: { $in: ["guide", "client"] }, isDeleted: false };

    // Filter by role if provided
    if (role) {
      if (["guide", "client"].includes(normalizedRole)) {
        query.role = normalizedRole;
      } else if (normalizedRole === "admin") {
        const error = new Error(`admin can't be showed here`);
        error.statusCode = 400;
        throw error;
      } else {
        const error = new Error(`no role as ${role}`);
        error.statusCode = 404;
        throw error;
      }
    }

    // Date filter logic
    if (dateFilter) {
      const now = new Date();
      let startDate;

      switch (dateFilter) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = null;
      }
      console.log(startDate);

      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }

    // Profile Completion filter logic
    if (profileCompletionFilter) {
      switch (profileCompletionFilter) {
        case "complete":
          // Both phone and CIN must exist
          query.phone = { $exists: true, $ne: null, $ne: "" };
          query.cin = { $exists: true, $ne: null, $ne: "" };
          break;
        case "incomplete":
          // Either phone or CIN is missing
          query.$or = [
            { phone: { $exists: false } },
            { phone: null },
            { phone: "" },
            { cin: { $exists: false } },
            { cin: null },
            { cin: "" },
          ];
          break;
        case "no-phone":
          // Phone is missing
          query.$or = [
            { phone: { $exists: false } },
            { phone: null },
            { phone: "" },
          ];
          break;
        case "no-cin":
          // CIN is missing
          query.$or = [{ cin: { $exists: false } }, { cin: null }, { cin: "" }];
          break;
      }
    }

    // Search by name or email if provided
    if (search) {
      const regex = new RegExp(search, "i");
      const searchQuery = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { cin: regex },
      ];

      // If there's already an $or from profile completion filter, combine them properly
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchQuery }];
        delete query.$or;
      } else {
        query.$or = searchQuery;
      }
    }

    const users = await User.find(query)
      .select("profileImage name email phone cin createdAt")
      .skip(skip)
      .limit(limitNum)
      .sort(sortOption);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: count,
      page: pageNum,
      limit: limitNum,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// Get user (guide or client) by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findOne({
      _id: id,
      isDeleted: false,
    }).select("profileImage name email phone cin createdAt role");

    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// Get user
const getUser = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const user = await User.findOne({
      _id: userId,
      isDeleted: false,
    }).select("name email profileImage");

    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export {
  addUser,
  updateUser,
  deleteUserById,
  deleteManyUsers,
  getAllUsers,
  getUserById,
  getUser,
};
