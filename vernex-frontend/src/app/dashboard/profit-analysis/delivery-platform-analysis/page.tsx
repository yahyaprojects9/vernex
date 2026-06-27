"use client";

import { useState } from "react";
import { Bike, Store, Utensils } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/Button";
import { Select, Textarea } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AuthService, ImportService, SalesAnalyticsService } from "@/lib/services";
import { formatCurrency } from "@/lib/utils";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import type { SalesRecord } from "@/types";

export default function DeliveryPlatformAnalysisPage() {
  const store = useLocalStore();
  const canImport = AuthService.canModify("Profit Analysis", "Import Data");
  const [platform, setPlatform] = useState<SalesRecord["orderSource"] | "Uber Eats" | "Dunzo" | "Custom Delivery Platform">("Swiggy");
  const [manual, setManual] = useState("");
  const platformRows = ["Dine-in", "Swiggy", "Zomato", "Takeaway"].map((source) => {
    const records = store.salesRecords.filter((row) => row.orderSource === source);
    const revenue = records.reduce((sum, row) => sum + row.totalAmount, 0);
    return {
      source,
      orders: records.length,
      revenue,
      status: revenue > 0 ? "Active" : "No records"
    };
  });

  function importPlatformRows() {
    const rows = manual.split("\n").filter(Boolean).map((line, index) => {
      const [date, billNumber, itemName, category, quantity, sellingPrice, totalAmount, time] = line.split(",");
      return {
        id: `PLT-${Date.now()}-${index}`,
        date,
        billNumber,
        itemName,
        category,
        quantity: Number(quantity),
        sellingPrice: Number(sellingPrice),
        totalAmount: Number(totalAmount),
        orderSource: platform === "Zomato" || platform === "Swiggy" ? platform : "Takeaway",
        time
      } as SalesRecord;
    });
    rows.forEach((row) => SalesAnalyticsService.create(row));
    if (rows.length) {
      ImportService.create({
        id: `IMP-PLATFORM-${Date.now()}`,
        importDate: new Date().toISOString().slice(0, 10),
        importedBy: "Current user",
        sourceType: `${platform} Manual Upload`,
        rowsImported: rows.length,
        rowsFailed: 0,
        validationErrors: [],
        status: "Imported"
      });
      setManual("");
    }
  }

  return (
    <>
      <PageHeader title="Delivery Platform Analysis" description="Compare dine-in, takeaway, and delivery platform revenue." breadcrumbs={["Profit Analysis", "Delivery Platforms"]} />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Dine-in Revenue" value={formatCurrency(platformRows[0].revenue)} icon={Store} helper="From stored records" />
        <StatCard label="Swiggy Revenue" value={formatCurrency(platformRows[1].revenue)} icon={Bike} helper="From stored records" />
        <StatCard label="Zomato Revenue" value={formatCurrency(platformRows[2].revenue)} icon={Utensils} helper="From stored records" />
      </div>
      <div className="mt-6"><ChartCard title="Platform comparison" data={platformRows.map((row) => ({ name: row.source, value: row.revenue }))} type="bar" /></div>
      <section className="dashboard-surface mt-6 space-y-4 p-5">
        <div>
          <h2 className="text-lg font-semibold">Platform Import Configuration</h2>
          <p className="text-sm text-muted-foreground">Connect or upload platform revenue. Imported rows feed sales analytics, dashboard totals, reports, and product performance.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Select value={platform} onChange={(event) => setPlatform(event.target.value as typeof platform)}>
            {["Swiggy", "Zomato", "Uber Eats", "Dunzo", "Custom Delivery Platform"].map((item) => <option key={item}>{item}</option>)}
          </Select>
        </div>
        <Textarea value={manual} onChange={(event) => setManual(event.target.value)} placeholder="YYYY-MM-DD,BILL-001,Item Name,Category,Qty,Selling Price,Total Amount,HH:MM" />
        <div className="flex justify-end"><Button onClick={importPlatformRows} disabled={!manual.trim() || !canImport}>Sync Platform Data</Button></div>
      </section>
      <div className="mt-6">
        <DataTable<(typeof platformRows)[number]>
          data={platformRows}
          columns={[
            { key: "source", header: "Channel" },
            { key: "orders", header: "Orders" },
            { key: "revenue", header: "Revenue", render: (row) => formatCurrency(row.revenue) },
            { key: "status", header: "Status", render: (row) => <StatusBadge tone={row.status === "Active" ? "success" : "neutral"}>{row.status}</StatusBadge> }
          ]}
        />
      </div>
    </>
  );
}
