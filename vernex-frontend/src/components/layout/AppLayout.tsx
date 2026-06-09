"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
