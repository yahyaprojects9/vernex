"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type ChartType = "area" | "bar" | "pie";

const colors = ["#15848e", "#16a34a", "#f59e0b", "#ef4444", "#64748b", "#0f766e"];

export function ChartCard({
  title,
  description,
  data,
  dataKey = "value",
  nameKey = "name",
  type = "area"
}: {
  title: string;
  description?: string;
  data: Record<string, string | number>[];
  dataKey?: string;
  nameKey?: string;
  type?: ChartType;
}) {
  return (
    <section className="dashboard-surface p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={nameKey} tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <Tooltip />
              <Bar dataKey={dataKey} fill="#15848e" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : type === "pie" ? (
            <PieChart>
              <Tooltip />
              <Pie data={data} dataKey={dataKey} nameKey={nameKey} outerRadius={100} innerRadius={56} paddingAngle={3}>
                {data.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={nameKey} tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <Tooltip />
              <Area type="monotone" dataKey={dataKey} stroke="#15848e" fill="#15848e" fillOpacity={0.16} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
