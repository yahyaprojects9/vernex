import { PageHeader } from "@/components/layout/PageHeader";
import { FollowUpRuleScreen } from "@/modules/shared-core/ManagementScreens";

export default function FollowUpAutomationPage() {
  return (
    <>
      <PageHeader title="Follow-Up Automation" breadcrumbs={["Sales Agent", "Follow-Up Automation"]} />
      <FollowUpRuleScreen />
    </>
  );
}
