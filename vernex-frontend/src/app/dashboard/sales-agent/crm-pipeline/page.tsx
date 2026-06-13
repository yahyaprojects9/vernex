"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { AuthService, LeadService } from "@/lib/services";
import { KanbanBoard } from "@/modules/sales-agent/KanbanBoard";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import type { LeadStatus } from "@/types";

const stages = ["New", "Contacted", "Follow-up", "Interested", "Converted", "Lost"];

export default function CrmPipelinePage() {
  const store = useLocalStore();
  const canEditLead = AuthService.canModify("Sales Agent", "Edit Lead");

  return (
    <>
      <PageHeader title="CRM Pipeline" description="Drag-friendly visual pipeline for lead movement from new to converted or lost." breadcrumbs={["Sales Agent", "CRM Pipeline"]} />
      <KanbanBoard
        onMove={canEditLead ? (leadId, status) => LeadService.update(leadId, { status: status as LeadStatus }) : undefined}
        columns={stages.map((stage) => ({
          title: stage,
          cards: store.leads
            .filter((lead) => lead.status === stage)
            .slice(0, 5)
            .map((lead) => ({ id: lead.id, title: lead.leadName, description: lead.requirement, badge: lead.leadScore }))
        }))}
      />
    </>
  );
}
