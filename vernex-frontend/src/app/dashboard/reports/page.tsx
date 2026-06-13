import { FilterBar } from "@/components/forms/FilterBar";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReportsGrid } from "@/modules/shared-core/CommonSections";

export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Shared report shell for platform exports and business summaries." breadcrumbs={["Shared Core Platform", "Reports"]} actionLabel="Download" />
      <FilterBar searchPlaceholder="Search reports" filters={[{ label: "Period", options: ["Daily", "Weekly", "Monthly"] }]} />
      <div className="mt-6"><ReportsGrid /></div>
    </>
  );
}
