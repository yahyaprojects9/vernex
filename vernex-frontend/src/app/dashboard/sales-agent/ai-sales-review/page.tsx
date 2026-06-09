import { PageHeader } from "@/components/layout/PageHeader";
import { SalesReviewPanel } from "@/components/modules/shared-core/CommonSections";

export default function AiSalesReviewPage() {
  return (
    <>
      <PageHeader title="AI Sales Review" description="Test prompts, approve AI responses, reject weak replies, and capture improvement notes." breadcrumbs={["Sales Agent", "AI Sales Review"]} />
      <SalesReviewPanel />
    </>
  );
}
