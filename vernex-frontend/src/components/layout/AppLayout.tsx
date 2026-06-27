"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import { useUiStore } from "@/stores/uiStore";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const store = useLocalStore();

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", hexToHsl(store.settings.primaryColor));
  }, [store.settings.primaryColor]);

  return (
    <div className="min-h-dvh w-full max-w-full overflow-x-hidden lg:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-[1500px] min-w-0 px-3 py-5 sm:px-4 md:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

function hexToHsl(hex?: string) {
  if (!hex) return "187 75% 32%";
  const value = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) return "187 75% 32%";
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
