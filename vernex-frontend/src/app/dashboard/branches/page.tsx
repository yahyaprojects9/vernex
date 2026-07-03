import { PageHeader } from "@/components/layout/PageHeader";
import { BranchManagementScreen } from "@/modules/shared-core/ManagementScreens";

export default function BranchesPage() {
  return (
    <>
      <PageHeader title="Branch Management" breadcrumbs={["Buisness Administration", "Branch Management"]} />
      <BranchManagementScreen />
    </>
  );
}
