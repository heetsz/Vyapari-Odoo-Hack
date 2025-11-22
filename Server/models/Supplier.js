import { Schema, model } from "mongoose";

const SupplierSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export default model("Supplier", SupplierSchema);
