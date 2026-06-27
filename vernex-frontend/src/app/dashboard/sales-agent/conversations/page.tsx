import { PageHeader } from "@/components/layout/PageHeader";
import { ConversationWorkspace } from "@/modules/sales-agent/ConversationWorkspace";

export default function ConversationsPage() {
  return (
    <>
      <PageHeader title="Conversation Management" breadcrumbs={["Sales Agent", "Conversations"]} />
      <ConversationWorkspace />
    </>
  );
}
