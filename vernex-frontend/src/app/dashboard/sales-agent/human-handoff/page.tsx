import { PageHeader } from "@/components/layout/PageHeader";
import { HandoffManagementScreen } from "@/modules/shared-core/ManagementScreens";

export default function HumanHandoffPage() {
  return (
    <>
      <PageHeader title="Human Handoff" breadcrumbs={["Sales Agent", "Human Handoff"]} />
      <HandoffManagementScreen />
    </>
  );
}
