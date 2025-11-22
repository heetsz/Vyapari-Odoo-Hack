import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    uom: { type: String, required: true },
    cpu: {type:Number, required:true}
    reorderLevel: { type: Number, default: 0 },
    initialStock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model("Product", ProductSchema);
