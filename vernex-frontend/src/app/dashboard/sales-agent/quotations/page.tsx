import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { FilterBar } from "@/components/forms/FilterBar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { quotations } from "@/lib/mock-data";
import type { Quotation } from "@/types";

export default function QuotationsPage() {
  return (
    <>
      <PageHeader title="Quotation Management" description="Create, preview, edit, and send quotation packages." breadcrumbs={["Sales Agent", "Quotations"]} actionLabel="Create quotation" />
      <FilterBar searchPlaceholder="Search quotations" filters={[{ label: "Status", options: ["Draft", "Sent", "Accepted", "Expired"] }]} />
      <div className="mt-4">
        <DataTable<Quotation>
          data={quotations}
          columns={[
            { key: "quotationTitle", header: "Title" },
            { key: "servicePackageName", header: "Package" },
            { key: "price", header: "Price", render: (row) => formatCurrency(row.price) },
            { key: "validity", header: "Validity" },
            { key: "status", header: "Status", render: (row) => <StatusBadge tone={row.status === "Accepted" ? "success" : row.status === "Expired" ? "danger" : "warning"}>{row.status}</StatusBadge> },
            { key: "actions", header: "Actions", render: () => <div className="flex gap-2"><Button variant="secondary">Preview</Button><Button>Send</Button></div> }
          ]}
        />
      </div>
    </>
  );
}
