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

export function KanbanBoard({
  columns,
  onMove
}: {
  columns: KanbanColumn[];
  onMove?: (cardId: string, columnTitle: string) => void;
}) {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {columns.map((column) => (
        <section
          key={column.title}
          className="dashboard-surface min-w-0 p-3 sm:p-4"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            const cardId = event.dataTransfer.getData("text/plain");
            if (cardId) onMove?.(cardId, column.title);
          }}
        >
          <div className="mb-3 flex min-w-0 items-center justify-between gap-2 sm:mb-4">
            <h3 className="truncate text-sm font-semibold">{column.title}</h3>
            <StatusBadge tone="neutral">{column.cards.length}</StatusBadge>
          </div>
          <div className="space-y-3">
            {column.cards.map((card) => (
              <article
                key={card.id}
                draggable={Boolean(onMove)}
                onDragStart={(event) => event.dataTransfer.setData("text/plain", card.id)}
                className="min-w-0 cursor-grab rounded-md border border-border bg-white p-3 active:cursor-grabbing"
              >
                <h4 className="break-words text-sm font-semibold">{card.title}</h4>
                <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{card.description}</p>
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
