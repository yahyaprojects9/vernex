import { PageHeader } from "@/components/layout/PageHeader";
import { AiReplyConfigurator } from "@/components/modules/shared-core/CommonSections";

export default function AiAutoReplyPage() {
  return (
    <>
      <PageHeader title="AI Auto Reply" description="Configure reply rules, FAQ knowledge, and test AI responses." breadcrumbs={["Sales Agent", "AI Auto Reply"]} />
      <AiReplyConfigurator />
    </>
  );
}
