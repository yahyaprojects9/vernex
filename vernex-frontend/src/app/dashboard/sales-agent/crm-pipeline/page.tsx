import { PageHeader } from "@/components/layout/PageHeader";
import { KanbanBoard } from "@/components/modules/sales-agent/KanbanBoard";
import { leads } from "@/lib/mock-data";

const stages = ["New", "Contacted", "Follow-up", "Interested", "Converted", "Lost"];

export default function CrmPipelinePage() {
  return (
    <>
      <PageHeader title="CRM Pipeline" description="Drag-friendly visual pipeline for lead movement from new to converted or lost." breadcrumbs={["Sales Agent", "CRM Pipeline"]} />
      <KanbanBoard
        columns={stages.map((stage) => ({
          title: stage,
          cards: leads
            .filter((lead) => lead.status === stage)
            .slice(0, 5)
            .map((lead) => ({ id: lead.id, title: lead.leadName, description: lead.requirement, badge: lead.leadScore }))
        }))}
      />
    </>
  );
}
