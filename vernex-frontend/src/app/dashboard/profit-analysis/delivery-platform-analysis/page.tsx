"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Download, Eye, EyeOff, KeyRound, Store, Upload } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AuthService, ImportService, SalesAnalyticsService } from "@/lib/services";
import { formatCurrency } from "@/lib/utils";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import type { SalesRecord } from "@/types";

const platformLogoPaths: Record<string, { color: string; path: string }> = {
  Swiggy: {
    color: "#FC8019",
    path: "M12.034 24c-.376-.411-2.075-2.584-3.95-5.513-.547-.916-.901-1.63-.833-1.814.178-.48 3.355-.743 4.333-.308.298.132.29.307.29.409 0 .44-.022 1.619-.022 1.619a.441.441 0 1 0 .883-.002l-.005-2.939c0-.255-.278-.319-.331-.329-.511-.002-1.548-.006-2.661-.006-2.457 0-3.006.101-3.423-.172-.904-.591-2.383-4.577-2.417-6.819C3.849 4.964 5.723 2.225 8.362.868A8.13 8.13 0 0 1 12.026 0c4.177 0 7.617 3.153 8.075 7.209l.001.011c.084.981-5.321 1.189-6.39.904-.164-.044-.206-.212-.206-.284L13.5 4.996a.442.442 0 0 0-.884.002l.009 3.866a.33.33 0 0 0 .268.32l3.354-.001c1.79 0 2.542.207 3.042.588.333.254.461.739.349 1.37C18.633 16.755 12.273 23.71 12.034 24z"
  },
  Zomato: {
    color: "#E23744",
    path: "M19.615 9.45l-1.258.473-.167.71-.446.021-.115.978h.408l-.211 1.51c-.131.939.036 1.381.865 1.381.488 0 .91-.175 1.135-.297l.145-.9c-.167.083-.436.19-.618.19-.247 0-.276-.13-.225-.488l.189-1.396h.843c.03-.206.131-.877.16-1h-.865zm-3.779 1.002c-.115.002-.236.01-.361.026a3.592 3.592 0 0 0-1.347.432l.26.789c.269-.15.615-.28.978-.326.538-.066.757.1.79.375.014.109.004.199-.005.289l-.014.056a3.46 3.46 0 0 0-1.097-.036c-.518.063-.943.273-1.204.6a1.324 1.324 0 0 0-.225 1.034c.127.583.553.84 1.199.76.45-.055.812-.27 1.076-.63a2.665 2.665 0 0 1-.03.304 1.74 1.74 0 0 1-.072.29l1.244.001a3.657 3.657 0 0 1-.001-.365c.036-.459.118-1.143.247-2.051a2.397 2.397 0 0 0-.002-.59c-.08-.644-.628-.969-1.436-.958zm6.536.063c-1.194 0-2.107 1.067-2.107 2.342 0 .959.552 1.693 1.628 1.693 1.2 0 2.107-1.067 2.107-2.35 0-.95-.538-1.685-1.628-1.685zm-16.657.049c-1.177 0-2.08 1.053-2.08 2.312 0 .946.546 1.67 1.608 1.67 1.185 0 2.08-1.052 2.08-2.319 0-.938-.531-1.663-1.607-1.663zm-5.126.091c-.05.39-.102.778-.175 1.13.328-.008.619-.016 1.411-.016l-1.81 1.96-.015.703c.444-.03.997-.039 1.63-.039.566 0 1.134.008 1.497.039.065-.458.13-.763.21-1.137-.275.015-.755.023-1.512.023l1.81-1.969.023-.694c-.437.023-.83.03-1.52.03-.749 0-.975-.007-1.549-.03zm4.988.927c.255 0 .408.228.408.701 0 .687-.276 1.251-.626 1.251-.261 0-.414-.236-.414-.702 0-.694.283-1.25.632-1.25zm16.629 0c.254 0 .407.228.407.701 0 .687-.276 1.251-.625 1.251-.262 0-.415-.236-.415-.702 0-.694.284-1.25.633-1.25z"
  },
  "Uber Eats": {
    color: "#06C167",
    path: "M0 2.865v4.997c0 1.883 1.332 3.13 3.084 3.13a2.965 2.965 0 0 0 2.15-.877v.743h1.211V2.865H5.223v4.933c0 1.265-.87 2.12-1.995 2.122-1.139-.002-1.997-.834-1.997-2.122V2.865zm7.363 0v7.993h1.163v-.732a2.991 2.991 0 0 0 2.117.876c1.714.048 3.13-1.328 3.13-3.043s-1.416-3.091-3.13-3.043a2.967 2.967 0 0 0-2.107.876V2.865zm9.885 2.056c-1.675-.008-3.037 1.349-3.035 3.024 0 1.737 1.373 3.037 3.153 3.037a3.123 3.123 0 0 0 2.558-1.243l-.85-.618a2.05 2.05 0 0 1-1.708.858c-.976.013-1.815-.691-1.971-1.655h4.818v-.379c0-1.734-1.254-3.024-2.964-3.024zm-7.04 1.016c1.122-.009 2.036.899 2.036 2.021-.002 1.12-.914 2.026-2.034 2.021A2.015 2.015 0 0 1 8.21 7.96a2.015 2.015 0 0 1 1.998-2.022zM0 12.986v7.972h5.722v-1.367H1.546V17.62H5.61v-1.314H1.546v-1.955h4.176v-1.365zm9.263 1.938c-1.735-.01-3.141 1.403-3.121 3.138.019 1.735 1.457 3.117 3.191 3.067a2.992 2.992 0 0 0 1.912-.666v.532h1.518v-5.913h-1.509v.526a3.005 3.005 0 0 0-1.921-.684h-.07zm11.771.007c-1.585 0-2.7.644-2.7 1.886 0 .86.613 1.42 1.936 1.694l1.448.329c.569.109.722.258.722.49 0 .37-.438.602-1.127.602-.876 0-1.378-.19-1.573-.847h-1.533c.219 1.23 1.156 2.05 3.049 2.05 1.752 0 2.744-.82 2.744-1.953 0-.806-.585-1.408-1.809-1.667l-1.294-.26c-.752-.136-.988-.274-.988-.546 0-.357.361-.575 1.029-.575.722 0 1.252.192 1.406.847h1.517c-.085-1.229-.99-2.05-2.827-2.05z"
  },
  Dunzo: {
    color: "#00D290",
    path: "M2.75 0A2.744 2.744 0 0 0 0 2.75v18.5A2.744 2.744 0 0 0 2.75 24h18.5A2.744 2.744 0 0 0 24 21.25V2.75A2.744 2.744 0 0 0 21.25 0Zm9.902 5.506c.91.006 1.781.197 2.594.605-.891 1.87-1.888 3.8-2.832 5.682-.017.029-.086.13-.225.031-.8-.638-1.581-1.304-2.369-1.959-.223-.195-.442-.105-.55.133-.515 1.027-.952 1.883-1.465 2.91-.7 1.398-1.398 2.673-2.098 4.07-.064.142-.143.043-.143.043.538-3.258 1.643-10.807 1.717-11.1.055-.213.183-.36.42-.394.09-.012.18-.023.27-.023ZM17.78 8c.01-.003.016.022.045.082.48.935.803 2.554.487 4.238-.25 1.328-.849 2.487-1.737 3.512a7.715 7.715 0 0 1-3.224 2.207c-.735.268-1.498.362-2.288.361H6.275c-.654 0-.725-.224-.709-.238a923.24 923.24 0 0 1 4.309-5.906c.235-.258.417-.022.668.224 1.105.957 2.139 1.826 2.28 1.94.08.066.163.051.222-.033A971.241 971.241 0 0 1 17.779 8z"
  }
};

