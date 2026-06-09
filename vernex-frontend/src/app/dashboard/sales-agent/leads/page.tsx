import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { FilterBar } from "@/components/forms/FilterBar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { leads } from "@/lib/mock-data";
import type { Lead } from "@/types";

export default function LeadsPage() {
  return (
    <>
      <PageHeader title="Lead Management" description="Manage captured leads, scoring, notes, and scheduled follow-ups." breadcrumbs={["Sales Agent", "Leads"]} actionLabel="Add lead" />
      <FilterBar searchPlaceholder="Search by name, phone, or requirement" filters={[{ label: "Status", options: ["New", "Contacted", "Follow-up", "Interested", "Converted", "Lost"] }, { label: "Source", options: ["WhatsApp", "Website", "Email", "Manual"] }]} />
      <div className="mt-4">
        <DataTable<Lead>
          data={leads}
          columns={[
            { key: "leadName", header: "Lead Name" },
            { key: "phone", header: "Phone" },
            { key: "source", header: "Source" },
            { key: "budget", header: "Budget", render: (row) => formatCurrency(row.budget) },
            { key: "status", header: "Status", render: (row) => <StatusBadge tone={row.status === "Converted" ? "success" : row.status === "Lost" ? "danger" : "primary"}>{row.status}</StatusBadge> },
            { key: "leadScore", header: "Score", render: (row) => <StatusBadge tone={row.leadScore === "Hot" ? "danger" : row.leadScore === "Warm" ? "warning" : "neutral"}>{row.leadScore}</StatusBadge> },
            { key: "assignedStaff", header: "Staff" },
            { key: "actions", header: "Actions", render: () => <Button variant="secondary">View/Edit</Button> }
          ]}
        />
      </div>
    </>
  );
}
