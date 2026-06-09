import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PageHeader({
  title,
  description,
  actionLabel,
  breadcrumbs = []
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  breadcrumbs?: string[];
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
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
        <h1 className="text-2xl font-bold tracking-normal md:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actionLabel ? <Button>{actionLabel}</Button> : null}
    </div>
  );
}
