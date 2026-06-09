import { BadgeIndianRupee, Receipt, Upload } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { UploadHistory } from "@/components/modules/shared-core/CommonSections";
import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { salesRecords, salesTrend } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { SalesRecord } from "@/types";

export default function ProfitSalesAnalyticsPage() {
  const total = salesRecords.reduce((sum, row) => sum + row.totalAmount, 0);
  return (
    <>
      <PageHeader title="Sales Analytics" description="Upload CSV files, validate sales rows, and review revenue summaries." breadcrumbs={["Profit Analysis", "Sales Analytics"]} />
      <UploadHistory />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Validated Rows" value="100" icon={Upload} helper="Demo CSV" />
        <StatCard label="Total Revenue" value={formatCurrency(total)} icon={BadgeIndianRupee} helper="Imported rows" />
        <StatCard label="Average Bill" value={formatCurrency(total / salesRecords.length)} icon={Receipt} helper="Simple owner metric" />
      </div>
      <div className="mt-6"><ChartCard title="Sales chart" data={salesTrend} /></div>
      <div className="mt-6">
        <DataTable<SalesRecord>
          data={salesRecords.slice(0, 20)}
          columns={[
            { key: "date", header: "Date" },
            { key: "billNumber", header: "Bill" },
            { key: "itemName", header: "Item" },
            { key: "quantity", header: "Qty" },
            { key: "totalAmount", header: "Amount", render: (row) => formatCurrency(row.totalAmount) },
            { key: "orderSource", header: "Source", render: (row) => <StatusBadge tone="primary">{row.orderSource}</StatusBadge> },
            { key: "time", header: "Time" }
          ]}
        />
      </div>
    </>
  );
}
