import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baseUrl = process.env.VERNEX_BASE_URL ?? "http://localhost:3002";
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function assertIncludes(source, needles, label) {
  for (const needle of needles) {
    assert(source.includes(needle), `${label} missing: ${needle}`);
  }
}

async function route(pathname, expectedText = []) {
  const response = await fetch(`${baseUrl}${pathname}`, { redirect: "manual" });
  assert(response.status >= 200 && response.status < 400, `${pathname} returned ${response.status}`);
  const html = await response.text();
  for (const text of expectedText) {
    assert(html.includes(text), `${pathname} missing rendered text: ${text}`);
  }
}

const authForm = read("src/modules/shared-core/AuthForm.tsx");
assertIncludes(
  authForm,
  [
    "Mock login IDs",
    "owner@vernex.local",
    "manager@vernex.local",
    "admin@vernex.local",
    "staff@vernex.local",
    "sales@vernex.local",
    "analyst@vernex.local",
    "Full name",
    "Email",
    "Role",
    "Phone",
    "Password",
    "Confirm Password",
    "Company Name",
    "Company Size",
    "Industry",
    "Department",
    "Assigned Branch",
    "Reporting Manager"
  ],
  "Auth form"
);

const services = read("src/lib/services.ts");
assertIncludes(
  services,
  [
    "const mockUsers",
    "MOCK-OWNER",
    "MOCK-MANAGER",
    "MOCK-ADMIN",
    "MOCK-STAFF",
    "MOCK-SALES",
    "MOCK-ANALYST",
    "FAQ-DISCOUNT-LIMIT",
    "FAQ-AVAILABILITY",
    "FAQ-ORDER-LIMIT",
    "FAQ-BUSINESS-HOURS",
    "FAQ-HANDOFF",
    "static logout",
    "static login",
    "static signup",
    "RolePermissionService",
    "updatePermissions",
    "roleHomePath",
    "visibleStore",
    "readOnly",
    "appendMissingById",
    "demoUsers",
    "demoBranches",
    "demoLeads",
    "demoSalesRecords",
    "UAT-MANAGER-MEERA",
    "UAT-STAFF-ARUN",
    "UAT-SALES-NISHA",
    "UAT-ANALYST-DEV",
    "Anna Nagar Branch",
    "Velachery Branch",
    "Sales Team",
    "Profit Analysis Team",
    "Karthik Wedding Enquiry",
    "Corporate Lunch Lead",
    "Wedding Catering Quote",
    "Quotation Request Auto Reply",
    "Quotation Follow-up 24h",
    "BILL-001",
    "SWG-001",
    "Premium Buffet",
    "Rice",
    "UAT-REPORT-DAILY-2026-06-13"
  ],
  "Services"
);

const management = read("src/modules/shared-core/ManagementScreens.tsx");
assertIncludes(
  management,
  [
    'BranchService.create({ ...record, status: "Active"',
    'OrganizationService.createDepartment({ ...record, managerId: creator?.id ?? record.managerId, status: "Active"',
    'hideOnCreate: true',
    'defaultOnCreate: "Active"',
    'options: ["Active", "Inactive", "Suspended", "Closed"]'
  ],
  "Management screens"
);

const entityManager = read("src/modules/shared-core/EntityManager.tsx");
assertIncludes(
  entityManager,
  [
    "Import Rows",
    "Paste CSV rows",
    "justify-end",
    "AuthService.canModify",
    "hideOnCreate",
    "defaultOnCreate",
    "min-h-12",
    "SlidersHorizontal",
    "filtersOpen"
  ],
  "Entity manager"
);

const common = read("src/modules/shared-core/CommonSections.tsx");
assertIncludes(
  common,
  [
    "Create AI Rule",
    "Edit AI Rule",
    "cloneRule",
    "Constraint value",
    "Fallback response",
    "Maximum Discount %",
    "Maximum Order Quantity",
    "Report Preview",
    "Generated at",
    "From Date",
    "To Date",
    "Download"
  ],
  "Common sections"
);
assertIncludes(common, ["KebabActionMenu", 'label: "Edit"', 'label: "Clone"', 'label: "Delete"'], "AI auto-reply actions");

const roles = read("src/modules/shared-core/RoleManagement.tsx");
assertIncludes(roles, ["Module Select All", "togglePermission", "PermissionMatrix", "KebabActionMenu", "org-tree"], "Role management");

