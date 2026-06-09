import { FileText, Plus, Upload } from "lucide-react";
import { ChartCard } from "@/components/charts/ChartCard";
import { UploadCard } from "@/components/forms/UploadCard";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ReportPreview } from "@/components/modules/shared-core/ReportPreview";
import { hourlySales, leadTrend, profitReports, salesTrend, sourceSplit } from "@/lib/mock-data";

export function ReportsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {["Daily report", "Weekly report", "Monthly report"].map((title) => (
        <article key={title} className="dashboard-surface p-5">
          <FileText className="h-6 w-6 text-primary" />
          <h3 className="mt-4 font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Filter, preview, download, and share from one shell.</p>
          <Button variant="secondary" className="mt-4">Open report</Button>
        </article>
      ))}
    </div>
  );
}

export function AiReplyConfigurator() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="dashboard-surface space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Auto-reply rules</h3>
            <p className="text-sm text-muted-foreground">Keep standard responses quick and consistent.</p>
          </div>
          <StatusBadge tone="success">Active</StatusBadge>
        </div>
        {["Ask guest count", "Share package range", "Request event date", "Escalate price negotiation"].map((rule) => (
          <div key={rule} className="flex items-center justify-between rounded-md border border-border p-3">
            <span className="text-sm font-medium">{rule}</span>
            <input type="checkbox" defaultChecked className="h-5 w-5 accent-teal-700" />
          </div>
        ))}
      </section>
      <section className="dashboard-surface space-y-3 p-5">
        <h3 className="font-semibold">Test reply</h3>
        <Textarea placeholder="Customer asks: Do you cater for 60 people?" />
        <Button>Generate response</Button>
        <div className="rounded-md bg-muted p-3 text-sm">
          Yes, we can support 60 guests. Please share event date, menu preference, and budget range.
        </div>
      </section>
    </div>
  );
}

export function SalesReviewPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="dashboard-surface space-y-4 p-5">
        <h3 className="font-semibold">Prompt test</h3>
        <Textarea placeholder="Paste a customer enquiry for AI sales review" />
        <Button>Review response</Button>
      </section>
      <section className="dashboard-surface space-y-4 p-5">
        <h3 className="font-semibold">AI response preview</h3>
        <p className="rounded-md bg-muted p-4 text-sm">
          Recommended reply: confirm event size, ask for date, and send the Gold Buffet package first.
        </p>
        <div className="flex gap-2">
          <Button>Approve</Button>
          <Button variant="secondary">Reject</Button>
        </div>
      </section>
    </div>
  );
}

export function ProfitInsights() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard title="Sales trend" data={salesTrend} />
      <ChartCard title="Hourly sales" data={hourlySales} type="bar" />
    </div>
  );
}

export function LeadAnalytics() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard title="Lead trend" data={leadTrend} />
      <ChartCard title="Lead sources" data={sourceSplit} type="pie" />
    </div>
  );
}

export function ProfitReportPreview() {
  const report = profitReports[0];
  return (
    <ReportPreview
      title={`${report.period} Profit Report`}
      items={[
        { label: "Sales Summary", value: report.salesSummary },
        { label: "Best/Worst Items", value: report.bestWorstItems },
        { label: "Food Cost", value: report.foodCostSummary },
        { label: "Wastage", value: report.wastageSummary },
        { label: "Peak Hour", value: report.peakHourSummary },
        { label: "Owner Actions", value: report.ownerActionPoints }
      ]}
    />
  );
}

export function UploadHistory() {
  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <UploadCard title="Upload sales CSV" description="Validate bill rows, items, order sources, and time data." />
      <section className="dashboard-surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Upload history</h3>
          <Button variant="secondary"><Upload className="h-4 w-4" /> Import</Button>
        </div>
        <div className="mt-4 space-y-3">
          {["June week 1 sales.csv", "May monthly sales.csv", "Weekend delivery export.csv"].map((file) => (
            <div key={file} className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
              <span>{file}</span>
              <StatusBadge tone="success">Validated</StatusBadge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function CostForm() {
  return (
    <section className="dashboard-surface space-y-4 p-5">
      <div className="flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Add cost item</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <input className="focus-ring rounded-md border border-input px-3 py-2 text-sm" placeholder="Item name" />
        <input className="focus-ring rounded-md border border-input px-3 py-2 text-sm" placeholder="Selling price" />
        <input className="focus-ring rounded-md border border-input px-3 py-2 text-sm" placeholder="Food cost" />
        <Button>Add item</Button>
      </div>
    </section>
  );
}
