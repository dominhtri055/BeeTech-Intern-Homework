import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

async function getConversations() {
  await connectDB();

  const conversations = await Conversation.find()
    .sort({ lastMessageAt: -1 })
    .lean();

  const result = await Promise.all(
    conversations.map(async (conv: any) => {
      const messages = await Message.find({
        whatsappId: conv.whatsappId,
      })
        .sort({ createdAt: 1 })
        .lean();

      return {
        whatsappId: conv.whatsappId,
        tone: conv.tone,
        lastMessageAt: conv.lastMessageAt,
        messages,
      };
    })
  );

  return result;
}

export default async function DashboardPage() {
  const conversations = await getConversations();

  return (
    <main style={{ padding: "24px" }}>
      <h1>Admin Dashboard</h1>

      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {conversations.map((conv: any) => (
            <div
              key={conv.whatsappId}
              style={{
                background: "#E1D4C2",
                padding: "16px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <h2>{conv.whatsappId}</h2>
              <p>Tone: {conv.tone}</p>

              <div style={{ marginTop: "12px" }}>
                {conv.messages.map((msg: any) => (
                  <div
                    key={String(msg._id)}
                    style={{
                      marginBottom: "8px",
                      padding: "10px",
                      borderRadius: "8px",
                      background:
                        msg.role === "user" ? "#ffffff" : "#dcfce7",
                    }}
                  >
                    <strong>{msg.role}:</strong> {msg.content}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}