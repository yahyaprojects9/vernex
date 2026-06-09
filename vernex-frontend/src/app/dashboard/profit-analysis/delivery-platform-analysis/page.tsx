import { Bike, Store, Utensils } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { salesRecords } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const platformRows = ["Dine-in", "Swiggy", "Zomato", "Takeaway"].map((source) => ({
  source,
  orders: salesRecords.filter((row) => row.orderSource === source).length,
  revenue: salesRecords.filter((row) => row.orderSource === source).reduce((sum, row) => sum + row.totalAmount, 0),
  status: source === "Dine-in" ? "Strong" : "Review commission"
}));

export default function DeliveryPlatformAnalysisPage() {
  return (
    <>
      <PageHeader title="Delivery Platform Analysis" description="Compare dine-in, takeaway, and delivery platform revenue." breadcrumbs={["Profit Analysis", "Delivery Platforms"]} />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Dine-in Revenue" value={formatCurrency(platformRows[0].revenue)} icon={Store} helper="Direct margin" />
        <StatCard label="Swiggy Revenue" value={formatCurrency(platformRows[1].revenue)} icon={Bike} helper="Delivery channel" />
        <StatCard label="Zomato Revenue" value={formatCurrency(platformRows[2].revenue)} icon={Utensils} helper="Delivery channel" />
      </div>
      <div className="mt-6"><ChartCard title="Platform comparison" data={platformRows.map((row) => ({ name: row.source, value: row.revenue }))} type="bar" /></div>
      <div className="mt-6">
        <DataTable<(typeof platformRows)[number]>
          data={platformRows}
          columns={[
            { key: "source", header: "Channel" },
            { key: "orders", header: "Orders" },
            { key: "revenue", header: "Revenue", render: (row) => formatCurrency(row.revenue) },
            { key: "status", header: "Status", render: (row) => <StatusBadge tone={row.status === "Strong" ? "success" : "warning"}>{row.status}</StatusBadge> }
          ]}
        />
      </div>
    </>
  );
}