function PlatformLogo({ platform, size = "md" }: { platform: string; size?: "sm" | "md" }) {
  const fullLogoSource = platform === "Zomato" ? "/platform-logos/zomato.svg" : platform === "Uber Eats" ? "/platform-logos/uber-eats.svg" : null;
  const logo = platformLogoPaths[platform];
  if (!logo) return <span className={`${size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs"} grid shrink-0 place-items-center rounded-full bg-muted font-bold text-muted-foreground`}>{platform.slice(0, 2).toUpperCase()}</span>;
  return (
    <span className={`${size === "sm" ? "h-7 w-7 p-1.5" : "h-9 w-9 p-2"} grid shrink-0 place-items-center rounded-full border border-border bg-white shadow-sm`} title={platform}>
      {fullLogoSource ? <Image src={fullLogoSource} alt={`${platform} logo`} width={24} height={24} className="h-full w-full object-contain" /> : <svg role="img" aria-label={`${platform} logo`} viewBox="0 0 24 24" className="h-full w-full" fill={logo.color}>
        <path d={logo.path} />
      </svg>}
    </span>
  );
}

export default function DeliveryPlatformAnalysisPage() {
  const store = useLocalStore();
  const canImport = AuthService.canModify("Profit Analysis", "Import Data");
  const [platform, setPlatform] = useState<SalesRecord["orderSource"] | "Uber Eats" | "Dunzo" | "Custom Delivery Platform">("Swiggy");
  const [previewRows, setPreviewRows] = useState<SalesRecord[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const platformRows = ["Dine-in", "Swiggy", "Zomato", "Takeaway"].map((source) => {
    const records = store.salesRecords.filter((row) => row.orderSource === source);
    const revenue = records.reduce((sum, row) => sum + row.totalAmount, 0);
    return {
      source,
      orders: records.length,
      revenue,
      status: revenue > 0 ? "Active" : "No records"
    };
  });

  async function downloadTemplate() {
    const { default: writeXlsxFile } = await import("write-excel-file/browser");
    const headers = ["Date", "Bill Number", "Item Name", "Category", "Quantity", "Selling Price", "Total Amount", "Time"];
    await writeXlsxFile([headers.map((value) => ({ value, fontWeight: "bold" as const }))]).toFile("delivery-platform-import-template.xlsx");
  }

  async function readExcel(file: File) {
    setFileName(file.name);
    setPreviewRows([]);
    setImportErrors([]);
    const { readSheet } = await import("read-excel-file/browser");
    const sheet = await readSheet(file);
    if (!sheet.length) {
      setImportErrors(["The selected workbook is empty."]);
      return;
    }
    const headers = sheet[0].map((value) => String(value ?? "").trim().toLowerCase());
    const requiredHeaders = ["date", "bill number", "item name", "category", "quantity", "selling price", "total amount", "time"];
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
    if (missingHeaders.length) {
      setImportErrors([`Missing columns: ${missingHeaders.join(", ")}`]);
      return;
    }
    const at = (row: typeof sheet[number], heading: string) => row[headers.indexOf(heading.toLowerCase())];
    const errors: string[] = [];
    const rows = sheet.slice(1).filter((row) => row.some((value) => value !== null && value !== "")).map((row, index) => {
      const dateValue = at(row, "Date");
      const timeValue = at(row, "Time");
      const record = {
        id: `PLT-${Date.now()}-${index}`,
        date: dateValue instanceof Date ? dateValue.toISOString().slice(0, 10) : String(dateValue ?? ""),
        billNumber: String(at(row, "Bill Number") ?? ""),
        itemName: String(at(row, "Item Name") ?? ""),
        category: String(at(row, "Category") ?? ""),
        quantity: Number(at(row, "Quantity") ?? 0),
        sellingPrice: Number(at(row, "Selling Price") ?? 0),
        totalAmount: Number(at(row, "Total Amount") ?? 0),
        orderSource: platform === "Zomato" || platform === "Swiggy" ? platform : "Takeaway",
        time: timeValue instanceof Date ? timeValue.toISOString().slice(11, 16) : String(timeValue ?? "")
      } as SalesRecord;
      const rowNumber = index + 2;
      if (!record.date) errors.push(`Row ${rowNumber}: Date is required.`);
      if (!record.billNumber) errors.push(`Row ${rowNumber}: Bill Number is required.`);
      if (!record.itemName) errors.push(`Row ${rowNumber}: Item Name is required.`);
      if (!record.category) errors.push(`Row ${rowNumber}: Category is required.`);
      if (record.quantity <= 0) errors.push(`Row ${rowNumber}: Quantity must be greater than zero.`);
      if (record.sellingPrice <= 0) errors.push(`Row ${rowNumber}: Selling Price must be greater than zero.`);
      if (record.totalAmount <= 0) errors.push(`Row ${rowNumber}: Total Amount must be greater than zero.`);
      return record;
    });
    if (!rows.length) errors.push("The workbook does not contain any data rows.");
    setPreviewRows(rows);
    setImportErrors(errors);
  }

  function importPlatformRows() {
    if (!previewRows.length || importErrors.length) return;
    previewRows.forEach((row) => SalesAnalyticsService.create(row));
    if (previewRows.length) {
      ImportService.create({
        id: `IMP-PLATFORM-${Date.now()}`,
        importDate: new Date().toISOString().slice(0, 10),
        importedBy: AuthService.currentUser()?.name ?? "Current user",
        sourceType: `${platform} Excel Import`,
        rowsImported: previewRows.length,
        rowsFailed: 0,
        validationErrors: [],
        status: "Imported"
      });
      setPreviewRows([]);
      setFileName("");
    }
  }

  function configureApiKey() {
    if (!apiKey.trim()) return;
    setApiKeyConfigured(true);
  }

  return (
    <>
      <PageHeader title="Delivery Platform Analysis" breadcrumbs={["Profit Analysis", "Delivery Platforms"]} />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Dine-in Revenue" value={formatCurrency(platformRows[0].revenue)} icon={Store} helper="From stored records" />
        <StatCard label="Swiggy Revenue" value={formatCurrency(platformRows[1].revenue)} iconNode={<PlatformLogo platform="Swiggy" />} helper="From stored records" />
        <StatCard label="Zomato Revenue" value={formatCurrency(platformRows[2].revenue)} iconNode={<PlatformLogo platform="Zomato" />} helper="From stored records" />
      </div>
      <div className="mt-6"><ChartCard title="Platform comparison" data={platformRows.map((row) => ({ name: row.source, value: row.revenue }))} type="bar" /></div>
      <section className="dashboard-surface mt-6 space-y-4 p-5">
        <div>
          <h2 className="text-lg font-semibold">Platform Import Configuration</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="flex items-center gap-2">
            <PlatformLogo platform={platform} size="sm" />
            <Select className="flex-1" value={platform} onChange={(event) => {
              setPlatform(event.target.value as typeof platform);
              setApiKey("");
              setApiKeyConfigured(false);
            }}>
              {["Swiggy", "Zomato", "Uber Eats", "Dunzo", "Custom Delivery Platform"].map((item) => <option key={item}>{item}</option>)}
            </Select>
          </div>
          <Input type="file" accept=".xlsx,.xls" disabled={!canImport} onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void readExcel(file);
          }} />
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              className="pl-9 pr-10"
              placeholder={`${platform} API connection key`}
              autoComplete="off"
              onChange={(event) => {
                setApiKey(event.target.value);
                setApiKeyConfigured(false);
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowApiKey((value) => !value)}
              aria-label={showApiKey ? "Hide API key" : "Show API key"}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm">
            {fileName ? <p className="font-medium">{fileName}: {previewRows.length} rows ready</p> : <p className="text-muted-foreground">Upload an Excel workbook or configure the selected platform&apos;s API key.</p>}
            {importErrors.length ? <ul className="mt-2 space-y-1 text-danger">{importErrors.slice(0, 5).map((error) => <li key={error}>{error}</li>)}</ul> : null}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={configureApiKey} disabled={!apiKey.trim()}>
              {apiKeyConfigured ? <CheckCircle2 className="h-4 w-4 text-success" /> : <KeyRound className="h-4 w-4" />}
              {apiKeyConfigured ? "API Key Configured" : "Configure API Key"}
            </Button>
            <Button variant="secondary" onClick={() => void downloadTemplate()}><Download className="h-4 w-4" />Download Template</Button>
            <Button onClick={importPlatformRows} disabled={!previewRows.length || Boolean(importErrors.length) || !canImport}><Upload className="h-4 w-4" />Import Excel</Button>
          </div>
        </div>
      </section>
      <div className="mt-6">
        <DataTable<(typeof platformRows)[number]>
          data={platformRows}
          columns={[
            { key: "source", header: "Channel", render: (row) => <span className="flex items-center gap-2"><PlatformLogo platform={row.source} size="sm" />{row.source}</span> },
            { key: "orders", header: "Orders" },
            { key: "revenue", header: "Revenue", render: (row) => formatCurrency(row.revenue) },
            { key: "status", header: "Status", render: (row) => <StatusBadge tone={row.status === "Active" ? "success" : "neutral"}>{row.status}</StatusBadge> }
          ]}
        />
      </div>
    </>
  );
}
