import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { FilterBar } from "@/components/forms/FilterBar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { messageTemplates } from "@/lib/mock-data";
import type { MessageTemplate } from "@/types";

export default function MessageTemplatesPage() {
  return (
    <>
      <PageHeader title="Message Templates" description="Reusable template library for triggers, languages, and follow-ups." breadcrumbs={["Sales Agent", "Message Templates"]} actionLabel="Create template" />
      <FilterBar searchPlaceholder="Search templates" filters={[{ label: "Language", options: ["English", "Hindi", "Malayalam", "Tamil"] }]} />
      <div className="mt-4">
        <DataTable<MessageTemplate>
          data={messageTemplates}
          columns={[
            { key: "templateName", header: "Name" },
            { key: "triggerType", header: "Trigger" },
            { key: "language", header: "Language" },
            { key: "status", header: "Status", render: (row) => <StatusBadge tone={row.status === "Active" ? "success" : "neutral"}>{row.status}</StatusBadge> },
            { key: "messageBody", header: "Preview" },
            { key: "actions", header: "Actions", render: () => <Button variant="secondary">Edit</Button> }
          ]}
        />
      </div>
    </>
  );
}
