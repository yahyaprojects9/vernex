import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LoadingState({ label = "Loading data" }: { label?: string }) {
  return (
    <div className="dashboard-surface flex min-h-48 flex-col items-center justify-center gap-3 p-6 text-center">
      <Loader2 className="h-7 w-7 animate-spin text-primary" />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

export function EmptyState({
  title = "No data yet",
  description = "Once data is available, it will appear here.",
  actionLabel,
  onAction
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="dashboard-surface flex min-h-48 flex-col items-center justify-center gap-3 p-6 text-center">
      <Inbox className="h-8 w-8 text-muted-foreground" />
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && onAction ? <Button variant="secondary" onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="dashboard-surface flex min-h-48 flex-col items-center justify-center gap-3 p-6 text-center">
      <AlertTriangle className="h-8 w-8 text-danger" />
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
