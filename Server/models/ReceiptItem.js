import { Schema, model } from "mongoose";

const ReceiptItemSchema = new Schema(
  {
    receipt_id: { type: Schema.Types.ObjectId, ref: "Receipt", required: true },
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity_received: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model("ReceiptItem", ReceiptItemSchema);
