import { PageHeader } from "@/components/layout/PageHeader";
import { LeadManagementScreen } from "@/modules/shared-core/ManagementScreens";

export default function LeadsPage() {
  return (
    <>
      <PageHeader title="Lead Management" description="Working lead CRUD with search, filters, bulk actions, export, and local persistence." breadcrumbs={["Sales Agent", "Leads"]} />
      <LeadManagementScreen />
    </>
  );
}
