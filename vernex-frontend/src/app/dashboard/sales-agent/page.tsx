import { PageHeader } from "@/components/layout/PageHeader";
import { SalesAgentOverview } from "@/modules/shared-core/DynamicOverviews";

export default function SalesAgentOverviewPage() {
  return (
    <>
      <PageHeader title="Sales Agent Overview" description="AI sales inbox and CRM snapshot for enquiries, follow-ups, and conversion." breadcrumbs={["Sales Agent", "Overview"]} />
      <SalesAgentOverview />
    </>
  );
}
