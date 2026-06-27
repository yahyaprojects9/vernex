import { PageHeader } from "@/components/layout/PageHeader";
import { LeadManagementScreen } from "@/modules/shared-core/ManagementScreens";

export default function LeadsPage() {
  return (
    <>
      <PageHeader title="Lead Management" breadcrumbs={["Sales Agent", "Leads"]} />
      <LeadManagementScreen />
    </>
  );
}
