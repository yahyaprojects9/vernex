"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProfitReportPreview } from "@/modules/shared-core/CommonSections";
import { Button } from "@/components/ui/Button";
import { DateInput } from "@/components/ui/DateInput";
import { AnalyticsService } from "@/lib/services";
import { formatCurrency } from "@/lib/utils";

export default function ProfitReportsPage() {
  const [period, setPeriod] = useState("Daily");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const metrics = AnalyticsService.dashboardMetrics({ fromDate, toDate });

  function downloadReport() {
    const report = AnalyticsService.generateProfitReport({ period: period as "Daily" | "Weekly" | "Monthly", fromDate, toDate });
    const content = [
      "Vernex Profit Report",
      `Period: ${period}`,
      `Range: ${fromDate || "Start"} to ${toDate || "End"}`,
      `Revenue: ${formatCurrency(metrics.totalSales)}`,
      `Orders: ${metrics.totalOrders}`,
      `Wastage: ${formatCurrency(metrics.wastage)}`,
      `Profit: ${formatCurrency(metrics.profit)}`,
      "",
      `Sales Summary: ${report.salesSummary}`,
      `Best/Worst Items: ${report.bestWorstItems}`,
      `Food Cost: ${report.foodCostSummary}`,
      `Wastage: ${report.wastageSummary}`,
      `Peak Hour: ${report.peakHourSummary}`,
      `Recommendations: ${report.aiRecommendations}`,
      `Owner Actions: ${report.ownerActionPoints}`,
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
      <PageHeader title="Profit Reports" breadcrumbs={["Profit Analysis", "Profit Reports"]} />
      <div className="dashboard-surface mb-6 grid gap-4 p-4 lg:grid-cols-[auto_1fr_auto] lg:items-end">
        <div className="flex flex-wrap gap-2">
          {["Daily", "Weekly", "Monthly"].map((item) => (
            <Button key={item} variant={period === item ? "primary" : "secondary"} onClick={() => setPeriod(item)}>{item} report</Button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">From date</span>
            <DateInput value={fromDate} onValueChange={setFromDate} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">To date</span>
            <DateInput value={toDate} onValueChange={setToDate} />
          </label>
        </div>
        <Button onClick={downloadReport}>Download Report</Button>
      </div>
      <div className="min-w-0 overflow-hidden">
        <ProfitReportPreview period={period as "Daily" | "Weekly" | "Monthly"} fromDate={fromDate} toDate={toDate} />
      </div>
    </>
  );
}
