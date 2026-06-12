import { PageHeader } from "@/components/layout/PageHeader";
import { RoleManagement } from "@/modules/shared-core/RoleManagement";

export default function RolesPage() {
  return (
    <>
      <PageHeader title="Role Management" description="Role dashboard, role list, role details, permission matrix, hierarchy tree, and assignment view." breadcrumbs={["Shared Core", "Role Management"]} />
      <RoleManagement />
    </>
  );
}
