import { PageHeader } from "@/components/layout/PageHeader";
import { ReportsGrid } from "@/modules/shared-core/CommonSections";

export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" breadcrumbs={["Organization", "Reports"]} />
      <ReportsGrid />
    </>
  );
}
