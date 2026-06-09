import { Download, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ReportPreview({
  title,
  items
}: {
  title: string;
  items: { label: string; value: string }[];
}) {
  return (
    <section className="dashboard-surface p-5">
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">Ready for export and sharing</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
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
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-md bg-muted/60 p-4">
            <dt className="text-sm text-muted-foreground">{item.label}</dt>
            <dd className="mt-1 text-base font-semibold">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
