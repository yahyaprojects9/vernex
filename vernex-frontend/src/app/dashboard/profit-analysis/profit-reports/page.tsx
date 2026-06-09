import { PageHeader } from "@/components/layout/PageHeader";
import { ProfitReportPreview } from "@/components/modules/shared-core/CommonSections";
import { Button } from "@/components/ui/Button";

export default function ProfitReportsPage() {
  return (
    <>
      <PageHeader title="Profit Reports" description="Daily, weekly, and monthly report previews with export and send actions." breadcrumbs={["Profit Analysis", "Profit Reports"]} />
      <div className="mb-6 flex flex-wrap gap-2">
        <Button>Daily report</Button>
        <Button variant="secondary">Weekly report</Button>
        <Button variant="secondary">Monthly report</Button>
      </div>
      <ProfitReportPreview />
    </>
  );
}
