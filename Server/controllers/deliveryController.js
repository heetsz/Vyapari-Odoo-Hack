import Delivery from "../models/Delivery.js";
import DeliveryItem from "../models/DeliveryItem.js";
import Stock from "../models/Stock.js";

export const getDeliveries = async (req, res) => {
  try {
    const { status, customer_id, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (customer_id) filter.customer_id = customer_id;
    if (search) {
      filter.$or = [
        { delivery_number: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } }
      ];
    }

    const deliveries = await Delivery.find(filter)
      .populate("customer_id", "name")
      .populate("created_by", "name email")
      .populate("validated_by", "name email")
      .sort({ createdAt: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate("customer_id", "name phone email address")
      .populate("created_by", "name email")
      .populate("validated_by", "name email");

    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    const items = await DeliveryItem.find({ delivery_id: delivery._id })
      .populate("product_id", "product_name sku");

    res.json({ delivery, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDelivery = async (req, res) => {
  try {
    const { customer_id, scheduled_date, notes } = req.body;

    if (!customer_id) {
      return res.status(400).json({ error: "Customer is required" });
    }

    // Generate delivery number
    const count = await Delivery.countDocuments();
    const delivery_number = `WH/OUT/${String(count + 1).padStart(4, "0")}`;

    const delivery = new Delivery({
      delivery_number,
      customer_id,
      scheduled_date,
      notes,
      status: "Draft",
      created_by: req.user._id
    });

    await delivery.save();
    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDelivery = async (req, res) => {
  try {
    const { customer_id, scheduled_date, notes } = req.body;

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    if (delivery.status === "Done") {
      return res.status(400).json({ error: "Cannot edit a completed delivery" });
    }

    delivery.customer_id = customer_id || delivery.customer_id;
    delivery.scheduled_date = scheduled_date || delivery.scheduled_date;
    delivery.notes = notes !== undefined ? notes : delivery.notes;

    await delivery.save();
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const validateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    if (delivery.status === "Done") {
      return res.status(400).json({ error: "Delivery is already completed" });
    }

    // Get delivery items
    const items = await DeliveryItem.find({ delivery_id: delivery._id });
    if (items.length === 0) {
      return res.status(400).json({ error: "Cannot validate delivery without items" });
    }

    // Check if moving to Done status
    const newStatus = req.body.status;
    if (newStatus === "Done") {
      // Update stock for each item
      for (const item of items) {
        // Check if enough stock is available
        const stock = await Stock.findOne({
          product_id: item.product_id
        });

        if (!stock || stock.quantity < item.quantity_delivered) {
          return res.status(400).json({
            error: `Insufficient stock for product`
          });
        }

        // Reduce stock
        stock.quantity -= item.quantity_delivered;
        stock.freeToUse = Math.max(0, stock.freeToUse - item.quantity_delivered);
        await stock.save();
      }

      delivery.validated_by = req.user._id;
      delivery.validated_at = new Date();
    }

    delivery.status = newStatus;
    await delivery.save();

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    if (delivery.status === "Done") {
      return res.status(400).json({ error: "Cannot delete a completed delivery" });
    }

    // Delete associated items
    await DeliveryItem.deleteMany({ delivery_id: delivery._id });

    await delivery.deleteOne();
    res.json({ message: "Delivery deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delivery Items endpoints
export const addDeliveryItem = async (req, res) => {
  try {
    const { product_id, location_id, quantity, unit_price } = req.body;

    if (!product_id || !location_id || !quantity) {
      return res.status(400).json({ error: "Product, location, and quantity are required" });
    }

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    if (delivery.status === "Done") {
      return res.status(400).json({ error: "Cannot add items to a completed delivery" });
    }

    const item = new DeliveryItem({
      delivery_id: delivery._id,
      product_id,
      location_id,
      quantity,
      unit_price
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDeliveryItem = async (req, res) => {
  try {
    const { product_id, location_id, quantity, unit_price } = req.body;

    const item = await DeliveryItem.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ error: "Delivery item not found" });
    }

    const delivery = await Delivery.findById(item.delivery_id);
    if (delivery.status === "Done") {
      return res.status(400).json({ error: "Cannot edit items of a completed delivery" });
    }

    item.product_id = product_id || item.product_id;
    item.location_id = location_id || item.location_id;
    item.quantity = quantity !== undefined ? quantity : item.quantity;
    item.unit_price = unit_price !== undefined ? unit_price : item.unit_price;

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDeliveryItem = async (req, res) => {
  try {
    const item = await DeliveryItem.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ error: "Delivery item not found" });
    }

    const delivery = await Delivery.findById(item.delivery_id);
    if (delivery.status === "Done") {
      return res.status(400).json({ error: "Cannot delete items from a completed delivery" });
    }

    await item.deleteOne();
    res.json({ message: "Delivery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
