import { CheckCircle2, Flame, Snowflake, Timer, Users, Zap } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { FilterBar } from "@/components/forms/FilterBar";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { leads, leadTrend, sourceSplit } from "@/lib/mock-data";
import type { Lead } from "@/types";

export default function SalesAgentOverviewPage() {
  return (
    <>
      <PageHeader title="Sales Agent Overview" description="AI sales inbox and CRM snapshot for enquiries, follow-ups, and conversion." breadcrumbs={["Sales Agent", "Overview"]} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total Leads" value="100" icon={Users} helper="All sources" />
        <StatCard label="Hot Leads" value={String(leads.filter((l) => l.leadScore === "Hot").length)} icon={Flame} helper="High intent" />
        <StatCard label="Warm Leads" value={String(leads.filter((l) => l.leadScore === "Warm").length)} icon={Zap} helper="Needs follow-up" />
        <StatCard label="Cold Leads" value={String(leads.filter((l) => l.leadScore === "Cold").length)} icon={Snowflake} helper="Low urgency" />
        <StatCard label="Pending Follow-ups" value={String(leads.filter((l) => l.status === "Follow-up").length)} icon={Timer} helper="Scheduled" />
        <StatCard label="Converted" value={String(leads.filter((l) => l.status === "Converted").length)} icon={CheckCircle2} helper="Won leads" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Lead trend" data={leadTrend} />
        <ChartCard title="Lead source split" data={sourceSplit} type="pie" />
      </div>
      <div className="mt-6">
        <FilterBar searchPlaceholder="Search recent enquiries" filters={[{ label: "Score", options: ["Hot", "Warm", "Cold"] }]} />
      </div>
      <div className="mt-4">
        <DataTable<Lead>
          data={leads.slice(0, 8)}
          columns={[
            { key: "leadName", header: "Lead" },
            { key: "source", header: "Source" },
            { key: "requirement", header: "Requirement" },
            { key: "leadScore", header: "Score", render: (row) => <StatusBadge tone={row.leadScore === "Hot" ? "danger" : row.leadScore === "Warm" ? "warning" : "neutral"}>{row.leadScore}</StatusBadge> },
            { key: "nextFollowUp", header: "Next Follow-up" }
          ]}
        />
      </div>
    </>
  );
}
