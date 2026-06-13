"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Download, Edit, Plus, Search, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/StateViews";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AuthService } from "@/lib/services";

export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  options?: string[];
  hideOnCreate?: boolean;
  hideInTable?: boolean;
  defaultOnCreate?: string;
  tableClassName?: string;
  renderValue?: (value: string, record: Record<string, unknown>) => ReactNode;
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
  filterKey = "status",
  permissions
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
  permissions?: {
    module: string;
    create?: string;
    edit?: string;
    delete?: string;
    import?: string;
    export?: string;
  };
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState<T | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const canCreate = permissions?.create ? AuthService.canModify(permissions.module, permissions.create) : AuthService.canModify();
  const canEdit = permissions?.edit ? AuthService.canModify(permissions.module, permissions.edit) : AuthService.canModify();
  const canDelete = permissions?.delete ? AuthService.canModify(permissions.module, permissions.delete) : AuthService.canModify();
  const canImport = permissions?.import ? AuthService.canModify(permissions.module, permissions.import) : canCreate;
  const canExport = permissions?.export ? AuthService.hasPermission(permissions.module, permissions.export) : true;

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
  const tableFields = useMemo(() => fields.filter((field) => !field.hideInTable).slice(0, 6), [fields]);

  function startCreate() {
    setEditing(null);
    setDraft(Object.fromEntries(fields.map((field) => [field.key, field.defaultOnCreate ?? field.options?.[0] ?? ""])));
  }

  function startEdit(record: T) {
    setEditing(record);
    setDraft(Object.fromEntries(fields.map((field) => [field.key, String((record as Record<string, unknown>)[field.key] ?? "")])));
  }

  function save() {
    const payload = Object.fromEntries(fields.map((field) => [field.key, draft[field.key] ?? field.defaultOnCreate ?? ""]));
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

  function importRows() {
    const rows = importText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const values = line.split(",").map((value) => value.trim());
        return {
          id: `${title.slice(0, 3).toUpperCase()}-${Date.now()}-${index}`,
          ...Object.fromEntries(fields.map((field, fieldIndex) => [field.key, values[fieldIndex] ?? field.defaultOnCreate ?? ""]))
        } as T;
      });
    rows.forEach(onCreate);
    setImportText("");
    setImportOpen(false);
  }

  return (
    <section className="space-y-4">
      <div className="dashboard-surface flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canCreate ? <Button onClick={startCreate}>
            <Plus className="h-4 w-4" />
            Add
          </Button> : null}
          {canImport ? <Button variant="secondary" type="button" onClick={() => setImportOpen((value) => !value)}>
            <Upload className="h-4 w-4" />
            Import
          </Button> : null}
          {canExport ? <Button variant="secondary" onClick={exportRows}>
            <Download className="h-4 w-4" />
            Export
          </Button> : null}
          {canDelete && selected.length ? (
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

      {importOpen ? (
        <div className="dashboard-surface space-y-3 p-4">
          <div>
            <h3 className="font-semibold">Import {title}</h3>
            <p className="text-sm text-muted-foreground">Paste CSV rows in this field order: {fields.filter((field) => !field.hideOnCreate).map((field) => field.label).join(", ")}</p>
          </div>
          <Textarea value={importText} onChange={(event) => setImportText(event.target.value)} placeholder="One CSV row per line" />
          <div className="flex justify-center gap-2">
            <Button onClick={importRows} disabled={!importText.trim()}>Import Rows</Button>
            <Button variant="secondary" onClick={() => setImportOpen(false)}>Cancel</Button>
          </div>
        </div>
      ) : null}

      <div className="dashboard-surface grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_14rem]">
        <label className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-12 pl-9 text-base" placeholder={`Search ${title.toLowerCase()}`} />
        </label>
        <Select value={filter} onChange={(event) => setFilter(event.target.value)} className="min-h-12">
          {filterValues.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </Select>
      </div>

      {Object.keys(draft).length ? (
        <div className="dashboard-surface grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
          {fields.filter((field) => editing || !field.hideOnCreate).map((field) => (
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
          <div className="flex items-end justify-center gap-2 md:col-span-2 xl:col-span-3">
            <Button onClick={save} disabled={editing ? !canEdit : !canCreate}>{editing ? "Update" : "Create"}</Button>
            <Button variant="secondary" onClick={() => setDraft({})}>Cancel</Button>
          </div>
        </div>
      ) : null}

      {visible.length ? (
      <div className="dashboard-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={visible.length > 0 && selected.length === visible.length}
                    onChange={(event) => setSelected(event.target.checked ? visible.map((row) => row.id) : [])}
                  />
                </th>
                {tableFields.map((field) => (
                  <th key={field.key} className={`px-4 py-3 align-top ${field.tableClassName ?? ""}`}>{field.label}</th>
                ))}
                <th className="w-36 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((record) => (
                <tr key={record.id} className="hover:bg-muted/40">
                  <td className="px-4 py-4 align-top">
                    <input
                      type="checkbox"
                      checked={selected.includes(record.id)}
                      onChange={(event) => setSelected(event.target.checked ? [...selected, record.id] : selected.filter((id) => id !== record.id))}
                    />
                  </td>
                  {tableFields.map((field) => {
                    const value = String((record as Record<string, unknown>)[field.key] ?? "");
                    return (
                      <td key={field.key} className={`px-4 py-4 align-top leading-6 ${field.tableClassName ?? ""}`}>
                        {field.key.toLowerCase().includes("status") ? (
                          <StatusBadge tone={value === "Active" || value === "Converted" || value === "Imported" ? "success" : "neutral"}>{value}</StatusBadge>
                        ) : (
                          <span className="block min-w-0 whitespace-normal break-words">
                            {field.renderValue ? field.renderValue(value, record as Record<string, unknown>) : value}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-4 align-top">
                    <div className="flex gap-2">
                      <Button variant="secondary" className="h-9 w-9 px-0" onClick={() => startEdit(record)} aria-label="Edit" disabled={!canEdit}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="danger" className="h-9 w-9 px-0" onClick={() => onDelete(record.id)} aria-label="Delete" disabled={!canDelete}>
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
      ) : (
        <EmptyState title={`No ${title.toLowerCase()} records yet`} description="Use Add to create your first record." />
      )}
    </section>
  );
}
