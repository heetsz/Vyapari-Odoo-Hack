import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Product insert error",err)
  }
});

// Create new category
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    const cat = new Category({ name, description });
    await cat.save();

    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Product insert error",err);
  }
});

export default router;
