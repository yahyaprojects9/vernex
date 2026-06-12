import { PageHeader } from "@/components/layout/PageHeader";
import { ConversationWorkspace } from "@/modules/sales-agent/ConversationWorkspace";

export default function ConversationsPage() {
  return (
    <>
      <PageHeader title="Conversation Management" description="Create, assign, transfer, pin, archive, filter, send messages, simulate replies, and manage internal notes." breadcrumbs={["Sales Agent", "Conversations"]} />
      <ConversationWorkspace />
    </>
  );
}
