import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import productsRouter from "./products.js";

// Supplier controller
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../controllers/supplierController.js";

// Customer controller
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from "../controllers/customerController.js";

// Unit of Measure controller
import {
  getUnitsOfMeasure,
  getUnitOfMeasureById,
  createUnitOfMeasure,
  updateUnitOfMeasure,
  deleteUnitOfMeasure
} from "../controllers/unitOfMeasureController.js";

// Receipt controller
import {
  getReceipts,
  getReceiptById,
  createReceipt,
  updateReceipt,
  validateReceipt,
  deleteReceipt,
  addReceiptItem,
  updateReceiptItem,
  deleteReceiptItem
} from "../controllers/receiptController.js";

// Delivery controller
import {
  getDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  validateDelivery,
  deleteDelivery,
  addDeliveryItem,
  updateDeliveryItem,
  deleteDeliveryItem
} from "../controllers/deliveryController.js";

// Adjustment controller
import {
  getAdjustments,
  getAdjustmentById,
  createAdjustment,
  updateAdjustment,
  validateAdjustment,
  deleteAdjustment
} from "../controllers/adjustmentController.js";

// Stock controller
import {
  getStockByProduct,
  getAllStock,
  updateStock
} from "../controllers/stockController.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// ===== SUPPLIER ROUTES ===
router.get("/suppliers", getSuppliers);
router.get("/suppliers/:id", getSupplierById);
router.post("/suppliers", createSupplier);
router.put("/suppliers/:id", updateSupplier);
router.delete("/suppliers/:id", deleteSupplier);

// ===== CUSTOMER ROUTES =====
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.post("/customers", createCustomer);
router.put("/customers/:id", updateCustomer);
router.delete("/customers/:id", deleteCustomer);

// ===== UNIT OF MEASURE ROUTES =====
router.get("/units-of-measure", getUnitsOfMeasure);
router.get("/units-of-measure/:id", getUnitOfMeasureById);
router.post("/units-of-measure", createUnitOfMeasure);
router.put("/units-of-measure/:id", updateUnitOfMeasure);
router.delete("/units-of-measure/:id", deleteUnitOfMeasure);

// ===== RECEIPT ROUTES =====
router.get("/receipts", getReceipts);
router.get("/receipts/:id", getReceiptById);
router.post("/receipts", createReceipt);
router.put("/receipts/:id", updateReceipt);
router.put("/receipts/:id/validate", validateReceipt);
router.delete("/receipts/:id", deleteReceipt);

// Receipt items
router.post("/receipts/:id/items", addReceiptItem);
router.put("/receipts/:id/items/:itemId", updateReceiptItem);
router.delete("/receipts/:id/items/:itemId", deleteReceiptItem);

// ===== DELIVERY ROUTES =====
router.get("/deliveries", getDeliveries);
router.get("/deliveries/:id", getDeliveryById);
router.post("/deliveries", createDelivery);
router.put("/deliveries/:id", updateDelivery);
router.put("/deliveries/:id/validate", validateDelivery);
router.delete("/deliveries/:id", deleteDelivery);

// Delivery items
router.post("/deliveries/:id/items", addDeliveryItem);
router.put("/deliveries/:id/items/:itemId", updateDeliveryItem);
router.delete("/deliveries/:id/items/:itemId", deleteDeliveryItem);

// ===== ADJUSTMENT ROUTES =====
router.get("/adjustments", getAdjustments);
router.get("/adjustments/:id", getAdjustmentById);
router.post("/adjustments", createAdjustment);
router.put("/adjustments/:id", updateAdjustment);
router.put("/adjustments/:id/validate", validateAdjustment);
router.delete("/adjustments/:id", deleteAdjustment);

// ===== STOCK ROUTES =====
router.get("/stock", getStockByProduct);
router.get("/stock/all", getAllStock);
router.put("/stock", updateStock);

// ===== PRODUCT ROUTES =====
router.use("/products", productsRouter);

export default router;
