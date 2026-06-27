import { PageHeader } from "@/components/layout/PageHeader";
import { SalesAgentOverview } from "@/modules/shared-core/DynamicOverviews";

export default function SalesAgentOverviewPage() {
  return (
    <>
      <PageHeader title="Sales Agent Overview" breadcrumbs={["Sales Agent", "Overview"]} />
      <SalesAgentOverview />
    </>
  );
}
