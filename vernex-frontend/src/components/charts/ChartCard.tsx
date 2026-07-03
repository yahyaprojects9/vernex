"use client";

import dynamic from "next/dynamic";
import { EmptyState, LoadingState } from "@/components/ui/StateViews";

type ChartType = "area" | "bar" | "pie";

const ChartRenderer = dynamic(
  () => import("@/components/charts/ChartRenderer").then((mod) => mod.ChartRenderer),
  {
    ssr: false,
    loading: () => <LoadingState label="Loading chart" />
  }
);

export function ChartCard({
  title,
  data,
  dataKey = "value",
  nameKey = "name",
  type = "area"
}: {
  title: string;
  data: Record<string, string | number>[];
  dataKey?: string;
  nameKey?: string;
  type?: ChartType;
}) {
  const total = data.reduce((sum, row) => sum + Number(row[dataKey] || 0), 0);

  if (!data.length || total === 0) {
    return <EmptyState title={`${title}: no data available`} description="Create records or import data to generate this chart." />;
  }

  return (
    <section className="dashboard-surface p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <div className="h-72">
        <ChartRenderer data={data} dataKey={dataKey} nameKey={nameKey} type={type} total={total} />
      </div>
    </section>
  );
}
