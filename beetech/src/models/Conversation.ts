import mongoose, { Schema, model, models } from "mongoose";

const ConversationSchema = new Schema(
  {
    whatsappId: { type: String, required: true, index: true },
    tone: { type: String, default: "friendly" },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.Conversation || model("Conversation", ConversationSchema);