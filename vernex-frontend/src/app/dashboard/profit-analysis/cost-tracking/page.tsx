import { PageHeader } from "@/components/layout/PageHeader";
import { CostTrackingScreen } from "@/modules/shared-core/ManagementScreens";

export default function CostTrackingPage() {
  return (
    <>
      <PageHeader title="Cost Tracking" description="Working cost CRUD with search, filters, status changes, exports, and margin records." breadcrumbs={["Profit Analysis", "Cost Tracking"]} />
      <CostTrackingScreen />
    </>
  );
}
