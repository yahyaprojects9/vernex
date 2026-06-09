import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const src = join(root, "src");

const allowedDirectories = new Set([
  "src",
  "src/app",
  "src/app/auth",
  "src/app/auth/login",
  "src/app/auth/register",
  "src/app/dashboard",
  "src/app/dashboard/users",
  "src/app/dashboard/settings",
  "src/app/dashboard/reports",
  "src/app/dashboard/sales-agent",
  "src/app/dashboard/sales-agent/leads",
  "src/app/dashboard/sales-agent/quotations",
  "src/app/dashboard/sales-agent/conversations",
  "src/app/dashboard/sales-agent/ai-auto-reply",
  "src/app/dashboard/sales-agent/follow-up-automation",
  "src/app/dashboard/sales-agent/crm-pipeline",
  "src/app/dashboard/sales-agent/human-handoff",
  "src/app/dashboard/sales-agent/analytics",
  "src/app/dashboard/profit-analysis",
  "src/app/dashboard/profit-analysis/sales-analytics",
  "src/app/dashboard/profit-analysis/peak-hour-analysis",
  "src/app/dashboard/profit-analysis/delivery-platform-analysis",
  "src/app/dashboard/profit-analysis/product-performance",
  "src/app/dashboard/profit-analysis/cost-tracking",
  "src/app/dashboard/profit-analysis/wastage-tracking",
  "src/app/dashboard/profit-analysis/profit-reports",
  "src/components",
  "src/components/layout",
  "src/components/ui",
  "src/components/cards",
  "src/components/tables",
  "src/components/forms",
  "src/components/charts",
  "src/components/modals",
  "src/components/chat",
  "src/modules",
  "src/modules/shared-core",
  "src/modules/sales-agent",
  "src/modules/profit-analysis",
  "src/lib",
  "src/types"
]);

function walkDirectories(path, relative = "src") {
  const entries = readdirSync(path, { withFileTypes: true });
  const directories = [relative];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const childRelative = `${relative}/${entry.name}`;
    directories.push(...walkDirectories(join(path, entry.name), childRelative));
  }

  return directories;
}

const actualDirectories = new Set(walkDirectories(src));
const missing = [...allowedDirectories].filter((directory) => !existsSync(join(root, directory)));
const extra = [...actualDirectories].filter((directory) => !allowedDirectories.has(directory));

if (missing.length || extra.length) {
  console.error("Folder structure does not match the requested Vernex structure.");
  if (missing.length) console.error(`Missing:\n${missing.join("\n")}`);
  if (extra.length) console.error(`Extra:\n${extra.join("\n")}`);
  process.exit(1);
}

console.log("Folder structure matches the requested Vernex structure.");
