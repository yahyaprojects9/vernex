import type { Metadata } from "next";
import { ThemeInitializer } from "@/components/layout/ThemeInitializer";
import "./globals.css";

const themeBootstrapScript = `
(() => {
  const defaultColor = "#0f766e";
  const storageKey = "vernex-platform-v4-empty";
  const normalizeHex = (hex) => /^#[0-9a-f]{6}$/i.test(hex || "") ? hex : defaultColor;
  const hexToHsl = (hex) => {
    const value = hex.slice(1);
    const r = parseInt(value.slice(0, 2), 16) / 255;
    const g = parseInt(value.slice(2, 4), 16) / 255;
    const b = parseInt(value.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lightness = (max + min) / 2;
    const delta = max - min;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
    let hue = 0;
    if (delta) {
      if (max === r) hue = 60 * (((g - b) / delta) % 6);
      else if (max === g) hue = 60 * ((b - r) / delta + 2);
      else hue = 60 * ((r - g) / delta + 4);
    }
    return \`\${Math.round(hue < 0 ? hue + 360 : hue)} \${Math.round(saturation * 100)}% \${Math.round(lightness * 100)}%\`;
  };
  const contrastForeground = (hex) => {
    const value = hex.slice(1);
    const channels = [0, 2, 4].map((start) => parseInt(value.slice(start, start + 2), 16) / 255);
    const [r, g, b] = channels.map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? "222 47% 11%" : "0 0% 100%";
  };

  try {
    const stored = window.localStorage.getItem(storageKey);
    const color = normalizeHex(stored ? JSON.parse(stored)?.settings?.primaryColor : defaultColor);
    const root = document.documentElement;
    const hsl = hexToHsl(color);
    root.style.setProperty("--primary", hsl);
    root.style.setProperty("--ring", hsl);
    root.style.setProperty("--primary-foreground", contrastForeground(color));
  } catch {
    const root = document.documentElement;
    root.style.setProperty("--primary", "174 77% 26%");
    root.style.setProperty("--ring", "174 77% 26%");
    root.style.setProperty("--primary-foreground", "0 0% 100%");
  }
})();
`;

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body><ThemeInitializer />{children}</body>
    </html>
  );
}
