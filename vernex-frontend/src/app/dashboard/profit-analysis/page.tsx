import { PageHeader } from "@/components/layout/PageHeader";
import { ProfitOverview } from "@/modules/shared-core/DynamicOverviews";

export default function ProfitOverviewPage() {
  return (
    <>
      <PageHeader title="Profit Analysis Overview" description="Restaurant owner dashboard generated from imported and user-created business records." breadcrumbs={["Profit Analysis", "Overview"]} />
      <ProfitOverview />
    </>
  );
}
