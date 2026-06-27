import { PageHeader } from "@/components/layout/PageHeader";
import { QuotationManagementScreen } from "@/modules/shared-core/ManagementScreens";

export default function QuotationsPage() {
  return (
    <>
      <PageHeader title="Quotation Management" breadcrumbs={["Sales Agent", "Quotations"]} />
      <QuotationManagementScreen />
    </>
  );
}
