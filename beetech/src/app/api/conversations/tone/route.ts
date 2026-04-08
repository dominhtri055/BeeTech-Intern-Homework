import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function POST(req: NextRequest) {
  await connectDB();

  const { whatsappId, tone } = await req.json();

  await Conversation.updateOne(
    { whatsappId },
    { $set: { tone } }
  );

  return NextResponse.json({ success: true });
}