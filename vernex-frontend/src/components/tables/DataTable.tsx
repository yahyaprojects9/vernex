import { EmptyState } from "@/components/ui/StateViews";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

export function DataTable<T extends object>({
  columns,
  data,
  emptyTitle = "No records found"
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  emptyTitle?: string;
}) {
  if (!data.length) {
    return <EmptyState title={emptyTitle} />;
  }

  return (
    <div className="dashboard-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className={cn("px-4 py-3 font-semibold", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, index) => (
              <tr key={index} className="bg-card transition hover:bg-muted/40">
                {columns.map((column) => (
                  <td key={String(column.key)} className={cn("px-4 py-3 align-middle", column.className)}>
                    {column.render ? column.render(row) : String((row as Record<string, unknown>)[String(column.key)] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
