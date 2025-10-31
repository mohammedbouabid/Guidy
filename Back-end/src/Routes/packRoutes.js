// src/Routes/packRoutes.js
import express from "express";
import uploadPackImage from "../Middlewares/uploadPackImage.js";
import {
  createPack,
  updatePack,
  getAllPacks,
  getAllPacksForGuide,
  getPacksFiltered,
  getPopularPacks,
  getPackById,
  deletePack,
} from "../Controllers/packController.js";
import { verifyToken } from "../Middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRole.js";

const router = express.Router();

// --- Protected routes (require authentication) ---

router.get("/", getAllPacks);
router.get("/filter", getPacksFiltered);
router.get("/popular", getPopularPacks);
router.get("/all", verifyToken, getAllPacksForGuide);
router.get("/:id", getPackById);

router.post(
  "/",
  verifyToken,
  authorizeRoles(["guide", "admin"]),
  uploadPackImage.single("profileImg"),
  createPack
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles(["guide", "admin"]),
  uploadPackImage.single("profileImg"),
  updatePack
);

router.delete("/:id", verifyToken, authorizeRoles(["guide", "admin"]), deletePack);

export default router;
