import { PageHeader } from "@/components/layout/PageHeader";
import { BranchManagementScreen } from "@/modules/shared-core/ManagementScreens";

export default function BranchesPage() {
  return (
    <>
      <PageHeader title="Branch Management" description="Create branches, assign managers and staff, manage settings, status, statistics, and analytics." breadcrumbs={["Organization", "Branch Management"]} />
      <BranchManagementScreen />
    </>
  );
}
