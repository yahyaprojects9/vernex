import { AlertTriangle, BadgeIndianRupee, Package, Receipt, ShoppingBag, Star, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { productPerformance, salesRecords, salesTrend, wastageRecords } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { MenuItemPerformance, WastageEntry } from "@/types";

export default function ProfitOverviewPage() {
  const totalSales = salesRecords.reduce((sum, row) => sum + row.totalAmount, 0);
  const totalOrders = salesRecords.length;
  const wastage = wastageRecords.reduce((sum, row) => sum + row.estimatedCostLoss, 0);
  const best = productPerformance[0];
  const worst = productPerformance.find((item) => item.performanceStatus === "Slow Moving") ?? productPerformance[3];

  return (
    <>
      <PageHeader title="Profit Analysis Overview" description="Restaurant owner dashboard for sales, orders, wastage, and estimated profit." breadcrumbs={["Profit Analysis", "Overview"]} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        <StatCard label="Total Sales" value={formatCurrency(totalSales)} icon={BadgeIndianRupee} helper="Demo sales rows" />
        <StatCard label="Orders" value={String(totalOrders)} icon={ShoppingBag} helper="Bills imported" />
        <StatCard label="Avg Order Value" value={formatCurrency(totalSales / totalOrders)} icon={Receipt} helper="Per order" />
        <StatCard label="Best Item" value={best.itemName} icon={Star} helper="Top revenue" />
        <StatCard label="Worst Item" value={worst.itemName} icon={AlertTriangle} helper="Needs review" />
        <StatCard label="Wastage Cost" value={formatCurrency(wastage)} icon={Package} helper="Logged loss" />
        <StatCard label="Est. Profit" value={formatCurrency(totalSales - wastage - 58000)} icon={TrendingUp} helper="After demo costs" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Sales trend" data={salesTrend} />
        <DataTable<MenuItemPerformance>
          data={productPerformance.slice(0, 6)}
          columns={[
            { key: "itemName", header: "Top Items" },
            { key: "revenue", header: "Revenue", render: (row) => formatCurrency(row.revenue) },
            { key: "profitMargin", header: "Margin", render: (row) => `${row.profitMargin}%` },
            { key: "performanceStatus", header: "Status", render: (row) => <StatusBadge tone={row.performanceStatus === "Best Seller" ? "success" : row.performanceStatus === "Low Margin" ? "warning" : "neutral"}>{row.performanceStatus}</StatusBadge> }
          ]}
        />
      </div>
      <div className="mt-6">
        <DataTable<WastageEntry>
          data={wastageRecords.slice(0, 5)}
          columns={[
            { key: "itemName", header: "Wastage Alert" },
            { key: "reason", header: "Reason" },
            { key: "estimatedCostLoss", header: "Cost Loss", render: (row) => formatCurrency(row.estimatedCostLoss) },
            { key: "staffNote", header: "AI Recommendation" }
          ]}
        />
      </div>
    </>
  );
}
