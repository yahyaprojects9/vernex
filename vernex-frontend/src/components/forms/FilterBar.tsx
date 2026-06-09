import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

export function FilterBar({
  searchPlaceholder = "Search",
  filters = [],
  actionLabel
}: {
  searchPlaceholder?: string;
  filters?: { label: string; options: string[] }[];
  actionLabel?: string;
}) {
  return (
    <div className="dashboard-surface flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
      <label className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder={searchPlaceholder} />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        {filters.map((filter) => (
          <Select key={filter.label} aria-label={filter.label}>
            <option>{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </Select>
        ))}
        {actionLabel ? <Button>{actionLabel}</Button> : null}
      </div>
    </div>
  );
}
