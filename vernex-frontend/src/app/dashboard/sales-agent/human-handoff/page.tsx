import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { handoffRequests } from "@/lib/mock-data";
import type { HandoffRequest } from "@/types";

export default function HumanHandoffPage() {
  return (
    <>
      <PageHeader title="Human Handoff" description="Pending requests where AI needs staff support or supervisor review." breadcrumbs={["Sales Agent", "Human Handoff"]} />
      <DataTable<HandoffRequest>
        data={handoffRequests}
        columns={[
          { key: "customerName", header: "Customer" },
          { key: "reason", header: "Reason" },
          { key: "conversationSummary", header: "Summary" },
          { key: "assignedStaff", header: "Assigned Staff" },
          { key: "status", header: "Status", render: (row) => <StatusBadge tone={row.status === "Closed" ? "success" : "warning"}>{row.status}</StatusBadge> },
          { key: "actions", header: "Actions", render: () => <div className="flex gap-2"><Button>Take over</Button><Button variant="secondary">Close</Button></div> }
        ]}
      />
    </>
  );
}
