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

export function ChartRenderer({
  data,
  dataKey,
  nameKey,
  type,
  total
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  nameKey: string;
  type: ChartType;
  total: number;
}) {
  if (type === "bar") {
    return (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={nameKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={36} />
        <Tooltip />
        <Bar dataKey={dataKey} fill="#15848e" radius={[6, 6, 0, 0]} />
      </BarChart>
    );
  }

  if (type === "pie") {
    return (
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
          labelLine
          label={(entry) => {
            const value = Number(entry[dataKey] || 0);
            const percent = total ? Math.round((value / total) * 100) : 0;
            return `${entry[nameKey]}: ${value} (${percent}%)`;
          }}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    );
  }

  return (
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey={nameKey} tickLine={false} axisLine={false} />
      <YAxis tickLine={false} axisLine={false} width={36} />
      <Tooltip />
      <Area type="monotone" dataKey={dataKey} stroke="#15848e" fill="#15848e" fillOpacity={0.16} />
    </AreaChart>
  );
}

export { ResponsiveContainer };
