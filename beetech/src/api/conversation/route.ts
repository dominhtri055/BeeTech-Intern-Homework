import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

export async function GET() {
  await connectDB();

  const conversations = await Conversation.find().sort({ lastMessageAt: -1 });

  const result = await Promise.all(
    conversations.map(async (conv) => {
      const messages = await Message.find({ whatsappId: conv.whatsappId })
        .sort({ createdAt: 1 });

      return {
        whatsappId: conv.whatsappId,
        tone: conv.tone,
        lastMessageAt: conv.lastMessageAt,
        messages,
      };
    })
  );

  return NextResponse.json(result);
}