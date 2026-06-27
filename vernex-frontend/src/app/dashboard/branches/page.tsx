import { PageHeader } from "@/components/layout/PageHeader";
import { BranchManagementScreen } from "@/modules/shared-core/ManagementScreens";

export default function BranchesPage() {
  return (
    <>
      <PageHeader title="Branch Management" breadcrumbs={["Organization", "Branch Management"]} />
      <BranchManagementScreen />
    </>
  );
}
