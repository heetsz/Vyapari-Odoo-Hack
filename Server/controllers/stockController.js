import Stock from "../models/Stock.js";
import Product from "../models/Product.js";
import Location from "../models/Location.js";

export const getStockByProduct = async (req, res) => {
  try {
    const { product_id } = req.query;
    
    if (!product_id) {
      return res.status(400).json({ error: "product_id is required" });
    }

    const stocks = await Stock.find({ product_id })
      .populate("product_id", "product_name name");

    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllStock = async (req, res) => {
  try {
    const stocks = await Stock.find()
      .populate("product_id", "product_name name");

    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { product_id, quantity, freeToUse } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: "product_id is required" });
    }

    // Find or create stock record
    let stock = await Stock.findOne({ product_id });

    if (stock) {
      stock.quantity = quantity !== undefined ? quantity : stock.quantity;
      stock.freeToUse = freeToUse !== undefined ? freeToUse : stock.freeToUse;
      await stock.save();
    } else {
      stock = new Stock({
        product_id,
        quantity: quantity || 0,
        freeToUse: freeToUse !== undefined ? freeToUse : quantity || 0
      });
      await stock.save();
    }

    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
