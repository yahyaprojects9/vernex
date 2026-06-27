"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Download, Edit, Eye, Plus, Search, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/StateViews";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { FormModal } from "@/components/modals/FormModal";
import { AuthService } from "@/lib/services";

export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select" | "multiselect" | "image";
  options?: string[];
  optionLabels?: Record<string, string>;
  hideOnCreate?: boolean;
  hideInTable?: boolean;
  hideInView?: boolean;
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
  permissions,
  allowDelete = true,
  allowSelection = true,
  validate
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
  allowDelete?: boolean;
  allowSelection?: boolean;
  validate?: (payload: Record<string, unknown>, editing: boolean) => string | null;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState<T | null>(null);
  const [viewing, setViewing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [validationError, setValidationError] = useState("");
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
    setValidationError("");
    setEditing(null);
    setDraft(Object.fromEntries(fields.map((field) => [field.key, field.defaultOnCreate ?? field.options?.[0] ?? ""])));
  }

  function startEdit(record: T) {
    setValidationError("");
    setEditing(record);
    setDraft(Object.fromEntries(fields.map((field) => {
      const value = (record as Record<string, unknown>)[field.key];
      return [field.key, Array.isArray(value) ? value.join(",") : String(value ?? "")];
    })));
  }

  function closeForm() {
    setDraft({});
    setEditing(null);
    setValidationError("");
  }

  function save() {
    const payload = Object.fromEntries(fields.map((field) => [
      field.key,
      field.type === "multiselect"
        ? (draft[field.key] ?? "").split(",").filter(Boolean)
        : draft[field.key] ?? field.defaultOnCreate ?? ""
    ]));
    const error = validate?.(payload, Boolean(editing));
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError("");
    if (editing) {
      onUpdate(editing.id, payload as Partial<T>);
    } else {
      onCreate({ id: `${title.slice(0, 3).toUpperCase()}-${Date.now()}`, ...payload } as T);
    }
    closeForm();
  }

  async function exportRows(templateOnly = false) {
    const { default: writeXlsxFile } = await import("write-excel-file/browser");
    const rows = selected.length ? records.filter((record) => selected.includes(record.id)) : visible;
    const header = fields.map((field) => ({ value: field.label, fontWeight: "bold" as const }));
    const data = templateOnly
      ? [header]
      : [
          header,
          ...rows.map((row) => fields.map((field) => ({ value: String((row as Record<string, unknown>)[field.key] ?? "") })))
        ];
    await writeXlsxFile(data, { sheet: title.slice(0, 31) }).toFile(
      `${title.toLowerCase().replaceAll(" ", "-")}${templateOnly ? "-template" : ""}.xlsx`
    );
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

  async function importExcel(file: File) {
    const { readSheet } = await import("read-excel-file/browser");
    const sheet = await readSheet(file);
    if (!sheet.length) return;
    const normalizedHeaders = sheet[0].map((value) => String(value ?? "").trim().toLowerCase());
    const hasHeader = fields.some((field) => normalizedHeaders.includes(field.label.toLowerCase()));
    const rows = hasHeader ? sheet.slice(1) : sheet;
    rows.filter((row) => row.some((value) => value !== null && value !== "")).forEach((row, index) => {
      const payload = Object.fromEntries(fields.map((field, fieldIndex) => {
        const sourceIndex = hasHeader ? normalizedHeaders.indexOf(field.label.toLowerCase()) : fieldIndex;
        const value = sourceIndex >= 0 ? row[sourceIndex] : field.defaultOnCreate ?? "";
        return [field.key, field.type === "multiselect" ? String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean) : String(value ?? field.defaultOnCreate ?? "")];
      }));
      onCreate({ id: `${title.slice(0, 3).toUpperCase()}-${Date.now()}-${index}`, ...payload } as T);
    });
    setImportOpen(false);
  }

  return (
    <section className="space-y-4">
      <div className="dashboard-surface flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1">
          {canCreate ? <Button className="shrink-0" onClick={startCreate}>
            <Plus className="h-4 w-4" />
            Add
          </Button> : null}
          {canImport ? <Button className="shrink-0" variant="secondary" type="button" onClick={() => setImportOpen((value) => !value)}>
            <Upload className="h-4 w-4" />
            Import
          </Button> : null}
          {canExport ? <Button variant="secondary" className="shrink-0" onClick={() => exportRows(false)}>
            <Download className="h-4 w-4" />
            Export
          </Button> : null}
          {canExport ? <Button variant="secondary" className="shrink-0" onClick={() => exportRows(true)}>Template</Button> : null}
          {allowSelection && allowDelete && canDelete && selected.length ? (
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

      <FormModal open={importOpen} title={`Import ${title}`} description="Upload an Excel file or paste comma-separated rows." onClose={() => setImportOpen(false)} className="max-w-3xl">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Paste CSV rows in this field order: {fields.filter((field) => !field.hideOnCreate).map((field) => field.label).join(", ")}</p>
          </div>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Excel file</span>
            <Input type="file" accept=".xlsx,.xls" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importExcel(file);
            }} />
          </label>
          <Textarea value={importText} onChange={(event) => setImportText(event.target.value)} placeholder="One CSV row per line" />
          <div className="flex justify-end gap-2">
            <Button onClick={importRows} disabled={!importText.trim()}>Import Rows</Button>
            <Button variant="secondary" onClick={() => setImportOpen(false)}>Cancel</Button>
          </div>
        </div>
      </FormModal>

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

      <FormModal open={Object.keys(draft).length > 0} title={editing ? `Edit ${title.replace(" Management", "")}` : `Add ${title.replace(" Management", "")}`} onClose={closeForm} className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {validationError ? <p className="rounded-md bg-danger/10 p-3 text-sm font-medium text-danger md:col-span-2 xl:col-span-3">{validationError}</p> : null}
          {fields.filter((field) => editing || !field.hideOnCreate).map((field) => (
            <label key={field.key} className="space-y-1">
              <span className="text-sm font-medium">{field.label}</span>
              {field.type === "textarea" ? (
                <Textarea value={draft[field.key] ?? ""} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} />
              ) : field.type === "select" ? (
                <Select value={draft[field.key] ?? ""} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}>
                  {(field.options ?? []).map((option) => (
                    <option key={option} value={option}>{field.optionLabels?.[option] ?? option}</option>
                  ))}
                </Select>
              ) : field.type === "multiselect" ? (
                <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-input p-2">
                  {(field.options ?? []).map((option) => {
                    const selectedValues = (draft[field.key] ?? "").split(",").filter(Boolean);
                    return <label key={option} className="flex items-center gap-2 rounded p-1 text-sm hover:bg-muted">
                      <input type="checkbox" checked={selectedValues.includes(option)} onChange={(event) => {
                        const next = event.target.checked ? [...selectedValues, option] : selectedValues.filter((value) => value !== option);
                        setDraft({ ...draft, [field.key]: next.join(",") });
                      }} />
                      {field.optionLabels?.[option] ?? option}
                    </label>;
                  })}
                </div>
              ) : field.type === "image" ? (
                <div className="flex min-h-20 items-center gap-3 rounded-md border border-dashed border-input p-3">
                  {draft[field.key] ? <span role="img" aria-label="Profile preview" className="h-12 w-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${draft[field.key]}")` }} /> : <span className="h-12 w-12 rounded-full bg-muted" />}
                  <Input type="file" accept="image/*" onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setDraft({ ...draft, [field.key]: String(reader.result) });
                    reader.readAsDataURL(file);
                  }} />
                </div>
              ) : (
                <Input type={field.type ?? "text"} value={draft[field.key] ?? ""} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} />
              )}
            </label>
          ))}
          <div className="flex items-end justify-end gap-2 md:col-span-2 xl:col-span-3">
            <Button onClick={save} disabled={editing ? !canEdit : !canCreate}>{editing ? "Update" : "Create"}</Button>
            <Button variant="secondary" onClick={closeForm}>Cancel</Button>
          </div>
        </div>
      </FormModal>

      <FormModal open={Boolean(viewing)} title={`${title.replace(" Management", "")} Details`} onClose={() => setViewing(null)} className="max-h-[90vh] max-w-3xl overflow-y-auto">
        {viewing ? <dl className="grid gap-3 sm:grid-cols-2">
          {fields.filter((field) => !field.hideInView).map((field) => {
            const value = String((viewing as Record<string, unknown>)[field.key] ?? "");
            return <div key={field.key} className="rounded-md border border-border p-3">
              <dt className="text-xs font-medium text-muted-foreground">{field.label}</dt>
              <dd className="mt-1 break-words text-sm font-semibold">{field.renderValue ? field.renderValue(value, viewing as Record<string, unknown>) : value || "-"}</dd>
            </div>;
          })}
        </dl> : null}
      </FormModal>

      <ConfirmModal open={Boolean(deleting)} title={`Delete ${title.replace(" Management", "")}`} description={`Delete ${deleting?.id ?? "this record"}? This action cannot be undone.`} confirmLabel="Delete" onCancel={() => setDeleting(null)} onConfirm={() => {
        if (deleting) onDelete(deleting.id);
        setDeleting(null);
      }} />

      {visible.length ? (
      <div className="dashboard-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                {allowSelection ? <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={visible.length > 0 && selected.length === visible.length}
                    onChange={(event) => setSelected(event.target.checked ? visible.map((row) => row.id) : [])}
                  />
                </th> : null}
                {tableFields.map((field) => (
                  <th key={field.key} className={`whitespace-nowrap px-4 py-3 align-top ${field.tableClassName ?? ""}`}>{field.label}</th>
                ))}
                <th className="w-40 whitespace-nowrap px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((record) => (
                <tr key={record.id} className="hover:bg-muted/40">
                  {allowSelection ? <td className="px-4 py-4 align-top">
                    <input
                      type="checkbox"
                      checked={selected.includes(record.id)}
                      onChange={(event) => setSelected(event.target.checked ? [...selected, record.id] : selected.filter((id) => id !== record.id))}
                    />
                  </td> : null}
                  {tableFields.map((field) => {
                    const value = String((record as Record<string, unknown>)[field.key] ?? "");
                    return (
                      <td key={field.key} className={`whitespace-nowrap px-4 py-4 align-top leading-6 ${field.tableClassName ?? ""}`}>
                        {field.key.toLowerCase().includes("status") ? (
                          <StatusBadge tone={value === "Active" || value === "Converted" || value === "Imported" ? "success" : "neutral"}>{value}</StatusBadge>
                        ) : (
                          <span className="block min-w-0 max-w-64 truncate">
                            {field.renderValue ? field.renderValue(value, record as Record<string, unknown>) : value}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-nowrap gap-2">
                      <Button variant="secondary" className="h-9 w-9 shrink-0 px-0" onClick={() => setViewing(record)} aria-label="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" className="h-9 w-9 px-0" onClick={() => startEdit(record)} aria-label="Edit" disabled={!canEdit}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {allowDelete ? <Button variant="danger" className="h-9 w-9 shrink-0 px-0" onClick={() => setDeleting(record)} aria-label="Delete" disabled={!canDelete}>
                        <Trash2 className="h-4 w-4" />
                      </Button> : null}
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
