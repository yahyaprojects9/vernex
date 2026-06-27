import { PageHeader } from "@/components/layout/PageHeader";
import { ProfitOverview } from "@/modules/shared-core/DynamicOverviews";

export default function ProfitOverviewPage() {
  return (
    <>
      <PageHeader title="Profit Analysis Overview" breadcrumbs={["Profit Analysis", "Overview"]} />
      <ProfitOverview />
    </>
  );
}
