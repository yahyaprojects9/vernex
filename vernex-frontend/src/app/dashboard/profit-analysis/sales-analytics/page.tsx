import { PageHeader } from "@/components/layout/PageHeader";
import { SalesAnalyticsIngestion } from "@/modules/profit-analysis/SalesAnalyticsIngestion";

export default function ProfitSalesAnalyticsPage() {
  return (
    <>
      <PageHeader title="Sales Analytics" description="Central data ingestion layer: sources, imports, preview, mapping, validation, history, and generated analytics." breadcrumbs={["Profit Analysis", "Sales Analytics"]} />
      <SalesAnalyticsIngestion />
    </>
  );
}
