import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardGuard } from "@/components/layout/DashboardGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardGuard>
      <AppLayout>{children}</AppLayout>
    </DashboardGuard>
  );
}
