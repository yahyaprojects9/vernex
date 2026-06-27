"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, Upload } from "lucide-react";
import { ChartCard } from "@/components/charts/ChartCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/StateViews";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AuthService, ImportService, SalesAnalyticsService } from "@/lib/services";
import { formatCurrency } from "@/lib/utils";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import type { SalesRecord } from "@/types";

const templateHeaders = ["Date", "Bill Number", "Item Name", "Category", "Quantity", "Selling Price", "Total Amount", "Order Source", "Time"];

function validateRows(rows: Partial<SalesRecord>[]) {
  const errors: string[] = [];
  const bills = new Set<string>();
  rows.forEach((row, index) => {
    if (!row.date) errors.push(`Row ${index + 1}: Missing date`);
    if (!row.billNumber) errors.push(`Row ${index + 1}: Missing bill number`);
    if (row.billNumber && bills.has(row.billNumber)) errors.push(`Row ${index + 1}: Duplicate bill number`);
    if (row.billNumber) bills.add(row.billNumber);
    if (!row.itemName) errors.push(`Row ${index + 1}: Missing item name`);
    if (!row.category) errors.push(`Row ${index + 1}: Missing category`);
    if (!row.totalAmount || Number(row.totalAmount) <= 0) errors.push(`Row ${index + 1}: Missing revenue value`);
    if (!row.sellingPrice || Number(row.sellingPrice) <= 0) errors.push(`Row ${index + 1}: Invalid currency value`);
  });
  return errors;
}

export function SalesAnalyticsIngestion() {
  const store = useLocalStore();
  const canImport = AuthService.canModify("Profit Analysis", "Import Data");
  const [tab, setTab] = useState("Imports");
  const [previewRows, setPreviewRows] = useState<Partial<SalesRecord>[]>([]);

  const validationErrors = useMemo(() => validateRows(previewRows), [previewRows]);
  const trend = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, index) => ({
      name: day,
      value: store.salesRecords.filter((_, rowIndex) => rowIndex % 7 === index).reduce((sum, row) => sum + row.totalAmount, 0)
    }));
  }, [store.salesRecords]);

  async function downloadTemplate() {
    const { default: writeXlsxFile } = await import("write-excel-file/browser");
    await writeXlsxFile([templateHeaders.map((value) => ({ value, fontWeight: "bold" as const }))]).toFile("sales-analytics-template.xlsx");
  }

  async function readExcel(file: File) {
    const { readSheet } = await import("read-excel-file/browser");
    const sheet = await readSheet(file);
    if (!sheet.length) return;
    const headers = sheet[0].map((value) => String(value ?? "").trim().toLowerCase());
    const at = (row: typeof sheet[number], heading: string) => row[headers.indexOf(heading.toLowerCase())];
    const rows = sheet.slice(1).filter((row) => row.some((value) => value !== null && value !== "")).map((row, index) => ({
      id: `SAL-IMPORT-${Date.now()}-${index}`,
      date: String(at(row, "Date") ?? ""),
      billNumber: String(at(row, "Bill Number") ?? ""),
      itemName: String(at(row, "Item Name") ?? ""),
      category: String(at(row, "Category") ?? ""),
      quantity: Number(at(row, "Quantity") ?? 0),
      sellingPrice: Number(at(row, "Selling Price") ?? 0),
      totalAmount: Number(at(row, "Total Amount") ?? 0),
      orderSource: String(at(row, "Order Source") ?? "Dine-in") as SalesRecord["orderSource"],
      time: String(at(row, "Time") ?? "")
    }));
    setPreviewRows(rows);
    setTab("Validation");
  }

  function importRows() {
    if (!previewRows.length || validationErrors.length) return;
    previewRows.forEach((row) => SalesAnalyticsService.create(row as SalesRecord));
    ImportService.create({
      id: `IMP-${Date.now()}`,
      importDate: new Date().toISOString().slice(0, 10),
      importedBy: AuthService.currentUser()?.name ?? "Current user",
      sourceType: "Excel Upload",
      rowsImported: previewRows.length,
      rowsFailed: 0,
      validationErrors: [],
      status: "Imported"
    });
    setPreviewRows([]);
    setTab("Analytics");
  }

  return (
    <div className="space-y-6">
      <div className="dashboard-surface flex flex-wrap gap-2 p-3">
        {["Imports", "Validation", "History", "Analytics"].map((item) => (
          <Button key={item} variant={tab === item ? "primary" : "secondary"} onClick={() => setTab(item)}>
            {item}
          </Button>
        ))}
      </div>

      {tab === "Imports" ? (
        <div className="dashboard-surface space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void downloadTemplate()}><Download className="h-4 w-4" />Template</Button>
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-medium">Import Excel file</span>
            <Input type="file" accept=".xlsx,.xls" disabled={!canImport} onChange={(event) => { const file = event.target.files?.[0]; if (file) void readExcel(file); }} />
          </label>
          <p className="flex items-center gap-2 text-sm text-muted-foreground"><Upload className="h-4 w-4" />Upload the completed template to preview and validate its rows.</p>
        </div>
      ) : null}

      {tab === "Validation" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="dashboard-surface p-5">
            <h3 className="font-semibold">Preview Data</h3>
            <div className="mt-4 max-h-80 overflow-auto rounded-md border border-border">
              <table className="w-full min-w-[700px] text-left text-sm">
                <tbody>
                  {previewRows.length ? previewRows.map((row) => (
                    <tr key={row.id} className="border-b border-border">
                      <td className="p-2">{row.date}</td>
                      <td className="p-2">{row.billNumber}</td>
                      <td className="p-2">{row.itemName}</td>
                      <td className="p-2">{row.category}</td>
                      <td className="p-2">{formatCurrency(Number(row.totalAmount ?? 0))}</td>
                    </tr>
                  )) : null}
                </tbody>
              </table>
            </div>
          </section>
          <section className="dashboard-surface p-5">
            <h3 className="font-semibold">Validation Engine</h3>
            <div className="mt-4 space-y-2">
              {!previewRows.length ? (
                <p className="rounded-md bg-muted p-2 text-sm text-muted-foreground">Enter rows to run validation.</p>
              ) : validationErrors.length ? (
                validationErrors.map((error) => (
                  <p key={error} className="flex items-center gap-2 rounded-md bg-danger/10 p-2 text-sm text-danger">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                  </p>
                ))
              ) : (
                <p className="flex items-center gap-2 rounded-md bg-success/10 p-2 text-sm text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  All records passed validation.
                </p>
              )}
            </div>
            <Button className="mt-4" disabled={!previewRows.length || Boolean(validationErrors.length) || !canImport} onClick={importRows}>
              Import and Generate Analytics
            </Button>
          </section>
        </div>
      ) : null}

      {tab === "History" ? (
        store.imports.length ? (
        <div className="dashboard-surface overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr><th className="p-3">Import ID</th><th>Import Date</th><th>Imported By</th><th>Source Type</th><th>Rows Imported</th><th>Rows Failed</th><th>Status</th></tr>
            </thead>
            <tbody>
              {store.imports.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="p-3">{item.id}</td><td>{item.importDate}</td><td>{item.importedBy}</td><td>{item.sourceType}</td><td>{item.rowsImported}</td><td>{item.rowsFailed}</td><td><StatusBadge tone={item.status === "Imported" ? "success" : "warning"}>{item.status}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : <EmptyState title="No import history yet" description="Imported sales records will appear here." />
      ) : null}

      {tab === "Analytics" ? <ChartCard title="Analytics generated from stored sales records" data={trend} type="bar" /> : null}
    </div>
  );
}
