"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AuthService, SalesWorkflowService } from "@/lib/services";
import { KanbanBoard } from "@/modules/sales-agent/KanbanBoard";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import type { LeadStatus } from "@/types";

const stages = ["New", "Contacted", "Follow-up", "Quotation Sent", "Interested", "Converted", "Lost"];

export default function CrmPipelinePage() {
  const store = useLocalStore();
  const canEditLead = AuthService.canModify("Sales Agent", "Edit Lead");
  const [pipelineLeads, setPipelineLeads] = useState(store.leads);

  useEffect(() => {
    setPipelineLeads(store.leads);
  }, [store.leads]);

  function moveLead(leadId: string, status: string) {
    setPipelineLeads((leads) => leads.map((lead) => lead.id === leadId ? { ...lead, status: status as LeadStatus } : lead));
    SalesWorkflowService.moveLead(leadId, status as LeadStatus);
  }

  return (
    <>
      <PageHeader title="CRM Pipeline" breadcrumbs={["Sales Agent", "CRM Pipeline"]} />
      <KanbanBoard
        onMove={canEditLead ? moveLead : undefined}
        columns={stages.map((stage) => ({
          title: stage,
          cards: pipelineLeads
            .filter((lead) => lead.status === stage)
            .slice(0, 5)
            .map((lead) => ({ id: lead.id, title: lead.leadName, description: lead.requirement, badge: lead.leadScore }))
        }))}
      />
    </>
  );
}

