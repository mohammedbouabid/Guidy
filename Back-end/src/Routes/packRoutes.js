// src/Routes/packRoutes.js
import express from "express";
import uploadPackImage from "../Middlewares/uploadPackImage.js"; // 🆕 new middleware
import {
  createPack,
  updatePack,
  getAllPacks,
  getPopularPacks,
  getPackById,
  deletePack,
  getAllPacksForGuide,
} from "../Controllers/packController.js";

import { verifyToken } from "../Middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRole.js";
import { getPacksFiltered } from "../Controllers/packController.js"; // ← add this import
import Pack from "../Models/Pack.js";

const router = express.Router();

// --- Protected routes (require authentication) ---

router.get("/", getAllPacks);
router.get("/popular", getPopularPacks); // 👈 new endpoint
router.get("/all",verifyToken , getAllPacksForGuide);
router.get("/:id", getPackById);

router.post(
  "/",verifyToken ,
  authorizeRoles(["guide", "admin"]),
  uploadPackImage.single("profileImg"),
  createPack
);

router.put(
  "/:id",verifyToken ,
  authorizeRoles(["guide", "admin"]),
  uploadPackImage.single("profileImg"),
  updatePack  
);

router.delete("/:id",verifyToken , authorizeRoles(["guide", "admin"]), deletePack);

export default router;