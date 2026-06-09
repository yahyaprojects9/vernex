import { BarChart3, Bot, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StateViews";

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
        <div className="grid gap-4">
          <LoadingState label="Loading state component" />
          <EmptyState title="Empty state component" description="Reusable across tables, reports, uploads, and inbox views." />
          <ErrorState title="Error state component" description="Reusable fallback for API-ready screens." />
        </div>
      </div>
    </>
  );
}
