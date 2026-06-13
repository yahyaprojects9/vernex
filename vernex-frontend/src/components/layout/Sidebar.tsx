"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { navigationGroups } from "@/lib/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { AuthService } from "@/lib/services";

export function Sidebar({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      navigationGroups.flatMap((group) => group.items).filter(canAccessItem).forEach((item) => router.prefetch(item.href));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [router]);

  function canAccessItem(item: (typeof navigationGroups)[number]["items"][number]) {
    if (item.href === "/dashboard") return true;
    if (item.href === "/dashboard/users") return AuthService.hasPermission("Shared Core", "View Users");
    if (item.href === "/dashboard/roles") return AuthService.hasPermission("Shared Core", "View Roles");
    if (item.href === "/dashboard/branches") return AuthService.hasPermission("Shared Core", "View Branches");
    if (item.href === "/dashboard/departments") return AuthService.hasPermission("Shared Core", "View Departments");
    if (item.href === "/dashboard/settings") return AuthService.currentRole()?.id === "owner";
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
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col border-r border-border bg-white transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              V
            </span>
            <span>
              <span className="block text-sm font-bold">Vernex</span>
              <span className="block text-xs text-muted-foreground">Platform</span>
            </span>
          </Link>
          <Button variant="ghost" className="h-9 w-9 px-0 lg:hidden" onClick={onClose} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-5">
          {navigationGroups.map((group) => {
            const isProductGroup = group.label !== "Shared Core";
            const items = group.items.filter(canAccessItem);
            if (!items.length) return null;

            return (
              <details key={group.label} open className="group">
                <summary
                  className={cn(
                    "flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 text-sm font-bold transition [&::-webkit-details-marker]:hidden",
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
                <div className={cn("mt-2 space-y-1", isProductGroup ? "pl-2" : "")}>
                {items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch
                      onClick={() => {
                        if (open) onClose();
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                        active ? "bg-primary text-primary-foreground" : "text-slate-700 hover:bg-muted",
                        isProductGroup ? "text-[13px]" : ""
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              </details>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
