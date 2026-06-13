"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
