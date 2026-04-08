import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          width: "100%",
          backgroundColor: "#E8D8C4",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "12px", fontSize: "32px" }}>
          Whatapp Customer History app
        </h1>

        <p style={{ marginBottom: "16px", lineHeight: 1.6 }}>
          Project is running.
        </p>

        <p style={{ marginBottom: "24px", lineHeight: 1.6 }}>
          This project uses Next.js, MongoDB, OpenAI, and WhatsApp Cloud API to
          manage AI-powered customer conversations.
        </p>

        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            textDecoration: "none",
            backgroundColor: "#111",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}