const chart = read("src/components/charts/ChartCard.tsx");
assertIncludes(chart, ["dynamic", "no data available"], "Chart card");
const chartRenderer = read("src/components/charts/ChartRenderer.tsx");
assertIncludes(chartRenderer, ["Legend", "labelLine", "percent", "Tooltip"], "Chart renderer");

const salesImport = read("src/modules/profit-analysis/SalesAnalyticsIngestion.tsx");
assertIncludes(
  salesImport,
  ["Template", "sales-analytics-template.xlsx", "read-excel-file/browser", "Import Excel file", "Preview Data"],
  "Sales analytics ingestion"
);
assert(!salesImport.includes("Data Sources"), "Sales Analytics must not render Data Sources");
assert(!salesImport.includes("Preview rows will appear"), "Sales Analytics must not render the old CSV preview placeholder");

const delivery = read("src/app/dashboard/profit-analysis/delivery-platform-analysis/page.tsx");
assertIncludes(
  delivery,
  ["Platform Import Configuration", "Swiggy", "Zomato", "Uber Eats", "Dunzo", "Sync Platform Data", "SalesAnalyticsService.create"],
  "Delivery platform analysis"
);

const kanban = read("src/modules/sales-agent/KanbanBoard.tsx");
assertIncludes(kanban, ["draggable", "onDrop", "onMove", "dataTransfer"], "Kanban board");

const crm = read("src/app/dashboard/sales-agent/crm-pipeline/page.tsx");
assertIncludes(crm, ["LeadService.update", "status as LeadStatus"], "CRM pipeline");

const conversation = read("src/modules/sales-agent/ConversationWorkspace.tsx");
assertIncludes(conversation, ["max-h-56 overflow-y-auto", "Transfer To", "patchActive({ assignedUserId", 'type="file"', "Attachments:", "SlidersHorizontal", "filtersOpen"], "Conversation transfer");

const sidebar = read("src/components/layout/Sidebar.tsx");
assertIncludes(sidebar, ["overflow-y-auto", "prefetch", "<details key={group.label} open"], "Sidebar");
assertIncludes(sidebar, ["Collapse menu", "Resize sidebar", "lg:w-[var(--sidebar-width)]"], "Responsive sidebar controls");
assertIncludes(sidebar, ["collapsed ? 64 : width", "lg:h-11 lg:w-11"], "Square collapsed sidebar");
const formModal = read("src/components/modals/FormModal.tsx");
assertIncludes(formModal, ["max-h-[calc(100dvh-1.5rem)]", "overflow-hidden", "overflow-y-auto", "shadow-2xl"], "Scrollable modal");
const theme = read("src/lib/theme.ts");
assertIncludes(theme, ["--primary", "--ring", "--primary-foreground", "contrastForeground"], "Primary color theme");
assertIncludes(read("src/components/layout/ThemeInitializer.tsx"), ["vernex-platform-v4-empty", "applyPrimaryColor", "vernex-store-change", "storage"], "Global theme initializer");
assertIncludes(read("src/app/globals.css"), [".org-tree ul", ".org-node", "border-left"], "Organization chart styles");

const topNavbar = read("src/components/layout/TopNavbar.tsx");
assertIncludes(topNavbar, ["Profile", "Logout", "AuthService.logout", "Phone", "Company", "Industry"], "Top navbar profile");

const profitReports = read("src/app/dashboard/profit-analysis/profit-reports/page.tsx");
assertIncludes(profitReports, ["From date", "To date", "Download Report", "downloadReport"], "Profit reports");

const managementScreens = read("src/modules/shared-core/ManagementScreens.tsx");
assertIncludes(managementScreens, ["No response after first contact", "Quotation sent but not accepted", "assignedUserId: record.assignedStaff"], "Automation and handoff");

await route("/login", ["Login to Vernex Platform", "Mock login IDs"]);
await route("/register", ["Create Vernex Platform account", "Company Name"]);
await route("/forgot-password", ["Reset password"]);
await route("/dashboard/reports", ["Reports"]);
await route("/dashboard/sales-agent/ai-auto-reply", ["AI Auto Reply"]);
await route("/dashboard/sales-agent/crm-pipeline");
await route("/dashboard/profit-analysis/delivery-platform-analysis");

if (failures.length) {
  console.error("Platform verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Platform verification passed.");
