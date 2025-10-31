// Controllers/categoryController.js
import Category from "../Models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });

    const exists = await Category.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (exists) return res.status(409).json({ message: "Category already exists" });

    const cat = await Category.create({ name: name.trim() });
    res.status(201).json(cat);
  } catch (e) {
    res.status(500).json({ message: "Error creating category", error: e.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Category not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Error updating category", error: e.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found" });
    res.status(202).json(deleted);
  } catch (e) {
    res.status(500).json({ message: "Error deleting category", error: e.message });
  }
};

export const listCategories = async (_req, res) => {
  try {
    const cats = await Category.find({}).sort({ name: 1 });
    res.json(cats);
  } catch (e) {
    res.status(500).json({ message: "Error listing categories", error: e.message });
  }
};
