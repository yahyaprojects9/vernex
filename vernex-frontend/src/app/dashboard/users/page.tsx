import { PageHeader } from "@/components/layout/PageHeader";
import { UserManagementScreen } from "@/modules/shared-core/UserManagement";

export default function UsersPage() {
  return (
    <>
      <PageHeader title="User Management" breadcrumbs={["Buisness Administration", "User Management"]} />
      <UserManagementScreen />
    </>
  );
}
