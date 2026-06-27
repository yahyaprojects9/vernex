import { PageHeader } from "@/components/layout/PageHeader";
import { DepartmentManagementScreen } from "@/modules/shared-core/ManagementScreens";

export default function DepartmentsPage() {
  return (
    <>
      <PageHeader title="Department Management" description="Create departments, assign managers and users, configure visibility, and review department analytics." breadcrumbs={["Organization", "Department Management"]} />
      <DepartmentManagementScreen />
    </>
  );
}
