import { AlertTriangle, CalendarDays } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { wastageRecords } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { WastageEntry } from "@/types";

export default function WastageTrackingPage() {
  const total = wastageRecords.reduce((sum, row) => sum + row.estimatedCostLoss, 0);
  return (
    <>
      <PageHeader title="Wastage Tracking" description="Log wasted items, reasons, estimated cost loss, and trend alerts." breadcrumbs={["Profit Analysis", "Wastage Tracking"]} />
      <section className="dashboard-surface grid gap-3 p-5 md:grid-cols-5">
        <Input placeholder="Item name" />
        <Input placeholder="Quantity wasted" />
        <Select><option>Spoilage</option><option>Overproduction</option><option>Kitchen Error</option><option>Expired</option></Select>
        <Input placeholder="Estimated loss" />
        <Button>Log wastage</Button>
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <StatCard label="Monthly Wastage" value={formatCurrency(total)} icon={AlertTriangle} helper="Cost loss" />
        <StatCard label="Daily Average" value={formatCurrency(total / 30)} icon={CalendarDays} helper="Demo month" />
      </div>
      <div className="mt-6"><ChartCard title="Wastage trend" data={wastageRecords.slice(0, 10).map((row) => ({ name: row.date.slice(-2), value: row.estimatedCostLoss }))} type="bar" /></div>
      <div className="mt-6">
        <DataTable<WastageEntry>
          data={wastageRecords}
          columns={[
            { key: "date", header: "Date" },
            { key: "itemName", header: "Item" },
            { key: "quantityWasted", header: "Qty Wasted" },
            { key: "reason", header: "Reason", render: (row) => <StatusBadge tone="warning">{row.reason}</StatusBadge> },
            { key: "estimatedCostLoss", header: "Cost Loss", render: (row) => formatCurrency(row.estimatedCostLoss) },
            { key: "staffNote", header: "Staff Note" }
          ]}
        />
      </div>
    </>
  );
}
