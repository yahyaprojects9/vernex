import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { FilterBar } from "@/components/forms/FilterBar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { users } from "@/lib/mock-data";
import type { User } from "@/types";

export default function UsersPage() {
  return (
    <>
      <PageHeader title="User Management" description="Manage owner, admin, and staff users." breadcrumbs={["Shared Core Platform", "Users"]} actionLabel="Add user" />
      <FilterBar searchPlaceholder="Search users" filters={[{ label: "Role", options: ["Owner", "Admin", "Staff"] }, { label: "Status", options: ["Active", "Inactive"] }]} />
      <div className="mt-4">
        <DataTable<User>
          data={users}
          columns={[
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            { key: "role", header: "Role" },
            { key: "status", header: "Status", render: (row) => <StatusBadge tone={row.status === "Active" ? "success" : "neutral"}>{row.status}</StatusBadge> },
            { key: "lastActive", header: "Last Active" },
            { key: "actions", header: "Actions", render: () => <Button variant="secondary"><Plus className="h-4 w-4" /> Edit</Button> }
          ]}
        />
      </div>
    </>
  );
}
