import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PageHeader({
  title,
  actionLabel,
  onAction,
  breadcrumbs = []
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  breadcrumbs?: string[];
}) {
  return (
    <div className="mb-5 flex min-w-0 flex-col gap-3 sm:mb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {breadcrumbs.length ? (
          <nav className="mb-2 flex flex-wrap items-center gap-1 text-xs font-medium text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb} className="inline-flex items-center gap-1">
                {crumb}
                {index < breadcrumbs.length - 1 ? <ChevronRight className="h-3 w-3" /> : null}
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className="break-words text-2xl font-bold tracking-normal md:text-3xl">{title}</h1>
      </div>
      {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
