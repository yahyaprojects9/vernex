import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardOverview } from "@/modules/shared-core/DynamicOverviews";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Vernex Platform"
        description="Unified dashboard with role-based visibility, branch filtering, local persistence, and dynamic analytics."
        breadcrumbs={["Shared Core", "Dashboard"]}
      />
      <DashboardOverview />
    </>
  );
}
