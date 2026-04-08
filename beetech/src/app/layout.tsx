import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BeeTech WhatsApp Bot",
  description: "Admin dashboard and WhatsApp AI chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#A78D78",
          color: "#111",
        }}
      >
        {children}
      </body>
    </html>
  );
}