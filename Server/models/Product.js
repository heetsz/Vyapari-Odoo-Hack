import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category_id: { type: Schema.Types.ObjectId, ref: "ProductCategory", required: true },
    unit_of_measure: { type: Schema.Types.ObjectId, ref: "UnitOfMeasure", required: true },
    description: { type: String },
    image_url: { type: String },
    reorder_level: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export default model("Product", ProductSchema);
