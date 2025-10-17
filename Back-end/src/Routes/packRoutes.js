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
import Pack from "../Models/Pack.js";


const router = express.Router();

// in your /public route
router.get("/public", async (req, res) => {
  try {
    const packs = await Pack.find()
      .sort({ profileImg: -1 }) // packs with profileImg not null/empty come first
      .limit(8)

    res.json({ docs: packs })
  } catch (err) {
    console.error("Error in /public route:", err)
    res.status(500).json({ message: "Error fetching packs" })
  }
})


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
// in your routes file



export default router;