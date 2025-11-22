import { Schema, model } from "mongoose";

const DeliveryItemSchema = new Schema(
  {
    delivery_id: { type: Schema.Types.ObjectId, ref: "Delivery", required: true },
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity_delivered: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model("DeliveryItem", DeliveryItemSchema);
