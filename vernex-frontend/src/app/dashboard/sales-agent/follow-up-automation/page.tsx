import { PageHeader } from "@/components/layout/PageHeader";
import { FollowUpRuleScreen } from "@/modules/shared-core/ManagementScreens";

export default function FollowUpAutomationPage() {
  return (
    <>
      <PageHeader title="Follow-Up Automation" description="Working rule builder with delays, templates, status triggers, bulk actions, and persistence." breadcrumbs={["Sales Agent", "Follow-Up Automation"]} />
      <FollowUpRuleScreen />
    </>
  );
}
