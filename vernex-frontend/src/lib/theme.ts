export function applyPrimaryColor(hex?: string) {
  if (typeof document === "undefined") return;
  const color = normalizeHex(hex);
  const hsl = hexToHsl(color);
  const foreground = contrastForeground(color);
  document.documentElement.style.setProperty("--primary", hsl);
  document.documentElement.style.setProperty("--ring", hsl);
  document.documentElement.style.setProperty("--primary-foreground", foreground);
}

function normalizeHex(hex?: string) {
  return /^#[0-9a-f]{6}$/i.test(hex ?? "") ? String(hex) : "#0f766e";
}

function hexToHsl(hex: string) {
  const value = hex.slice(1);
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const delta = max - min;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  if (delta) {
    if (max === r) h = 60 * (((g - b) / delta) % 6);
    else if (max === g) h = 60 * ((b - r) / delta + 2);
    else h = 60 * ((r - g) / delta + 4);
  }
  return `${Math.round(h < 0 ? h + 360 : h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function contrastForeground(hex: string) {
  const value = hex.slice(1);
  const channels = [0, 2, 4].map((start) => parseInt(value.slice(start, start + 2), 16) / 255);
  const [r, g, b] = channels.map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? "222 47% 11%" : "0 0% 100%";
}
