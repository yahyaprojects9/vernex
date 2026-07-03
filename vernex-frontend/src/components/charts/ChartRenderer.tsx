"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type ChartType = "area" | "bar" | "pie";

const colors = ["#15848e", "#16a34a", "#f59e0b", "#ef4444", "#64748b", "#0f766e"];

function formatAxisValue(value: number | string) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return String(value);
  const absoluteValue = Math.abs(numericValue);
  if (absoluteValue >= 10000000) return `${trimNumber(numericValue / 10000000)}Cr`;
  if (absoluteValue >= 100000) return `${trimNumber(numericValue / 100000)}L`;
  if (absoluteValue >= 1000) return `${trimNumber(numericValue / 1000)}K`;
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(numericValue);
}

function trimNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function ChartRenderer({
  data,
  dataKey,
  nameKey,
  type
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  nameKey: string;
  type: ChartType;
  total: number;
}) {
  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 12 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={nameKey} tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={64} tickFormatter={formatAxisValue} />
          <Tooltip />
          <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            outerRadius={88}
            innerRadius={48}
            paddingAngle={3}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 12 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={nameKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={64} tickFormatter={formatAxisValue} />
        <Tooltip />
        <Area type="monotone" dataKey={dataKey} stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.16} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export { ResponsiveContainer };
