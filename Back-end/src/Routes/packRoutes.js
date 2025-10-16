// src/Routes/packRoutes.js
import express from "express";
import uploadPackImage from "../Middlewares/uploadPackImage.js"; // 🆕 new middleware
import {
  createPack,
  updatePack,
  getAllPacks,
  getPackById,
  deletePack,
} from "../Controllers/packController.js";

import { verifyToken } from "../Middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRole.js";
import { getPacksFiltered } from "../Controllers/packController.js"; // ← add this import


const router = express.Router();
router.use(verifyToken);

// Use the new upload middleware
router.post(
  "/",
  authorizeRoles(["guide", "admin"]),
  uploadPackImage.single("profileImg"),
  createPack
);
router.get("/filter", getPacksFiltered); // ← add this line BEFORE "/:id"

router.put(
  "/:id",
  authorizeRoles(["guide", "admin"]),
  uploadPackImage.single("profileImg"),
  updatePack
);

router.get("/", getAllPacks);
router.get("/:id", getPackById);
router.delete("/:id", authorizeRoles(["guide", "admin"]), deletePack);

export default router;
