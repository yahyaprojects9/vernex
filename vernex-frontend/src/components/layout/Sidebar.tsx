"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { navigationGroups } from "@/lib/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { AuthService } from "@/lib/services";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";

export function Sidebar({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const store = useLocalStore();
  const companyName = store.settings.companyName || store.settings.brandName;
  const [width, setWidth] = useState(288);
  const [collapsed, setCollapsed] = useState(false);
  const dragging = useRef(false);

  useEffect(() => {
    const savedWidth = Number(window.localStorage.getItem("vernex-sidebar-width"));
    const savedCollapsed = window.localStorage.getItem("vernex-sidebar-collapsed") === "true";
    if (savedWidth >= 240 && savedWidth <= 380) setWidth(savedWidth);
    setCollapsed(savedCollapsed);
  }, []);

  useEffect(() => {
    function onMove(event: MouseEvent) {
      if (!dragging.current) return;
      const nextWidth = Math.min(380, Math.max(240, event.clientX));
      setCollapsed(false);
      setWidth(nextWidth);
    }
    function onUp() {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("vernex-sidebar-width", String(width));
    window.localStorage.setItem("vernex-sidebar-collapsed", String(collapsed));
  }, [collapsed, width]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      navigationGroups.flatMap((group) => group.items).filter(canAccessItem).forEach((item) => router.prefetch(item.href));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [router]);

  function canAccessItem(item: (typeof navigationGroups)[number]["items"][number]) {
    if (item.href === "/dashboard") return true;
    if (item.href === "/dashboard/users") return AuthService.can("read", "User");
    if (item.href === "/dashboard/roles") return AuthService.can("read", "Role");
    if (item.href === "/dashboard/branches") return AuthService.can("read", "Branch");
    if (item.href === "/dashboard/departments") return AuthService.can("read", "Department");
    if (item.href === "/dashboard/settings") return AuthService.can("read", "Settings") || AuthService.currentRole()?.id === "owner";
    if (item.href === "/dashboard/reports") return AuthService.hasPermission("Profit Analysis", "View Analytics") || AuthService.hasPermission("Profit Analysis", "Export Reports");
    if (item.href.includes("/dashboard/sales-agent")) return AuthService.canViewModule("Sales Agent");
    if (item.href.includes("/dashboard/profit-analysis")) return AuthService.canViewModule("Profit Analysis");
    return true;
  }

  return (
    <>
      <div
        className={cn("fixed inset-0 z-30 bg-slate-950/40 lg:hidden", open ? "block" : "hidden")}
        onClick={onClose}
      />
      <aside
        style={{ "--sidebar-width": `${collapsed ? 80 : width}px` } as React.CSSProperties}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen w-72 shrink-0 flex-col border-r border-border bg-white transition-[transform,width] duration-200 lg:static lg:w-[var(--sidebar-width)] lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className={cn("flex h-16 shrink-0 items-center justify-between border-b border-border px-5", collapsed && "lg:justify-center lg:px-2")}>
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
            {store.settings.companyLogo ? <Image src={store.settings.companyLogo} alt="" width={36} height={36} unoptimized className="h-9 w-9 rounded-md object-cover" /> : <span aria-label="No company logo" className="h-9 w-9 rounded-md border border-dashed border-border bg-muted" />}
            <span className={cn(collapsed && "lg:hidden")}>
              <span className="block max-w-40 truncate text-sm font-bold">{companyName}</span>
              <span className="block text-xs text-muted-foreground">Organization</span>
            </span>
          </Link>
          <Button variant="ghost" className="h-9 w-9 px-0 lg:hidden" onClick={onClose} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className={cn("flex-1 space-y-4 overflow-y-auto px-3 py-5", collapsed && "lg:px-2")}>
          {navigationGroups.map((group) => {
            const isProductGroup = group.label !== "Organization";
            const items = group.items.filter(canAccessItem);
            if (!items.length) return null;

            return (
              <details key={group.label} open className="group">
                <summary
                  className={cn(
                    "flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 text-sm font-bold transition [&::-webkit-details-marker]:hidden",
                    collapsed && "lg:hidden",
                    isProductGroup
                      ? "text-slate-800 hover:bg-muted"
                      : "pointer-events-none px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground"
                  )}
                >
                  <span>{group.label}</span>
                  {isProductGroup ? (
                    <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                  ) : null}
                </summary>
                <div className={cn("mt-2 space-y-1", isProductGroup && !collapsed ? "pl-2" : "")}>
                {items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      prefetch
                      onClick={() => {
                        if (open) onClose();
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                        collapsed && "lg:justify-center lg:px-2",
                        active ? "bg-primary text-primary-foreground" : "text-slate-700 hover:bg-muted",
                        isProductGroup ? "text-[13px]" : ""
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className={cn(collapsed && "lg:hidden")}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              </details>
            );
          })}
        </nav>
        <div className="hidden shrink-0 border-t border-border p-2 lg:block">
          <Button
            variant="ghost"
            className={cn("w-full", collapsed ? "justify-center px-0" : "justify-start")}
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            {!collapsed ? <span>Collapse menu</span> : null}
          </Button>
        </div>
        {!collapsed ? <button
          type="button"
          aria-label="Resize sidebar"
          title="Drag to resize sidebar"
          className="absolute inset-y-0 right-0 hidden w-1 translate-x-1/2 cursor-col-resize bg-transparent transition hover:bg-primary/40 lg:block"
          onMouseDown={(event) => {
            event.preventDefault();
            dragging.current = true;
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
          }}
        /> : null}
      </aside>
    </>
  );
}
