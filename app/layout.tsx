import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TestMate - Daily Brain Check",
  description: "Test your cognitive abilities with our daily brain challenges",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
