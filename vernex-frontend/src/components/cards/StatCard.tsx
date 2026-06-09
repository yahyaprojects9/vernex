import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  trend,
  className
}: {
  label: string;
  value: string;
  helper?: string;
  icon?: LucideIcon;
  trend?: string;
  className?: string;
}) {
  return (
    <article className={cn("dashboard-surface p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-normal">{value}</p>
        </div>
        {Icon ? (
          <span className="rounded-md bg-primary/10 p-2 text-primary">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs">
        {helper ? <span className="text-muted-foreground">{helper}</span> : <span />}
        {trend ? <span className="font-semibold text-success">{trend}</span> : null}
      </div>
    </article>
  );
}
