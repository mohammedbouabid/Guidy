// Routes/categoryRoutes.js
import express from "express";
import { verifyToken } from "../Middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRole.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
} from "../Controllers/categoryController.js";

const router = express.Router();

// Public: anyone can list categories
router.get("/", listCategories);

// Protected admin-only: manage categories
router.use(verifyToken);
router.post("/", authorizeRoles(["admin"]), createCategory);
router.put("/:id", authorizeRoles(["admin"]), updateCategory);
router.delete("/:id", authorizeRoles(["admin"]), deleteCategory);

export default router;
