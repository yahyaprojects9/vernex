import { ChartNoAxesCombined, Percent } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { CostForm } from "@/modules/shared-core/CommonSections";
import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { costRecords } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { CostTracking } from "@/types";

export default function CostTrackingPage() {
  const avgMargin = Math.round(costRecords.reduce((sum, row) => sum + row.marginPercentage, 0) / costRecords.length);
  return (
    <>
      <PageHeader title="Cost Tracking" description="Track selling price, food cost, gross margin, and margin health." breadcrumbs={["Profit Analysis", "Cost Tracking"]} />
      <CostForm />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <StatCard label="Average Margin" value={`${avgMargin}%`} icon={Percent} helper="Across menu" />
        <StatCard label="Items To Review" value={String(costRecords.filter((row) => row.status !== "Healthy").length)} icon={ChartNoAxesCombined} helper="Margin action needed" />
      </div>
      <div className="mt-6">
        <DataTable<CostTracking>
          data={costRecords}
          columns={[
            { key: "itemName", header: "Item" },
            { key: "sellingPrice", header: "Selling Price", render: (row) => formatCurrency(row.sellingPrice) },
            { key: "foodCost", header: "Food Cost", render: (row) => formatCurrency(row.foodCost) },
            { key: "grossMargin", header: "Gross Margin", render: (row) => formatCurrency(row.grossMargin) },
            { key: "marginPercentage", header: "Margin %", render: (row) => `${row.marginPercentage}%` },
            { key: "status", header: "Status", render: (row) => <StatusBadge tone={row.status === "Healthy" ? "success" : row.status === "Critical" ? "danger" : "warning"}>{row.status}</StatusBadge> }
          ]}
        />
      </div>
    </>
  );
}
