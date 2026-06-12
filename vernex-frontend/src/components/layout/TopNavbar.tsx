"use client";

import { Bell, Menu, Search, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthService, StorageService } from "@/lib/services";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";

export function TopNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const store = useLocalStore();
  const currentUser = AuthService.currentUser();
  const currentRole = store.roles.find((role) => role.id === currentUser.roleId);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
      <Button variant="ghost" className="h-10 w-10 px-0 lg:hidden" onClick={onMenuClick} aria-label="Open sidebar">
        <Menu className="h-5 w-5" />
      </Button>
      <label className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="bg-white pl-9" placeholder="Search leads, reports, settings" />
      </label>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" className="h-10 w-10 px-0" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2">
          <UserCircle className="h-5 w-5 text-primary" />
          <span className="hidden text-sm font-semibold sm:inline">
            {currentUser.name}
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {currentRole?.name ?? currentUser.roleId}
            </span>
          </span>
        </div>
        <Button variant="secondary" onClick={() => StorageService.reset()} className="hidden md:inline-flex">
          Reset seed
        </Button>
      </div>
    </header>
  );
}
