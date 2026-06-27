"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthService } from "@/lib/services";
import { LoadingState } from "@/components/ui/StateViews";
import { AbilityProvider } from "@casl/react";

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(false);
    const user = AuthService.currentUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!canAccessPath(pathname)) {
      router.replace("/dashboard");
      return;
    }
    setAllowed(true);
  }, [pathname, router]);

  if (!allowed) {
    return <main className="p-6"><LoadingState label="Checking access" /></main>;
  }

  return <AbilityProvider value={AuthService.ability()}>{children}</AbilityProvider>;
}

function canAccessPath(pathname: string) {
  if (pathname === "/dashboard") return true;
  if (pathname.startsWith("/dashboard/users")) return AuthService.can("read", "User");
  if (pathname.startsWith("/dashboard/roles")) return AuthService.can("read", "Role");
  if (pathname.startsWith("/dashboard/branches")) return AuthService.can("read", "Branch");
  if (pathname.startsWith("/dashboard/departments")) return AuthService.can("read", "Department");
  if (pathname.startsWith("/dashboard/settings")) return AuthService.can("read", "Settings") || AuthService.currentRole()?.id === "owner";
  if (pathname.startsWith("/dashboard/reports")) return AuthService.can("read", "Report") || AuthService.hasPermission("Profit Analysis", "Export Reports");
  if (pathname.startsWith("/dashboard/sales-agent")) return AuthService.canViewModule("Sales Agent");
  if (pathname.startsWith("/dashboard/profit-analysis")) return AuthService.canViewModule("Profit Analysis");
  return true;
}
