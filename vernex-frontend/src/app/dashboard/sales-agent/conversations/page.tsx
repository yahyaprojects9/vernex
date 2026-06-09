import { ChatWindow } from "@/components/chat/ChatWindow";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { conversations, leads } from "@/lib/mock-data";

export default function ConversationsPage() {
  const active = conversations[0];
  const lead = leads.find((item) => item.id === active.leadId) ?? leads[0];

  return (
    <>
      <PageHeader title="Conversation Management" description="WhatsApp-style inbox with AI/Human mode, internal notes, and lead context." breadcrumbs={["Sales Agent", "Conversations"]} />
      <div className="grid gap-4 xl:grid-cols-[300px_1fr_320px]">
        <aside className="dashboard-surface overflow-hidden">
          <div className="border-b border-border p-4">
            <h3 className="font-semibold">Conversation list</h3>
          </div>
          <div className="divide-y divide-border">
            {conversations.slice(0, 9).map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{item.customerName}</p>
                  <StatusBadge tone={item.mode === "AI" ? "primary" : "warning"}>{item.mode}</StatusBadge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.lastMessage}</p>
              </div>
            ))}
          </div>
        </aside>
        <ChatWindow messages={active.messageHistory} />
        <aside className="dashboard-surface space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Lead details</h3>
            <StatusBadge tone="danger">{lead.leadScore}</StatusBadge>
          </div>
          <dl className="space-y-3 text-sm">
            <div><dt className="text-muted-foreground">Requirement</dt><dd className="font-medium">{lead.requirement}</dd></div>
            <div><dt className="text-muted-foreground">Location</dt><dd className="font-medium">{lead.location}</dd></div>
            <div><dt className="text-muted-foreground">Assigned</dt><dd className="font-medium">{lead.assignedStaff}</dd></div>
          </dl>
          <div className="rounded-md bg-muted p-3 text-sm">AI/Human mode toggle: <strong>{active.mode}</strong></div>
          <Textarea defaultValue={active.internalNotes} />
          <div className="flex gap-2"><Button>Take over</Button><Button variant="secondary">Return to AI</Button></div>
        </aside>
      </div>
    </>
  );
}
