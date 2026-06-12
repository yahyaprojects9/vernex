import { PageHeader } from "@/components/layout/PageHeader";
import { QuotationManagementScreen } from "@/modules/shared-core/ManagementScreens";

export default function QuotationsPage() {
  return (
    <>
      <PageHeader title="Quotation Management" description="Working quotation CRUD with status tracking, export, and backend-ready persistence." breadcrumbs={["Sales Agent", "Quotations"]} />
      <QuotationManagementScreen />
    </>
  );
}
