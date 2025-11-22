import { Schema, model } from "mongoose";

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export default model("Customer", CustomerSchema);
