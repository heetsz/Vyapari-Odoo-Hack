import Adjustment from "../models/Adjustment.js";
import Stock from "../models/Stock.js";
import StockMove from "../models/StockMove.js";

export const getAdjustments = async (req, res) => {
  try {
    const { status, adjustment_type, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (adjustment_type) filter.adjustment_type = adjustment_type;
    if (search) {
      filter.$or = [
        { adjustment_number: { $regex: search, $options: "i" } },
        { reason: { $regex: search, $options: "i" } }
      ];
    }

    const adjustments = await Adjustment.find(filter)
      .populate("product_id", "product_name sku")
      .populate("location_id", "name")
      .populate("created_by", "name email")
      .populate("validated_by", "name email")
      .sort({ createdAt: -1 });

    res.json(adjustments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdjustmentById = async (req, res) => {
  try {
    const adjustment = await Adjustment.findById(req.params.id)
      .populate("product_id", "product_name sku")
      .populate("created_by", "name email")
      .populate("validated_by", "name email");

    if (!adjustment) {
      return res.status(404).json({ error: "Adjustment not found" });
    }

    res.json(adjustment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAdjustment = async (req, res) => {
  try {
    const { product_id, system_quantity, counted_quantity, reason, notes } = req.body;

    if (!product_id || system_quantity === undefined || counted_quantity === undefined || !reason) {
      return res.status(400).json({
        error: "Product, system quantity, counted quantity, and reason are required"
      });
    }

    // Generate adjustment number
    const count = await Adjustment.countDocuments();
    const adjustment_number = `ADJ/${String(count + 1).padStart(4, "0")}`;

    const adjustment = new Adjustment({
      adjustment_number,
      product_id,
      system_quantity,
      counted_quantity,
      difference: counted_quantity - system_quantity,
      reason,
      notes,
      created_by: req.user._id
    });

    await adjustment.save();
    res.status(201).json(adjustment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAdjustment = async (req, res) => {
  try {
    const { product_id, system_quantity, counted_quantity, reason, notes } = req.body;

    const adjustment = await Adjustment.findById(req.params.id);
    if (!adjustment) {
      return res.status(404).json({ error: "Adjustment not found" });
    }

    if (adjustment.validated_at) {
      return res.status(400).json({ error: "Cannot edit a validated adjustment" });
    }

    adjustment.product_id = product_id || adjustment.product_id;
    adjustment.system_quantity = system_quantity !== undefined ? system_quantity : adjustment.system_quantity;
    adjustment.counted_quantity = counted_quantity !== undefined ? counted_quantity : adjustment.counted_quantity;
    adjustment.difference = adjustment.counted_quantity - adjustment.system_quantity;
    adjustment.reason = reason || adjustment.reason;
    adjustment.notes = notes !== undefined ? notes : adjustment.notes;

    await adjustment.save();
    res.json(adjustment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const validateAdjustment = async (req, res) => {
  try {
    const adjustment = await Adjustment.findById(req.params.id);
    if (!adjustment) {
      return res.status(404).json({ error: "Adjustment not found" });
    }

    if (adjustment.status === "Done") {
      return res.status(400).json({ error: "Adjustment is already completed" });
    }

    // Apply adjustment
    let stock = await Stock.findOne({
      product_id: adjustment.product_id
    });

    if (!stock) {
      stock = new Stock({
        product_id: adjustment.product_id,
        quantity: adjustment.counted_quantity,
        freeToUse: adjustment.counted_quantity
      });
    } else {
      // Update stock to match counted quantity
      const difference = adjustment.difference;
      stock.quantity += difference;
      stock.freeToUse += difference;
      
      if (stock.quantity < 0) {
        return res.status(400).json({
          error: "Adjustment would result in negative stock"
        });
      }
    }

    await stock.save();

    adjustment.validated_by = req.user._id;
    adjustment.validated_at = new Date();
    await adjustment.save();

    res.json(adjustment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAdjustment = async (req, res) => {
  try {
    const adjustment = await Adjustment.findById(req.params.id);
    if (!adjustment) {
      return res.status(404).json({ error: "Adjustment not found" });
    }

    if (adjustment.validated_at) {
      return res.status(400).json({ error: "Cannot delete a validated adjustment" });
    }

    await adjustment.deleteOne();
    res.json({ message: "Adjustment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
