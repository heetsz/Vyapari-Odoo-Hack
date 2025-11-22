import { Schema, model } from 'mongoose'

const OtpSchema = new Schema(
  {
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['verify', 'forgot'], required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default model('Otp', OtpSchema)
