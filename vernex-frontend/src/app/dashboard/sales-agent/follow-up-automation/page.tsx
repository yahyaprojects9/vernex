import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { FilterBar } from "@/components/forms/FilterBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { followUpRules } from "@/lib/mock-data";
import type { FollowUpRule } from "@/types";

export default function FollowUpAutomationPage() {
  return (
    <>
      <PageHeader title="Follow-Up Automation" description="Rule builder for delays, templates, status triggers, and active automations." breadcrumbs={["Sales Agent", "Follow-Up Automation"]} actionLabel="Add rule" />
      <FilterBar searchPlaceholder="Search rules" filters={[{ label: "Status", options: ["Active", "Inactive"] }]} />
      <div className="mt-4">
        <DataTable<FollowUpRule>
          data={followUpRules}
          columns={[
            { key: "ruleName", header: "Rule" },
            { key: "triggerCondition", header: "Trigger" },
            { key: "delayTime", header: "Delay" },
            { key: "template", header: "Template" },
            { key: "leadStatus", header: "Lead Status" },
            { key: "status", header: "Status", render: (row) => <StatusBadge tone={row.status === "Active" ? "success" : "neutral"}>{row.status}</StatusBadge> }
          ]}
        />
      </div>
    </>
  );
}
