"use client";

import { BarChart3, Bot, CheckCircle2, Flame, ShoppingBag, Snowflake, Timer, TrendingUp, Users, Zap } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { DataTable } from "@/components/tables/DataTable";
import { EmptyState } from "@/components/ui/StateViews";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ReportPreview } from "@/modules/shared-core/ReportPreview";
import { AnalyticsService, AuthService } from "@/lib/services";
import { formatCurrency } from "@/lib/utils";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import type { Lead, MenuItemPerformance } from "@/types";

export function DashboardOverview() {
  const store = useLocalStore();
  const metrics = AnalyticsService.dashboardMetrics();
  const salesTrend = AnalyticsService.salesTrend();
  const role = AuthService.currentRole();
  const hasBusinessData = Boolean(store.leads.length || store.salesRecords.length || store.wastage.length || store.costs.length || store.productPerformance.length);

  return (
    <>
      {!hasBusinessData ? <p className="mb-6 rounded-md bg-muted p-3 text-sm font-medium">No Data Available. Start by creating records or importing data.</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Users" value={String(store.users.filter((item) => item.status === "Active").length)} helper="Visible in your role scope" icon={Users} />
        <StatCard label="Leads" value={String(metrics.leads)} helper={metrics.leads ? "Stored lead records" : "0 Leads"} icon={Bot} />
        <StatCard label="Revenue" value={formatCurrency(metrics.totalSales)} helper={metrics.totalSales ? "Imported or entered sales" : "0 Sales"} icon={TrendingUp} />
        <StatCard label="Profit" value={formatCurrency(metrics.profit)} helper={metrics.profit ? "Sales minus wastage" : "0 Profit"} icon={BarChart3} />
      </div>
      {hasBusinessData ? <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Platform Sales Activity" description="Generated from stored sales records" data={salesTrend} />
        <ChartCard title="Profit Trend" description="Recalculates after imports" data={salesTrend} type="bar" />
      </div> : <div className="mt-6"><EmptyState title="No chart data available" description="Create records or import data to generate dashboard charts." /></div>}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DataTable<Lead>
          data={store.leads.slice(0, 6)}
          columns={[
            { key: "leadName", header: "Recent Lead" },
            { key: "source", header: "Source" },
            { key: "requirement", header: "Requirement" },
            { key: "assignedStaff", header: "Assigned To" },
            {
              key: "leadScore",
              header: "Score",
              render: (row) => (
                <StatusBadge tone={row.leadScore === "Hot" ? "danger" : row.leadScore === "Warm" ? "warning" : "neutral"}>
                  {row.leadScore}
                </StatusBadge>
              )
            }
          ]}
        />
        <ReportPreview
          title={`${role?.name ?? "Role"} summary`}
          items={[
            { label: "Leads", value: `${metrics.leads} visible leads` },
            { label: "Sales Rows", value: `${metrics.totalOrders} stored sales rows` },
            { label: "Next Step", value: hasBusinessData ? "Review analytics and reports" : "Create records or import data" }
          ]}
        />
      </div>
    </>
  );
}

export function SalesAgentOverview() {
  const store = useLocalStore();
  const sourceSplit = ["WhatsApp", "Website", "Email", "Manual"].map((source) => ({
    name: source,
    value: store.leads.filter((lead) => lead.source === source).length
  }));
  const leadTrend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name, index) => ({
    name,
    value: store.leads.filter((_, rowIndex) => rowIndex % 7 === index).length
  }));

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total Leads" value={String(store.leads.length)} icon={Users} helper="All visible sources" />
        <StatCard label="Hot Leads" value={String(store.leads.filter((l) => l.leadScore === "Hot").length)} icon={Flame} helper="High intent" />
        <StatCard label="Warm Leads" value={String(store.leads.filter((l) => l.leadScore === "Warm").length)} icon={Zap} helper="Needs follow-up" />
        <StatCard label="Cold Leads" value={String(store.leads.filter((l) => l.leadScore === "Cold").length)} icon={Snowflake} helper="Low urgency" />
        <StatCard label="Pending Follow-ups" value={String(store.leads.filter((l) => l.status === "Follow-up").length)} icon={Timer} helper="Scheduled" />
        <StatCard label="Converted" value={String(store.leads.filter((l) => l.status === "Converted").length)} icon={CheckCircle2} helper="Won leads" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Lead trend" data={leadTrend} />
        <ChartCard title="Lead source split" data={sourceSplit} type="pie" />
      </div>
    </>
  );
}

export function ProfitOverview() {
  const store = useLocalStore();
  const metrics = AnalyticsService.dashboardMetrics();
  const best = store.productPerformance[0];
  const worst = store.productPerformance.find((item) => item.performanceStatus === "Slow Moving") ?? store.productPerformance[3];
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        <StatCard label="Total Sales" value={formatCurrency(metrics.totalSales)} icon={TrendingUp} helper="Stored sales rows" />
        <StatCard label="Orders" value={String(metrics.totalOrders)} icon={ShoppingBag} helper="Bills imported" />
        <StatCard label="Avg Order Value" value={formatCurrency(metrics.totalOrders ? metrics.totalSales / metrics.totalOrders : 0)} icon={BarChart3} helper="Per order" />
        <StatCard label="Best Item" value={best?.itemName ?? "None"} icon={CheckCircle2} helper="Top revenue" />
        <StatCard label="Worst Item" value={worst?.itemName ?? "None"} icon={Timer} helper="Needs review" />
        <StatCard label="Wastage Cost" value={formatCurrency(metrics.wastage)} icon={Snowflake} helper="Logged loss" />
        <StatCard label="Est. Profit" value={formatCurrency(metrics.profit)} icon={TrendingUp} helper="After wastage" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Sales trend" data={AnalyticsService.salesTrend()} />
        <DataTable<MenuItemPerformance>
          data={store.productPerformance.slice(0, 6)}
          columns={[
            { key: "itemName", header: "Top Items" },
            { key: "revenue", header: "Revenue", render: (row) => formatCurrency(row.revenue) },
            { key: "profitMargin", header: "Margin", render: (row) => `${row.profitMargin}%` },
            { key: "performanceStatus", header: "Status", render: (row) => <StatusBadge tone={row.performanceStatus === "Best Seller" ? "success" : row.performanceStatus === "Low Margin" ? "warning" : "neutral"}>{row.performanceStatus}</StatusBadge> }
          ]}
        />
      </div>
    </>
  );
}
