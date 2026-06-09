import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vernex Platform",
  description: "Unified SaaS dashboard for sales automation and profit analysis"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
