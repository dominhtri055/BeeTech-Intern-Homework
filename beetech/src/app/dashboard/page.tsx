async function getConversations() {
  const res = await fetch("http://localhost:3000/api/conversations", {
    cache: "no-store",
  });
  return res.json();
}

export default async function DashboardPage() {
  const conversations = await getConversations();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="space-y-6">
        {conversations.map((conv: any) => (
          <div key={conv.whatsappId} className="border rounded-xl p-4 shadow">
            <h2 className="font-semibold text-lg">{conv.whatsappId}</h2>
            <p className="text-sm text-gray-500">Tone: {conv.tone}</p>

            <div className="mt-4 space-y-2">
              {conv.messages.map((msg: any) => (
                <div
                  key={msg._id}
                  className={`p-3 rounded ${
                    msg.role === "user" ? "bg-gray-100" : "bg-green-100"
                  }`}
                >
                  <strong>{msg.role}:</strong> {msg.content}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}