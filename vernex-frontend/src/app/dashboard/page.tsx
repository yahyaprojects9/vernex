import { BarChart3, Bot, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReportPreview } from "@/components/modules/shared-core/ReportPreview";
import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { leads, salesTrend } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { Lead } from "@/types";

const platformTrend = [
  { name: "Mon", value: 42 },
  { name: "Tue", value: 58 },
  { name: "Wed", value: 51 },
  { name: "Thu", value: 73 },
  { name: "Fri", value: 80 },
  { name: "Sat", value: 69 },
  { name: "Sun", value: 86 }
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Vernex Platform"
        description="Unified dashboard foundation for shared operations, AI sales workflows, and restaurant profit analysis."
        breadcrumbs={["Shared Core Platform", "Dashboard"]}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Users" value="20" helper="Owner, admin, and staff access" icon={Users} trend="+12%" />
        <StatCard label="Sales Agent Leads" value="100" helper="Across WhatsApp, website, email" icon={Bot} trend="+18%" />
        <StatCard label="Profit Records" value="100" helper="Sample sales rows ready" icon={TrendingUp} trend="+9%" />
        <StatCard label="Reports Ready" value="10" helper="Daily, weekly, monthly previews" icon={BarChart3} trend="+6%" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Platform Activity" description="Demo-ready weekly activity trend" data={platformTrend} />
        <ChartCard title="Profit Trend" description="Restaurant sales movement from demo records" data={salesTrend} type="bar" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DataTable<Lead>
          data={leads.slice(0, 6)}
          columns={[
            { key: "leadName", header: "Recent Lead" },
            { key: "source", header: "Source" },
            { key: "requirement", header: "Requirement" },
            { key: "budget", header: "Budget", render: (row) => formatCurrency(row.budget) },
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
          title="Today at a glance"
          items={[
            { label: "Sales Agent", value: "36 new enquiries, 18 hot leads" },
            { label: "Profit Analysis", value: "Dinner peak is strongest between 7 PM and 9 PM" },
            { label: "Owner Action", value: "Review low-margin items and follow up with hot leads first" },
            { label: "Next Report", value: "Daily report is ready for export" }
          ]}
        />
      </div>
    </>
  );
}
