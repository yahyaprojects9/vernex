"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProfitReportPreview } from "@/modules/shared-core/CommonSections";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AnalyticsService } from "@/lib/services";
import { formatCurrency } from "@/lib/utils";

export default function ProfitReportsPage() {
  const [period, setPeriod] = useState("Daily");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  function downloadReport() {
    const metrics = AnalyticsService.dashboardMetrics();
    const content = [
      "Vernex Profit Report",
      `Period: ${period}`,
      `Range: ${fromDate || "Start"} to ${toDate || "End"}`,
      `Revenue: ${formatCurrency(metrics.totalSales)}`,
      `Orders: ${metrics.totalOrders}`,
      `Wastage: ${formatCurrency(metrics.wastage)}`,
      `Profit: ${formatCurrency(metrics.profit)}`,
      `Generated at: ${new Date().toLocaleString()}`
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `profit-report-${period.toLowerCase()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader title="Profit Reports" description="Daily, weekly, monthly, and custom range report previews with export and send actions." breadcrumbs={["Profit Analysis", "Profit Reports"]} />
      <div className="dashboard-surface mb-6 grid gap-4 p-4 lg:grid-cols-[auto_1fr_auto] lg:items-end">
        <div className="flex flex-wrap gap-2">
          {["Daily", "Weekly", "Monthly"].map((item) => (
            <Button key={item} variant={period === item ? "primary" : "secondary"} onClick={() => setPeriod(item)}>{item} report</Button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">From date</span>
            <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">To date</span>
            <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
          </label>
        </div>
        <Button onClick={downloadReport}>Download Report</Button>
      </div>
      <div className="min-w-0 overflow-hidden">
        <ProfitReportPreview />
      </div>
    </>
  );
}
