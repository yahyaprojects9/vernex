import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { FilterBar } from "@/components/forms/FilterBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { productPerformance } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { MenuItemPerformance } from "@/types";

export default function ProductPerformancePage() {
  return (
    <>
      <PageHeader title="Product Performance" description="Understand what sells, what earns margin, and what needs attention." breadcrumbs={["Profit Analysis", "Product Performance"]} />
      <FilterBar searchPlaceholder="Search menu items" filters={[{ label: "Status", options: ["Best Seller", "Healthy", "Low Margin", "Slow Moving"] }]} />
      <div className="mt-4">
        <DataTable<MenuItemPerformance>
          data={productPerformance}
          columns={[
            { key: "itemName", header: "Item" },
            { key: "category", header: "Category" },
            { key: "quantitySold", header: "Quantity Sold" },
            { key: "revenue", header: "Revenue", render: (row) => formatCurrency(row.revenue) },
            { key: "foodCost", header: "Food Cost", render: (row) => formatCurrency(row.foodCost) },
            { key: "profitMargin", header: "Profit Margin", render: (row) => `${row.profitMargin}%` },
            { key: "performanceStatus", header: "Status", render: (row) => <StatusBadge tone={row.performanceStatus === "Best Seller" ? "success" : row.performanceStatus === "Low Margin" ? "warning" : row.performanceStatus === "Slow Moving" ? "danger" : "primary"}>{row.performanceStatus}</StatusBadge> }
          ]}
        />
      </div>
    </>
  );
}
