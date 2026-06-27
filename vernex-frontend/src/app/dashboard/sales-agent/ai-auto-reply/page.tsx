import { PageHeader } from "@/components/layout/PageHeader";
import { AiReplyConfigurator } from "@/modules/shared-core/CommonSections";

export default function AiAutoReplyPage() {
  return (
    <>
      <PageHeader title="AI Auto Reply" breadcrumbs={["Sales Agent", "AI Auto Reply"]} />
      <AiReplyConfigurator />
    </>
  );
}
