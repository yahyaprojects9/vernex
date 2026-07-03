"use client";

import { useMemo, useState } from "react";
import { Archive, FileText, Paperclip, Pin, Send, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AuthService, SalesWorkflowService } from "@/lib/services";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import type { Conversation, Lead } from "@/types";

type ConversationRecord = Conversation & {
  unreadCount?: number;
  pinned?: boolean;
  archived?: boolean;
  assignedUserId?: string;
};

export function ConversationWorkspace() {
  const store = useLocalStore();
  const canCreateConversation = AuthService.canModify("Sales Agent", "Create Conversation");
  const canSendMessage = AuthService.canModify("Sales Agent", "Send Message");
  const canAssignConversation = AuthService.canModify("Sales Agent", "Assign Conversation");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeId, setActiveId] = useState(store.conversations[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [newLeadId, setNewLeadId] = useState(store.leads[0]?.id ?? "");
  const [captureDraft, setCaptureDraft] = useState({
    leadName: "",
    phone: "",
    requirement: ""
  });
  const active = store.conversations.find((conversation) => conversation.id === activeId) ?? store.conversations[0];

  const visible = useMemo(() => {
    return store.conversations.filter((conversation) => {
      const text = `${conversation.customerName} ${conversation.lastMessage}`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());
      const record = conversation as ConversationRecord;
      const matchesFilter = filter === "All" || record.mode === filter || (filter === "Pinned" && Boolean(record.pinned)) || (filter === "Archived" && Boolean(record.archived));
      return matchesQuery && matchesFilter;
    });
  }, [store.conversations, query, filter]);

  function createConversation() {
    const lead = store.leads.find((item) => item.id === newLeadId);
    if (!lead) return;
    const conversation: Conversation = {
      id: `CNV-${Date.now()}`,
      customerName: lead.leadName,
      channel: "WhatsApp",
      lastMessage: "New conversation created.",
      mode: "AI",
      messageHistory: [{ id: `MSG-${Date.now()}`, sender: "customer", body: "New enquiry started.", time: "Now" }],
      internalNotes: "",
      leadId: lead.id
    };
    SalesWorkflowService.createConversation(conversation);
    setActiveId(conversation.id);
  }

  function captureAiLead() {
    const currentUser = AuthService.currentUser();
    const lead: Lead = {
      id: `LEA-AI-${Date.now()}`,
      leadName: captureDraft.leadName.trim() || "WhatsApp AI Lead",
      phone: captureDraft.phone.trim(),
      email: "",
      source: "WhatsApp",
      businessName: "",
      requirement: captureDraft.requirement.trim() || "Captured from AI conversation.",
      interestedService: "WhatsApp Sales Agent",
      budget: 0,
      location: "",
      urgency: "Just Enquiry",
      status: "Contacted",
      leadScore: "Cold",
      assignedStaff: currentUser?.name ?? "",
      assignedUserId: currentUser?.id,
      branchId: currentUser?.branchIds[0],
      departmentId: currentUser?.departmentIds[0],
      nextFollowUp: "",
      lastContactedDate: new Date().toISOString().slice(0, 10),
      followUpCount: 0,
      quotationStatus: "Not Sent",
      conversationMode: "AI Active",
      notes: "Auto-captured from AI reply workflow."
    };
    const conversation: Conversation = {
      id: `CNV-AI-${Date.now()}`,
      customerName: lead.leadName,
      channel: "WhatsApp",
      lastMessage: lead.requirement,
      mode: "AI",
      messageHistory: [
        { id: `MSG-AI-${Date.now()}`, sender: "customer", body: lead.requirement, time: "Now" },
        { id: `MSG-AI-${Date.now()}-REPLY`, sender: "ai", body: "Thanks. I captured your enquiry and our team will follow up.", time: "Now" }
      ],
      internalNotes: "Lead captured from inbound AI enquiry.",
      leadId: lead.id,
      assignedUserId: currentUser?.id,
      branchId: currentUser?.branchIds[0],
      departmentId: currentUser?.departmentIds[0]
    };
    SalesWorkflowService.createLead(lead);
    SalesWorkflowService.createConversation(conversation);
    setActiveId(conversation.id);
    setNewLeadId(lead.id);
    setCaptureDraft({ leadName: "", phone: "", requirement: "" });
  }

  function sendMessage() {
    if (!active || (!message.trim() && !attachments.length)) return;
    const attachmentText = attachments.length ? `\nAttachments: ${attachments.map((file) => file.name).join(", ")}` : "";
    const staffMessage = { id: `MSG-${Date.now()}`, sender: "staff" as const, body: `${message || "Attached files"}${attachmentText}`, time: "Now" };
    const aiReply = { id: `MSG-${Date.now()}-AI`, sender: "ai" as const, body: "Thanks. I am checking availability and package options now.", time: "Typing..." };
    SalesWorkflowService.updateConversation(active.id, {
      messageHistory: [...active.messageHistory, staffMessage, aiReply],
      lastMessage: message,
      mode: "Human"
    });
    setMessage("");
    setAttachments([]);
  }

  function patchActive(patch: Record<string, unknown>) {
    if (!active) return;
    SalesWorkflowService.updateConversation(active.id, patch);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_1fr_320px]">
      <aside className="dashboard-surface overflow-hidden">
        <div className="space-y-3 border-b border-border p-4">
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <p className="text-sm font-semibold">Capture AI Lead</p>
            <p className="mt-1 text-xs text-muted-foreground">Convert an inbound WhatsApp/AI enquiry into a lead and conversation.</p>
            <div className="mt-3 space-y-2">
              <Input placeholder="Lead name" value={captureDraft.leadName} disabled={!canCreateConversation} onChange={(event) => setCaptureDraft({ ...captureDraft, leadName: event.target.value })} />
              <Input placeholder="Phone number" value={captureDraft.phone} disabled={!canCreateConversation} onChange={(event) => setCaptureDraft({ ...captureDraft, phone: event.target.value })} />
              <Textarea placeholder="Requirement from AI chat" value={captureDraft.requirement} disabled={!canCreateConversation} onChange={(event) => setCaptureDraft({ ...captureDraft, requirement: event.target.value })} />
              <Button className="w-full" onClick={captureAiLead} disabled={!canCreateConversation || (!captureDraft.leadName.trim() && !captureDraft.phone.trim() && !captureDraft.requirement.trim())}>Capture Lead</Button>
            </div>
          </div>
          <Select value={newLeadId} disabled={!canCreateConversation || !store.leads.length} onChange={(event) => setNewLeadId(event.target.value)}>
            {store.leads.length ? store.leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.leadName}</option>) : <option value="">Create a lead first</option>}
          </Select>
          <Button className="w-full" onClick={createConversation} disabled={!canCreateConversation || !newLeadId}>Start Lead Conversation</Button>
          <Input placeholder="Search conversations" value={query} onChange={(event) => setQuery(event.target.value)} />
          <Button variant="secondary" className={`w-full ${filtersOpen ? "border-slate-400 bg-slate-200 text-slate-900 hover:bg-slate-200" : ""}`} aria-pressed={filtersOpen} onClick={() => setFiltersOpen((value) => !value)}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
          {filtersOpen ? <label className="block space-y-1"><span className="text-sm font-medium">Conversation type</span><Select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option>All</option><option>AI</option><option>Human</option><option>Pinned</option><option>Archived</option>
          </Select></label> : null}
        </div>
        <div className="max-h-[620px] overflow-y-auto">
          {visible.map((conversation) => (
            <button
              key={conversation.id}
              className={`block w-full border-b border-border p-4 text-left ${active?.id === conversation.id ? "bg-primary/10" : ""}`}
              onClick={() => setActiveId(conversation.id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{conversation.customerName}</span>
                <span className="flex items-center gap-1">
                  {(conversation as ConversationRecord).pinned ? <Pin className="h-3 w-3 text-primary" /> : null}
                  <StatusBadge tone={conversation.mode === "AI" ? "primary" : "warning"}>{conversation.mode}</StatusBadge>
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{conversation.lastMessage}</p>
              {(conversation as ConversationRecord).unreadCount ? <p className="mt-2 text-xs font-semibold text-primary">{(conversation as ConversationRecord).unreadCount} unread</p> : null}
            </button>
          ))}
        </div>
      </aside>

      <section className="dashboard-surface flex min-h-[680px] flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="font-semibold">{active?.customerName}</h2>
          </div>
          <StatusBadge tone="success">Online</StatusBadge>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
          {active?.messageHistory.map((item) => (
            <div key={item.id} className={`flex ${item.sender === "customer" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[78%] rounded-lg px-4 py-2 text-sm ${item.sender === "customer" ? "bg-white" : "bg-primary text-primary-foreground"}`}>
                <p>{item.body}</p>
                <span className="mt-1 block text-[11px] opacity-75">{item.time} - delivered</span>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">AI typing simulation appears after staff replies.</p>
        </div>
        <div className="flex gap-2 border-t border-border p-3">
          <label className="focus-ring inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-card hover:bg-muted" aria-label="Attach files">
            <Paperclip className="h-4 w-4" />
            <input
              type="file"
              multiple
              className="sr-only"
              disabled={!canSendMessage}
              onChange={(event) => setAttachments(Array.from(event.target.files ?? []))}
            />
          </label>
          <Input placeholder="Send message" value={message} disabled={!canSendMessage} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} />
          <Button className="h-10 w-10 px-0" onClick={sendMessage} aria-label="Send" disabled={!canSendMessage}><Send className="h-4 w-4" /></Button>
        </div>
        {attachments.length ? (
          <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file) => (
                <span key={`${file.name}-${file.size}`} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                  <FileText className="h-3 w-3" />
                  {file.name}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <aside className="dashboard-surface max-h-[680px] space-y-4 overflow-y-auto p-5">
        <h2 className="font-semibold">Conversation Controls</h2>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => patchActive({ mode: active?.mode === "AI" ? "Human" : "AI" })} disabled={!canAssignConversation}>AI/Human</Button>
          <Button variant="secondary" onClick={() => patchActive({ pinned: !(active as ConversationRecord | undefined)?.pinned })} disabled={!canAssignConversation}><Pin className="h-4 w-4" /> Pin</Button>
          <Button variant="secondary" onClick={() => patchActive({ archived: !(active as ConversationRecord | undefined)?.archived })} disabled={!canAssignConversation}><Archive className="h-4 w-4" /> Archive</Button>
          <Button variant="secondary" onClick={() => patchActive({ assignedUserId: store.users[1]?.id })} disabled={!canAssignConversation}>Assign</Button>
        </div>
        <label className="space-y-1">
          <span className="text-sm font-medium">Internal Notes</span>
          <Textarea value={active?.internalNotes ?? ""} disabled={!canAssignConversation} onChange={(event) => patchActive({ internalNotes: event.target.value })} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Transfer To</span>
          <div className="max-h-56 overflow-y-auto rounded-md border border-border bg-white p-2">
            {store.users.length ? store.users.map((user) => (
              <button
                key={user.id}
                className={`block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted ${active?.assignedUserId === user.id ? "bg-primary/10 text-primary" : ""}`}
                onClick={() => patchActive({ assignedUserId: user.id })}
                disabled={!canAssignConversation}
              >
                {user.name}
              </button>
            )) : <p className="p-2 text-sm text-muted-foreground">No users available for transfer.</p>}
          </div>
        </label>
      </aside>
    </div>
  );
}
