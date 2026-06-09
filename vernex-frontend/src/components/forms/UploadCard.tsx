import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function UploadCard({
  title = "Upload file",
  description = "Drop a CSV file here or browse from your computer."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="dashboard-surface flex flex-col items-center justify-center gap-3 border-dashed p-6 text-center">
      <div className="rounded-md bg-primary/10 p-3 text-primary">
        <Upload className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      <Button variant="secondary">Browse file</Button>
    </div>
  );
}
