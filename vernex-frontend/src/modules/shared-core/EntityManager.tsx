"use client";

import { useMemo, useState } from "react";
import { Download, Edit, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";

export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  options?: string[];
};

export function EntityManager<T extends { id: string; status?: string }>({
  title,
  description,
  records,
  fields,
  onCreate,
  onUpdate,
  onDelete,
  onExport,
  filterKey = "status"
}: {
  title: string;
  description: string;
  records: T[];
  fields: FieldConfig[];
  onCreate: (record: T) => void;
  onUpdate: (id: string, patch: Partial<T>) => void;
  onDelete: (id: string) => void;
  onExport?: () => void;
  filterKey?: keyof T | string;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState<T | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);

  const filterValues = useMemo(() => {
    const values = records.map((record) => String((record as Record<string, unknown>)[String(filterKey)] ?? "")).filter(Boolean);
    return ["All", ...Array.from(new Set(values))];
  }, [records, filterKey]);

  const visible = useMemo(() => {
    return records
      .filter((record) => {
        const text = JSON.stringify(record).toLowerCase();
        const matchesQuery = text.includes(query.toLowerCase());
        const value = String((record as Record<string, unknown>)[String(filterKey)] ?? "");
        const matchesFilter = filter === "All" || value === filter;
        return matchesQuery && matchesFilter;
      })
      .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  }, [records, query, filter, filterKey]);

  function startCreate() {
    setEditing(null);
    setDraft(Object.fromEntries(fields.map((field) => [field.key, field.options?.[0] ?? ""])));
  }

  function startEdit(record: T) {
    setEditing(record);
    setDraft(Object.fromEntries(fields.map((field) => [field.key, String((record as Record<string, unknown>)[field.key] ?? "")])));
  }

  function save() {
    const payload = { ...draft };
    if (editing) {
      onUpdate(editing.id, payload as Partial<T>);
    } else {
      onCreate({ id: `${title.slice(0, 3).toUpperCase()}-${Date.now()}`, ...payload } as T);
    }
    setDraft({});
    setEditing(null);
  }

  function exportRows() {
    const rows = selected.length ? records.filter((record) => selected.includes(record.id)) : visible;
    const csv = [fields.map((field) => field.label).join(","), ...rows.map((row) => fields.map((field) => JSON.stringify((row as Record<string, unknown>)[field.key] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.toLowerCase().replaceAll(" ", "-")}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    onExport?.();
  }

  return (
    <section className="space-y-4">
      <div className="dashboard-surface flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
          <Button variant="secondary" onClick={exportRows}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          {selected.length ? (
            <Button
              variant="danger"
              onClick={() => {
                selected.forEach(onDelete);
                setSelected([]);
              }}
            >
              Delete selected
            </Button>
          ) : null}
        </div>
      </div>

      <div className="dashboard-surface flex flex-col gap-3 p-4 md:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder={`Search ${title.toLowerCase()}`} />
        </label>
        <Select value={filter} onChange={(event) => setFilter(event.target.value)} className="md:max-w-56">
          {filterValues.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </Select>
      </div>

      {Object.keys(draft).length ? (
        <div className="dashboard-surface grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <label key={field.key} className="space-y-1">
              <span className="text-sm font-medium">{field.label}</span>
              {field.type === "textarea" ? (
                <Textarea value={draft[field.key] ?? ""} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} />
              ) : field.type === "select" ? (
                <Select value={draft[field.key] ?? ""} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}>
                  {(field.options ?? []).map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </Select>
              ) : (
                <Input type={field.type ?? "text"} value={draft[field.key] ?? ""} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} />
              )}
            </label>
          ))}
          <div className="flex items-end gap-2">
            <Button onClick={save}>{editing ? "Update" : "Create"}</Button>
            <Button variant="secondary" onClick={() => setDraft({})}>Cancel</Button>
          </div>
        </div>
      ) : null}

      <div className="dashboard-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={visible.length > 0 && selected.length === visible.length}
                    onChange={(event) => setSelected(event.target.checked ? visible.map((row) => row.id) : [])}
                  />
                </th>
                {fields.slice(0, 6).map((field) => (
                  <th key={field.key} className="px-4 py-3">{field.label}</th>
                ))}
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((record) => (
                <tr key={record.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(record.id)}
                      onChange={(event) => setSelected(event.target.checked ? [...selected, record.id] : selected.filter((id) => id !== record.id))}
                    />
                  </td>
                  {fields.slice(0, 6).map((field) => {
                    const value = String((record as Record<string, unknown>)[field.key] ?? "");
                    return (
                      <td key={field.key} className="px-4 py-3">
                        {field.key.toLowerCase().includes("status") ? <StatusBadge tone={value === "Active" || value === "Converted" || value === "Imported" ? "success" : "neutral"}>{value}</StatusBadge> : value}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="secondary" className="h-9 w-9 px-0" onClick={() => startEdit(record)} aria-label="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="danger" className="h-9 w-9 px-0" onClick={() => onDelete(record.id)} aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
