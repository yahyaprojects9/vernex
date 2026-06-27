import { PageHeader } from "@/components/layout/PageHeader";
import { WastageTrackingScreen } from "@/modules/shared-core/ManagementScreens";

export default function WastageTrackingPage() {
  return (
    <>
      <PageHeader title="Wastage Tracking" breadcrumbs={["Profit Analysis", "Wastage Tracking"]} />
      <WastageTrackingScreen />
    </>
  );
}
