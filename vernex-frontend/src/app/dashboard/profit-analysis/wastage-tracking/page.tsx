import { PageHeader } from "@/components/layout/PageHeader";
import { WastageTrackingScreen } from "@/modules/shared-core/ManagementScreens";

export default function WastageTrackingPage() {
  return (
    <>
      <PageHeader title="Wastage Tracking" description="Working wastage CRUD with reason tracking, status filters, exports, and local persistence." breadcrumbs={["Profit Analysis", "Wastage Tracking"]} />
      <WastageTrackingScreen />
    </>
  );
}
