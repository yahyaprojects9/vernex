import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function FormModal({
  title,
  description,
  children,
  open = false,
  className
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  open?: boolean;
  className?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <section className={cn("dashboard-surface w-full max-w-xl p-5", className)}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          <Button variant="ghost" className="h-9 w-9 px-0" aria-label="Close modal">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-5">{children}</div>
      </section>
    </div>
  );
}
