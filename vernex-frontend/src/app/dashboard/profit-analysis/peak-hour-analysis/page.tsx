import { Clock, TrendingDown, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { hourlySales } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function PeakHourAnalysisPage() {
  const best = hourlySales.reduce((max, row) => (row.value > max.value ? row : max), hourlySales[0]);
  const worst = hourlySales.reduce((min, row) => (row.value < min.value ? row : min), hourlySales[0]);
  return (
    <>
      <PageHeader title="Peak Hour Analysis" description="Find the best and slowest sales windows for smarter offers." breadcrumbs={["Profit Analysis", "Peak Hour Analysis"]} />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Best Sales Hour" value={best.name} helper={formatCurrency(best.value)} icon={TrendingUp} />
        <StatCard label="Lowest Sales Hour" value={worst.name} helper={formatCurrency(worst.value)} icon={TrendingDown} />
        <StatCard label="Suggested Offer Time" value="5:00 PM" helper="Boost early dinner demand" icon={Clock} />
      </div>
      <div className="mt-6"><ChartCard title="Hourly sales chart" data={hourlySales} type="bar" /></div>
    </>
  );
}
