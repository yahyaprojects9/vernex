"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, FileJson, FileSpreadsheet, Keyboard, Plug, Upload } from "lucide-react";
import { ChartCard } from "@/components/charts/ChartCard";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/StateViews";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AuthService, ImportService, SalesAnalyticsService } from "@/lib/services";
import { formatCurrency } from "@/lib/utils";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import type { SalesRecord } from "@/types";

const sourceTypes = [
  "CSV",
  "Excel",
  "JSON",
  "Manual Entry",
  "API Import",
  "POS Import",
  "Tally Import",
  "Billing Export",
  "ERP Import",
  "Google Sheets Import"
];

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
  const [tab, setTab] = useState("Data Sources");
  const [source, setSource] = useState("CSV");
  const [manual, setManual] = useState("");
  const [previewRows, setPreviewRows] = useState<Partial<SalesRecord>[]>([]);

  const validationErrors = useMemo(() => validateRows(previewRows), [previewRows]);
  const trend = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, index) => ({
      name: day,
      value: store.salesRecords.filter((_, rowIndex) => rowIndex % 7 === index).reduce((sum, row) => sum + row.totalAmount, 0)
    }));
  }, [store.salesRecords]);

  function parseManual() {
    const rows = manual
      .split("\n")
      .filter(Boolean)
      .map((line, index) => {
        const [date, billNumber, itemName, category, quantity, sellingPrice, totalAmount, orderSource, time] = line.split(",");
        return {
          id: `SAL-IMPORT-${Date.now()}-${index}`,
          date,
          billNumber,
          itemName,
          category,
          quantity: Number(quantity),
          sellingPrice: Number(sellingPrice),
          totalAmount: Number(totalAmount),
          orderSource: (orderSource || "Dine-in") as SalesRecord["orderSource"],
          time
        };
      });
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
      sourceType: source,
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
        {["Data Sources", "Imports", "Validation", "History", "Analytics"].map((item) => (
          <Button key={item} variant={tab === item ? "primary" : "secondary"} onClick={() => setTab(item)}>
            {item}
          </Button>
        ))}
      </div>

      {tab === "Data Sources" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {sourceTypes.map((item) => (
            <button
              key={item}
              onClick={() => setSource(item)}
              className={`dashboard-surface p-4 text-left transition ${source === item ? "ring-2 ring-primary" : ""}`}
            >
              {item.includes("Excel") ? <FileSpreadsheet className="h-5 w-5 text-primary" /> : item.includes("JSON") ? <FileJson className="h-5 w-5 text-primary" /> : item.includes("Manual") ? <Keyboard className="h-5 w-5 text-primary" /> : item.includes("Import") ? <Plug className="h-5 w-5 text-primary" /> : <Upload className="h-5 w-5 text-primary" />}
              <h3 className="mt-3 font-semibold">{item}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Choose source and continue to preview mapping.</p>
            </button>
          ))}
        </div>
      ) : null}

      {tab === "Imports" ? (
        <div className="dashboard-surface space-y-4 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium">Source Type</span>
              <Select value={source} onChange={(event) => setSource(event.target.value)}>
                {sourceTypes.map((item) => <option key={item}>{item}</option>)}
              </Select>
            </label>
            {source === "CSV" || source === "Excel" || source === "JSON" ? <label className="space-y-1">
              <span className="text-sm font-medium">Upload File</span>
              <Input type="file" accept={source === "CSV" ? ".csv" : source === "Excel" ? ".xlsx,.xls" : ".json"} />
            </label> : null}
          </div>
          {source === "Manual Entry" ? <label className="space-y-1">
            <span className="text-sm font-medium">Manual CSV Rows</span>
            <Textarea value={manual} onChange={(event) => setManual(event.target.value)} placeholder="YYYY-MM-DD,BILL-001,Item Name,Category,Quantity,Selling Price,Total Amount,Order Source,HH:MM" />
          </label> : null}
          {source.includes("Import") || source === "Billing Export" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Connector name" />
              <Input placeholder="Endpoint, sheet URL, or account ID" />
              <Textarea className="md:col-span-2" placeholder="Mapping, credentials notes, sync schedule, and validation rules" />
            </div>
          ) : null}
          <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
            Column Mapping: Date, Bill Number, Item Name, Category, Quantity, Selling Price, Total Amount, Order Source, Time
          </div>
          <Button onClick={parseManual} disabled={source !== "Manual Entry" || !canImport}>Preview Data</Button>
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
                  )) : (
                    <tr>
                      <td className="p-4 text-sm text-muted-foreground">Preview rows will appear after you enter CSV data.</td>
                    </tr>
                  )}
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
