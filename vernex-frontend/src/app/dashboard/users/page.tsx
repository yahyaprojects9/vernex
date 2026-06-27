import { PageHeader } from "@/components/layout/PageHeader";
import { UserManagementScreen } from "@/modules/shared-core/ManagementScreens";

export default function UsersPage() {
  return (
    <>
      <PageHeader title="User Management" description="Hierarchy-aware user CRUD with role, branch, and department assignments." breadcrumbs={["Organization", "User Management"]} />
      <UserManagementScreen />
    </>
  );
}
