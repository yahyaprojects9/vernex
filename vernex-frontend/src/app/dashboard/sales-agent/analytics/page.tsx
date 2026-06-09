import { BarChart3, Bot, MessageSquare, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { LeadAnalytics } from "@/modules/shared-core/CommonSections";

export default function SalesAnalyticsPage() {
  return (
    <>
      <PageHeader title="Reports & Analytics" description="Lead trends, source split, quality mix, conversion rate, and AI vs human handling." breadcrumbs={["Sales Agent", "Analytics"]} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Conversion Rate" value="28%" helper="Demo month" icon={TrendingUp} />
        <StatCard label="AI Handled" value="74%" helper="Conversations" icon={Bot} />
        <StatCard label="Human Handled" value="26%" helper="Escalated" icon={MessageSquare} />
        <StatCard label="Weekly Report" value="Ready" helper="Export enabled" icon={BarChart3} />
      </div>
      <div className="mt-6"><LeadAnalytics /></div>
    </>
  );
}
