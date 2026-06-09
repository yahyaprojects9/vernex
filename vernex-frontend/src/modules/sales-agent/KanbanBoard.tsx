import { StatusBadge } from "@/components/ui/StatusBadge";

export type KanbanColumn = {
  title: string;
  cards: {
    id: string;
    title: string;
    description: string;
    badge?: string;
  }[];
};

export function KanbanBoard({ columns }: { columns: KanbanColumn[] }) {
  return (
    <div className="grid gap-4 overflow-x-auto lg:grid-cols-3 xl:grid-cols-6">
      {columns.map((column) => (
        <section key={column.title} className="dashboard-surface min-w-64 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <StatusBadge tone="neutral">{column.cards.length}</StatusBadge>
          </div>
          <div className="space-y-3">
            {column.cards.map((card) => (
              <article key={card.id} className="rounded-md border border-border bg-white p-3">
                <h4 className="text-sm font-semibold">{card.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
                {card.badge ? (
                  <div className="mt-3">
                    <StatusBadge tone="primary">{card.badge}</StatusBadge>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
