"use client";

import { Clock, TrendingDown, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatCurrency } from "@/lib/utils";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";

export default function PeakHourAnalysisPage() {
  const store = useLocalStore();
  const hourlySales = Array.from({ length: 24 }, (_, hour) => {
    const value = store.salesRecords
      .filter((record) => Number(record.time.split(":")[0]) === hour)
      .reduce((sum, record) => sum + record.totalAmount, 0);
    return { name: `${String(hour).padStart(2, "0")}:00`, value };
  });
  const best = hourlySales.reduce((max, row) => (row.value > max.value ? row : max), hourlySales[0]);
  const worst = hourlySales.reduce((min, row) => (row.value < min.value ? row : min), hourlySales[0]);
  return (
    <>
      <PageHeader title="Peak Hour Analysis" breadcrumbs={["Profit Analysis", "Peak Hour Analysis"]} />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Best Sales Hour" value={best.name} helper={formatCurrency(best.value)} icon={TrendingUp} />
        <StatCard label="Lowest Sales Hour" value={worst.name} helper={formatCurrency(worst.value)} icon={TrendingDown} />
        <StatCard label="Suggested Offer Time" value={worst.value ? worst.name : "No sales yet"} helper="Imports will update this" icon={Clock} />
      </div>
      <div className="mt-6"><ChartCard title="Hourly sales chart" data={hourlySales} type="bar" /></div>
    </>
  );
}
