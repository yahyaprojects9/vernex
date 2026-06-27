import { PageHeader } from "@/components/layout/PageHeader";
import { SalesAnalyticsIngestion } from "@/modules/profit-analysis/SalesAnalyticsIngestion";

export default function ProfitSalesAnalyticsPage() {
  return (
    <>
      <PageHeader title="Sales Analytics" breadcrumbs={["Profit Analysis", "Sales Analytics"]} />
      <SalesAnalyticsIngestion />
    </>
  );
}
