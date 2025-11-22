import Receipt from "../models/Receipt.js";
import ReceiptItem from "../models/ReceiptItem.js";
import Stock from "../models/Stock.js";

export const getReceipts = async (req, res) => {
  try {
    const { status, supplier_id, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (supplier_id) filter.supplier_id = supplier_id;
    if (search) {
      filter.$or = [
        { receipt_number: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } }
      ];
    }

    const receipts = await Receipt.find(filter)
      .populate("supplier_id", "name")
      .populate("created_by", "name email")
      .populate("validated_by", "name email")
      .sort({ createdAt: -1 });

    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate("supplier_id", "name phone email address")
      .populate("created_by", "name email")
      .populate("validated_by", "name email");

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    const items = await ReceiptItem.find({ receipt_id: receipt._id })
      .populate("product_id", "product_name sku");

    res.json({ receipt, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createReceipt = async (req, res) => {
  try {
    const { supplier_id, scheduled_date, notes } = req.body;

    if (!supplier_id) {
      return res.status(400).json({ error: "Supplier is required" });
    }

    // Generate receipt number
    const count = await Receipt.countDocuments();
    const receipt_number = `WH/IN/${String(count + 1).padStart(4, "0")}`;

    const receipt = new Receipt({
      receipt_number,
      supplier_id,
      scheduled_date,
      notes,
      status: "Draft",
      created_by: req.user._id
    });

    await receipt.save();
    res.status(201).json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReceipt = async (req, res) => {
  try {
    const { supplier_id, scheduled_date, notes } = req.body;

    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    if (receipt.status === "Done") {
      return res.status(400).json({ error: "Cannot edit a completed receipt" });
    }

    receipt.supplier_id = supplier_id || receipt.supplier_id;
    receipt.scheduled_date = scheduled_date || receipt.scheduled_date;
    receipt.notes = notes !== undefined ? notes : receipt.notes;

    await receipt.save();
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const validateReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    if (receipt.status === "Done") {
      return res.status(400).json({ error: "Receipt is already completed" });
    }

    // Get receipt items
    const items = await ReceiptItem.find({ receipt_id: receipt._id });
    if (items.length === 0) {
      return res.status(400).json({ error: "Cannot validate receipt without items" });
    }

    // Check if moving to Done status
    const newStatus = req.body.status;
    if (newStatus === "Done") {
      // Update stock for each item
      for (const item of items) {
        // Update or create stock record
        let stock = await Stock.findOne({
          product_id: item.product_id
        });

        if (stock) {
          stock.quantity += item.quantity_received;
          stock.freeToUse += item.quantity_received;
          await stock.save();
        } else {
          stock = new Stock({
            product_id: item.product_id,
            quantity: item.quantity_received,
            freeToUse: item.quantity_received
          });
          await stock.save();
        }
      }

      receipt.validated_by = req.user._id;
      receipt.validated_at = new Date();
    }

    receipt.status = newStatus;
    await receipt.save();

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    if (receipt.status === "Done") {
      return res.status(400).json({ error: "Cannot delete a completed receipt" });
    }

    // Delete associated items
    await ReceiptItem.deleteMany({ receipt_id: receipt._id });

    await receipt.deleteOne();
    res.json({ message: "Receipt deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Receipt Items endpoints
export const addReceiptItem = async (req, res) => {
  try {
    const { product_id, quantity_received, unit_price } = req.body;

    if (!product_id || !quantity_received) {
      return res.status(400).json({ error: "Product and quantity are required" });
    }

    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    if (receipt.status === "Done") {
      return res.status(400).json({ error: "Cannot add items to a completed receipt" });
    }

    const item = new ReceiptItem({
      receipt_id: receipt._id,
      product_id,
      quantity_received,
      unit_price
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReceiptItem = async (req, res) => {
  try {
    const { product_id, quantity_received, unit_price } = req.body;

    const item = await ReceiptItem.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ error: "Receipt item not found" });
    }

    const receipt = await Receipt.findById(item.receipt_id);
    if (receipt.status === "Done") {
      return res.status(400).json({ error: "Cannot edit items of a completed receipt" });
    }

    item.product_id = product_id || item.product_id;
    item.quantity_received = quantity_received !== undefined ? quantity_received : item.quantity_received;
    item.unit_price = unit_price !== undefined ? unit_price : item.unit_price;

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReceiptItem = async (req, res) => {
  try {
    const item = await ReceiptItem.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ error: "Receipt item not found" });
    }

    const receipt = await Receipt.findById(item.receipt_id);
    if (receipt.status === "Done") {
      return res.status(400).json({ error: "Cannot delete items from a completed receipt" });
    }

    await item.deleteOne();
    res.json({ message: "Receipt item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
