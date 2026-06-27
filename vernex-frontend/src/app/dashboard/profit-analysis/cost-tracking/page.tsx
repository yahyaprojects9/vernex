import { PageHeader } from "@/components/layout/PageHeader";
import { CostTrackingScreen } from "@/modules/shared-core/ManagementScreens";

export default function CostTrackingPage() {
  return (
    <>
      <PageHeader title="Cost Tracking" breadcrumbs={["Profit Analysis", "Cost Tracking"]} />
      <CostTrackingScreen />
    </>
  );
}
