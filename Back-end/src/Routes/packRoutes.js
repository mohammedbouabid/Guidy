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
} from "../Controllers/packController.js";

import { verifyToken } from "../Middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRole.js";
import { getPacksFiltered } from "../Controllers/packController.js"; // ← add this import
import Pack from "../Models/Pack.js";


const router = express.Router();

// --- Public routes ---
router.get("/", getAllPacks);
router.get("/popular", getPopularPacks); //  new endpoint
router.get("/:id", getPackById);


router.use(verifyToken);
// Use the new upload middleware
router.post(
  "/",
  authorizeRoles(["guide", "admin"]),
  uploadPackImage.single("profileImg"),
  createPack
);
 // ← add this line BEFORE "/:id"

router.put(
  "/:id",
  authorizeRoles(["guide", "admin"]),
  uploadPackImage.single("profileImg"),
  updatePack
);


router.delete("/:id", authorizeRoles(["guide", "admin"]), deletePack);
// in your routes file



export default router;