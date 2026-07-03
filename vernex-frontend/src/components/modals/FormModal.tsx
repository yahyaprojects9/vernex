"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function FormModal({
  title,
  description,
  children,
  open = false,
  className,
  onClose
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  open?: boolean;
  className?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden overscroll-none bg-slate-950/45 p-3 backdrop-blur-[1px] sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section onMouseDown={(event) => event.stopPropagation()} className={cn("dashboard-surface flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden border-slate-300 bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)]", className)}>
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          <Button variant="ghost" className="h-9 w-9 px-0" aria-label="Close modal" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5">{children}</div>
      </section>
    </div>
  );
}
