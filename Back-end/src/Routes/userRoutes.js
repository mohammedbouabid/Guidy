import express from "express";
import { addUser, updateUser, deleteUserById, deleteManyUsers, getAllUsers, getUserById, getUser , changePassword, getUserStats, getPublicStats, getFeaturedGuides, getAllGuidesPublic, getGuideProfile } from "../Controllers/userController.js";
import { createUserValidation, updateUserValidation, deleteManyUsersValidation } from "../Validations/userValidator.js";
import { validate } from "../Middlewares/userValidate.js";
import { verifyToken } from "../Middlewares/verifyJwtToken.js";
import { authorizeRoles} from '../Middlewares/authorizeRole.js';

import {
  logout
} from "../Controllers/authController.js";
import upload from "../Middlewares/upload.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/stats/public", getPublicStats);
router.get("/guides/featured", getFeaturedGuides);
router.get("/guides/all", getAllGuidesPublic);
router.get("/guides/:id", getGuideProfile);

router.post("/user", verifyToken, authorizeRoles(["admin"]), createUserValidation, validate, addUser);

router.put("/user/", verifyToken, authorizeRoles(["admin", "guide", "client"]), updateUserValidation, validate, upload.single("avatar"), updateUser);
router.put("/change-password", verifyToken, authorizeRoles(["admin", "guide", "client"]), changePassword );

router.delete("/user/:id", verifyToken, authorizeRoles(["admin", "client", "guide"]), deleteUserById, logout);
router.delete("/user", verifyToken, authorizeRoles(["admin"]), deleteManyUsersValidation, validate, deleteManyUsers);

router.get("/user/stats",  getUserStats);
router.get("/user", verifyToken, authorizeRoles(["admin"]), getAllUsers);
router.get("/user/:id", verifyToken, authorizeRoles(["admin","guide", "client"]), getUserById);
router.get("/user/", verifyToken, authorizeRoles(["admin","guide", "client"]), getUser);

export default router;