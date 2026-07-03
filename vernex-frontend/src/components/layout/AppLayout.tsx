"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import { useUiStore } from "@/stores/uiStore";
import { applyPrimaryColor } from "@/lib/theme";
import { Button } from "@/components/ui/Button";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const store = useLocalStore();
  const mainRef = useRef<HTMLElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    applyPrimaryColor(store.settings.primaryColor);
  }, [store.settings.primaryColor]);

  return (
    <div className="h-dvh w-full max-w-full overflow-hidden lg:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main ref={mainRef} onScroll={(event) => setShowScrollTop(event.currentTarget.scrollTop > 300)} className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-[1500px] min-w-0 px-3 py-5 sm:px-4 md:px-6 lg:px-8">{children}</div>
        </main>
        {showScrollTop ? <Button
          type="button"
          className="fixed bottom-5 right-5 z-40 h-10 w-10 rounded-full px-0 shadow-lg"
          aria-label="Go to top"
          title="Go to top"
          onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
        ><ArrowUp className="h-4 w-4" /></Button> : null}
      </div>
    </div>
  );
}
