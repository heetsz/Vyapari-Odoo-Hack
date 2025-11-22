import { Schema, model } from "mongoose";

const StockSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
    quantity: { type: Number, default: 0, required: true },
    freeToUse: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model("Stock", StockSchema);
