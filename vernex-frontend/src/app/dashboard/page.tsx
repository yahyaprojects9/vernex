import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardOverview } from "@/modules/shared-core/DynamicOverviews";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Vernex Platform"
        breadcrumbs={["Organization", "Dashboard"]}
      />
      <DashboardOverview />
    </>
  );
}
