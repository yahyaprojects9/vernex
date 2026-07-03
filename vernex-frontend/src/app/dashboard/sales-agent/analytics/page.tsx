"use client";

import { BarChart3, Bot, MessageSquare, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { LeadAnalytics } from "@/modules/shared-core/CommonSections";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";

export default function SalesAnalyticsPage() {
  const store = useLocalStore();
  const converted = store.leads.filter((lead) => lead.status === "Converted").length;
  const conversionRate = store.leads.length ? Math.round((converted / store.leads.length) * 100) : 0;
  const aiHandled = store.conversations.filter((conversation) => conversation.mode === "AI").length;
  const humanHandled = store.conversations.filter((conversation) => conversation.mode === "Human").length;

  return (
    <>
      <PageHeader title="Reports & Analytics" breadcrumbs={["Sales Agent", "Analytics"]} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Conversion Rate" value={`${conversionRate}%`} helper="From stored leads" icon={TrendingUp} />
        <StatCard label="AI Handled" value={String(aiHandled)} helper="Conversations" icon={Bot} />
        <StatCard label="Human Handled" value={String(humanHandled)} helper="Escalated" icon={MessageSquare} />
        <StatCard label="Weekly Report" value={store.reports.length ? "Ready" : "No data"} helper="Generated from records" icon={BarChart3} />
      </div>
      <div className="mt-6"><LeadAnalytics /></div>
    </>
  );
}

