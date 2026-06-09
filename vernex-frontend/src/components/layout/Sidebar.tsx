"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { navigationGroups } from "@/lib/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Sidebar({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn("fixed inset-0 z-30 bg-slate-950/40 lg:hidden", open ? "block" : "hidden")}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-white transition-transform lg:static lg:translate-x-0",
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
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">{group.label}</p>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                        active ? "bg-primary text-primary-foreground" : "text-slate-700 hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
