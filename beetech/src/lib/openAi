import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY in .env.local");
}

const client = new OpenAI({
  apiKey,
});

export async function generateReply(
  tone: string,
  history: { role: "user" | "assistant"; content: string }[],
  userMessage: string
) {
  const systemPrompt = `You are a WhatsApp business assistant.
Reply in a ${tone} tone.
Keep answers concise, helpful, and natural.`;

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...history,
    { role: "user" as const, content: userMessage },
  ];

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  return response.choices[0]?.message?.content ?? "Sorry, I could not respond.";
}