import { Schema, model } from "mongoose";

const ReceiptSchema = new Schema(
  {
    receipt_number: { type: String, required: true, unique: true },
    supplier_id: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    status: { 
      type: String, 
      enum: ["Draft", "Waiting", "Ready", "Done", "Cancelled"], 
      default: "Draft",
      required: true 
    },
    validated_at: { type: Date },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    validated_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default model("Receipt", ReceiptSchema);
