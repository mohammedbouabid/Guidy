// src/Routes/packRoutes.js
import express from "express";
import {
  getAllPacks,
  createPack,
  getPackById,
  updatePack,
  deletePack,
} from "../Controllers/packController.js";

import { verifyToken } from "../Middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRole.js";
import { requireProfileCompletion } from "../Middlewares/requireProfileFields.js";
import { packRulesMw } from "../Validations/packValidator.js";

// 🆕 import the upload middleware
import upload from "../Middlewares/upload.js";

const router = express.Router();

// All routes protected
router.use(verifyToken);

// List + details
router.get("/", getAllPacks);
router.get("/:id", getPackById);

// 🆕 Create: accept a single file named "profileImg"
router.post(
  "/",
  authorizeRoles(["guide", "admin"]),
  upload.single("profileImg"),           // <— Upload to Cloudinary here
  packRulesMw("create"),
  requireProfileCompletion,
  createPack
);

// 🆕 Update: optionally replace the image
router.put(
  "/:id",
  authorizeRoles(["guide", "admin"]),
  upload.single("profileImg"),           // <— If a new image is sent
  packRulesMw("update"),
  updatePack
);

router.delete("/:id", authorizeRoles(["guide", "admin"]), deletePack);

export default router;
