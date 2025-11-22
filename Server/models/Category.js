import { Schema, model } from "mongoose";

const ProductCategorySchema = new Schema(
  {
    category_name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default model("ProductCategory", ProductCategorySchema);
