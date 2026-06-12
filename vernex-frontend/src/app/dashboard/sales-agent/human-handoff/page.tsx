import { PageHeader } from "@/components/layout/PageHeader";
import { HandoffManagementScreen } from "@/modules/shared-core/ManagementScreens";

export default function HumanHandoffPage() {
  return (
    <>
      <PageHeader title="Human Handoff" description="Working handoff queue with assignment, status changes, search, filtering, export, and local persistence." breadcrumbs={["Sales Agent", "Human Handoff"]} />
      <HandoffManagementScreen />
    </>
  );
}
