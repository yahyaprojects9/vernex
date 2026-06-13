"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthService } from "@/lib/services";
import { LoadingState } from "@/components/ui/StateViews";

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

  return <>{children}</>;
}

function canAccessPath(pathname: string) {
  if (pathname === "/dashboard") return true;
  if (pathname.startsWith("/dashboard/users")) return AuthService.hasPermission("Shared Core", "View Users");
  if (pathname.startsWith("/dashboard/roles")) return AuthService.hasPermission("Shared Core", "View Roles");
  if (pathname.startsWith("/dashboard/branches")) return AuthService.hasPermission("Shared Core", "View Branches");
  if (pathname.startsWith("/dashboard/departments")) return AuthService.hasPermission("Shared Core", "View Departments");
  if (pathname.startsWith("/dashboard/settings")) return AuthService.currentRole()?.id === "owner";
  if (pathname.startsWith("/dashboard/reports")) return AuthService.hasPermission("Profit Analysis", "View Analytics") || AuthService.hasPermission("Profit Analysis", "Export Reports");
  if (pathname.startsWith("/dashboard/sales-agent")) return AuthService.canViewModule("Sales Agent");
  if (pathname.startsWith("/dashboard/profit-analysis")) return AuthService.canViewModule("Profit Analysis");
  return true;
}
