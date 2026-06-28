import type { Metadata } from "next";
import { ThemeInitializer } from "@/components/layout/ThemeInitializer";
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
      <body><ThemeInitializer />{children}</body>
    </html>
  );
}
