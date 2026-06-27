import { PageHeader } from "@/components/layout/PageHeader";
import { RoleManagement } from "@/modules/shared-core/RoleManagement";

export default function RolesPage() {
  return (
    <>
      <PageHeader title="Role Management" breadcrumbs={["Organization", "Role Management"]} />
      <RoleManagement />
    </>
  );
}
