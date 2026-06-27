import { MoreVertical, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function LabeledField({ label, children, className }: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return <label className={cn("space-y-1", className)}><span className="text-sm font-medium">{label}</span>{children}</label>;
}

export function UserAvatar({ name, src, size = 44, strong = false }: {
  name: string;
  src?: string;
  size?: number;
  strong?: boolean;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden border bg-cover bg-center font-bold",
        strong ? "border-primary bg-primary text-primary-foreground" : "border-primary/20 bg-primary/10 text-primary"
      )}
      style={{ width: size, height: size, minWidth: size, maxWidth: size, minHeight: size, maxHeight: size, borderRadius: "50%", backgroundImage: src ? `url("${src}")` : undefined }}
    >
      {src ? null : name.charAt(0)}
    </span>
  );
}

export function DetailItem({ label, value, muted = false }: {
  label: string;
  value?: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className={cn("rounded-md p-3", muted ? "bg-muted" : "border border-border")}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-semibold">{value || "-"}</p>
    </div>
  );
}

export type ActionMenuItem = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
};

export function KebabActionMenu({ open, onToggle, ariaLabel, items, openAbove = false }: {
  open: boolean;
  onToggle: () => void;
  ariaLabel: string;
  items: ActionMenuItem[];
  openAbove?: boolean;
}) {
  return (
    <>
      <Button variant="ghost" className="h-9 w-9 shrink-0 px-0" onClick={onToggle} aria-label={ariaLabel} aria-expanded={open}>
        <MoreVertical className="h-4 w-4" />
      </Button>
      {open ? (
        <div className={cn(
          "absolute right-3 z-30 w-36 rounded-md border border-border bg-white p-1 shadow-xl",
          openAbove ? "bottom-[calc(100%-0.5rem)]" : "top-[calc(100%-0.5rem)]"
        )}>
          {items.map(({ icon: Icon, label, onClick, disabled, danger }) => (
            <button
              key={label}
              type="button"
              disabled={disabled}
              onClick={onClick}
              className={cn(
                "flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
                danger && "text-danger"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
