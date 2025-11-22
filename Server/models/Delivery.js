import { Schema, model } from "mongoose";

const DeliverySchema = new Schema(
  {
    delivery_number: { type: String, required: true, unique: true },
    customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
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

export default model("Delivery", DeliverySchema);
