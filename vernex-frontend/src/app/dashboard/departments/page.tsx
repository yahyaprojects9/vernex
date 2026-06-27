import { PageHeader } from "@/components/layout/PageHeader";
import { DepartmentManagementScreen } from "@/modules/shared-core/ManagementScreens";

export default function DepartmentsPage() {
  return (
    <>
      <PageHeader title="Department Management" breadcrumbs={["Organization", "Department Management"]} />
      <DepartmentManagementScreen />
    </>
  );
}
