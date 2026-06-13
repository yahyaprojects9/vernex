import { cn } from "@/lib/utils";

type StatusTone = "success" | "warning" | "danger" | "neutral" | "primary";

const tones: Record<StatusTone, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-amber-700",
  danger: "bg-danger/10 text-danger",
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary"
};

export function StatusBadge({
  children,
  tone = "neutral"
}: {
  children: React.ReactNode;
  tone?: StatusTone;
}) {
  return (
    <span className={cn("inline-flex max-w-full items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
