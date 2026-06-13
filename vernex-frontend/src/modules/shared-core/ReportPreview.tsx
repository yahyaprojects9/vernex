"use client";

import { Download, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ReportPreview({
  title,
  items
}: {
  title: string;
  items: { label: string; value: string }[];
}) {
  function download() {
    const content = [title, ...items.map((item) => `${item.label}: ${item.value}`), `Generated at: ${new Date().toLocaleString()}`].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.toLowerCase().replaceAll(" ", "-")}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="dashboard-surface min-w-0 overflow-hidden p-4 sm:p-5">
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">Ready for export and sharing</p>
        </div>
        <div className="grid gap-2 min-[420px]:grid-cols-3 sm:flex sm:flex-wrap">
          <Button variant="secondary" onClick={download}>
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="secondary">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button variant="secondary">
            <Mail className="h-4 w-4" />
            Email
          </Button>
        </div>
      </div>
      <dl className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="min-w-0 rounded-md bg-muted/60 p-4">
            <dt className="text-sm text-muted-foreground">{item.label}</dt>
            <dd className="mt-1 break-words text-base font-semibold">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
