import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { generateReply } from "@/lib/openai";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();

    const message =
      body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return NextResponse.json({ received: true });
    }

    const whatsappId = message.from;
    const userText = message.text?.body;

    if (!userText) {
      return NextResponse.json({ received: true });
    }

    await User.updateOne(
      { whatsappId },
      { $setOnInsert: { whatsappId } },
      { upsert: true }
    );

    let conversation = await Conversation.findOne({ whatsappId });

    if (!conversation) {
      conversation = await Conversation.create({
        whatsappId,
        tone: process.env.DEFAULT_BOT_TONE || "friendly",
      });
    }

    await Message.create({
      whatsappId,
      role: "user",
      content: userText,
    });

    const recentMessages = await Message.find({ whatsappId })
      .sort({ createdAt: -1 })
      .limit(10);

    const history = recentMessages
      .reverse()
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    const reply = await generateReply(conversation.tone, history, userText);

    await Message.create({
      whatsappId,
      role: "assistant",
      content: reply,
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    await sendWhatsAppMessage(whatsappId, reply);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}