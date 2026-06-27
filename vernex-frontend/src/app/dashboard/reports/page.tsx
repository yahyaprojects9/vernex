import { PageHeader } from "@/components/layout/PageHeader";
import { ReportsGrid } from "@/modules/shared-core/CommonSections";

export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Organization report shell for platform exports and business summaries." breadcrumbs={["Organization", "Reports"]} />
      <ReportsGrid />
    </>
  );
}
