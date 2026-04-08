import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    whatsappId: { type: String, required: true, index: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Message || model("Message", MessageSchema);