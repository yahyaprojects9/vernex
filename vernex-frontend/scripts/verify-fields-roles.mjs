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

function includesAll(source, label, values) {
  for (const value of values) {
    assert(source.includes(value), `${label} missing: ${value}`);
  }
}

async function checkRoute(route) {
  const started = performance.now();
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  const elapsed = Math.round(performance.now() - started);
  assert(response.status >= 200 && response.status < 400, `${route} returned ${response.status}`);
  return `${route} ${response.status} ${elapsed}ms`;
}

const auth = read("src/modules/shared-core/AuthForm.tsx");
includesAll(auth, "Auth login/register fields", [
  "Full name",
  "Email",
  "Role",
  "Phone",
  "Password",
  "Confirm Password",
  "Company Name",
  "Company Size",
  "Industry",
  "Company Registration Number",
  "Number Of Branches",
  "Department",
  "Assigned Branch",
  "Team",
  "Reporting Manager",
  "Forgot password?",
  "Mock login IDs"
]);
includesAll(auth, "Auth role options", ["owner", "manager", "admin", "staff", "sales-executive", "analyst", "viewer"]);

const services = read("src/lib/services.ts");
includesAll(services, "Mock role accounts", [
  "owner@vernex.local",
  "manager@vernex.local",
  "admin@vernex.local",
  "staff@vernex.local",
  "sales@vernex.local",
  "analyst@vernex.local",
  "roleId: \"owner\"",
  "roleId: \"manager\"",
  "roleId: \"admin\"",
  "roleId: \"staff\"",
  "roleId: \"sales-executive\"",
  "roleId: \"analyst\""
]);
includesAll(services, "Default limited role permissions", [
  "defaultRolePermissions",
  "\"Organization\": [\"View Users\", \"View Branches\", \"View Departments\"]",
  "\"Sales Agent\": [\"View\"]",
  "\"Profit Analysis\": [\"View\", \"View Analytics\"]",
  "\"sales-executive\"",
  "\"analyst\"",
  "withRuntimeDefaults"
]);
includesAll(services, "Role visibility logic", [
  "role?.globalVisibility",
  "user.roleId === \"manager\"",
  "assignedUserIds",
  "branchIds",
  "departmentIds",
  "readOnly",
  "static canModify",
  "static logout",
  "roleHomePath",
  "\"/dashboard/sales-agent\"",
  "\"/dashboard/profit-analysis\""
]);
includesAll(services, "V5 seeded acceptance dataset", [
  "appendMissingById",
  "demoUsers",
  "demoBranches",
  "demoDepartments",
  "demoLeads",
  "demoQuotations",
  "demoConversations",
  "demoSalesRecords",
  "demoProductPerformance",
  "demoCosts",
  "demoWastage",
  "demoReports",
  "Meera Manager",
  "meera.manager@test.com",
  "Arun Staff",
  "arun.staff@test.com",
  "Nisha Sales",
  "nisha.sales@test.com",
  "Dev Analyst",
  "dev.analyst@test.com",
  "Anna Nagar Branch",
  "Velachery Branch",
  "Karthik Wedding Enquiry",
  "Corporate Lunch Lead",
  "Wedding Catering Quote",
  "BILL-001",
  "BILL-002",
  "BILL-003",
  "SWG-001",
  "SWG-002",
  "Premium Buffet",
  "Corporate Lunch",
  "Rice",
  "Overproduction"
]);

const management = read("src/modules/shared-core/ManagementScreens.tsx");
const userManagement = read("src/modules/shared-core/UserManagement.tsx");
const screenFields = {
  "Branch Management": ["Branch Name", "Branch Code", "Location", "Assigned Manager", "Phone", "Operating Hours", "Description", "Status", "Active", "Inactive", "Suspended", "Closed"],
  "Department Management": ["Department Name", "Branch", "Manager", "Department Members", "Description", "Status", "Active", "Inactive", "Suspended"],
  "Lead Management": ["Lead Name", "Phone", "Source", "WhatsApp", "Website", "Email", "Manual", "Requirement", "Location", "Status", "Lead Score", "Assigned Staff", "Department", "Next Follow-up", "Notes"],
  "Quotation Management": ["Lead", "leadId", "Quotation Title", "Service/Package Name", "Price", "Description", "Terms", "Validity", "Draft", "Sent", "Accepted", "Expired"],
  "Cost Tracking": ["Item Name", "Selling Price", "Food Cost", "Gross Margin", "Margin Percentage", "Healthy", "Review", "Critical"],
  "Wastage Tracking": ["Date", "Item Name", "Quantity Wasted", "Reason", "Spoilage", "Overproduction", "Kitchen Error", "Expired", "Estimated Cost Loss", "Staff Note"],
  "Follow-Up Automation": ["Rule Name", "Trigger Condition", "No response after first contact", "Quotation sent but not accepted", "Delay Time", "Immediate", "1 day", "Template", "Friendly reminder", "Lead Status"],
  "Human Handoff": ["Customer Name", "Reason", "Conversation Summary", "Assigned Staff", "Assigned User ID", "Pending", "In Progress", "Closed"],
  "Product Performance": ["Item Name", "Category", "Quantity Sold", "Revenue", "Food Cost", "Profit Margin", "Performance Status", "Best Seller", "Slow Moving"],
  "Import History": ["Import Date", "Imported By", "Source Type", "Rows Imported", "Rows Failed", "Draft", "Validated", "Imported", "Failed"]
};
for (const [screen, fields] of Object.entries(screenFields)) {
  includesAll(management, screen, fields);
}

const entity = read("src/modules/shared-core/EntityManager.tsx");
includesAll(entity, "Entity shared controls", [
  "Search",
  "Import Rows",
  "Export",
  "Delete selected",
  "Create",
  "Update",
  "Cancel",
  "No",
  "records yet",
  "hideOnCreate",
  "defaultOnCreate",
  "permissions?:",
  "canCreate",
  "canEdit",
  "canDelete",
  "canImport"
]);
includesAll(entity, "Modal CRUD and Excel import", [
  "FormModal",
  "ConfirmModal",
  "read-excel-file/browser",
  "setViewing",
  "allowSelection",
  "Export",
  "Template",
  "flex-nowrap",
  "whitespace-nowrap"
]);
includesAll(userManagement, "User directory behavior", ["Total users", "User name", "Access", "Last active", "Date added", "Add user", "Import", "Export", "Template", "MoreVertical", "label=\"View\"", "label=\"Edit\"", "FormModal", "read-excel-file/browser", "aria-pressed={filtersOpen}", "All roles", "All statuses", "tone=\"role\"", "tone=\"branch\"", "tone=\"department\"", "minWidth: 44", "maxHeight: 44", "borderRadius: \"50%\"", "min-w-[860px]"]);
assert(!userManagement.includes('type="checkbox"'), "User Management must not render unused checkboxes");
includesAll(management, "Organization tables without row selection", ['title="Branch Management"', 'title="Department Management"', "allowSelection={false}"]);
includesAll(management, "Organization table search and actions", ['searchPlaceholder="Search branch"', 'searchPlaceholder="Search department"', "actionMenu"]);
includesAll(entity, "Kebab table actions", ["MoreVertical", "ActionMenuButton", "actionMenuId", 'label="View"', 'label="Edit"']);
assert(!management.includes('{ key: "budget", label: "Budget"'), "Lead Management must not render Budget");
includesAll(entity, "Excel exports", ["write-excel-file/browser", "Template", ".xlsx"]);

const common = read("src/modules/shared-core/CommonSections.tsx");
includesAll(common, "Reports and AI fields", [
  "Daily report",
  "Weekly report",
  "Monthly report",
  "From date",
  "To date",
  "Download",
  "Rule name",
  "Pricing",
  "Discount",
  "Negotiation",
  "Availability",
  "Business Hours",
  "Escalation",
  "Quotation Requests",
  "Constraint value",
  "Fallback response",
  "Priority"
]);

const salesImport = read("src/modules/profit-analysis/SalesAnalyticsIngestion.tsx");
includesAll(salesImport, "Sales import fields", [
  "Manual CSV Rows",
  "Preview Data",
  "Validation Engine",
  "Import and Generate Analytics",
  "Manual Entry"
]);
assert(!salesImport.includes("Connector name"), "Sales import must not expose a static connector form");

const delivery = read("src/app/dashboard/profit-analysis/delivery-platform-analysis/page.tsx");
includesAll(delivery, "Delivery platform fields", [
  "Platform Import Configuration",
  "Swiggy",
  "Zomato",
  "Uber Eats",
  "Dunzo",
  "Custom Delivery Platform",
  "Manual Upload",
  "Sync Platform Data"
]);
assert(!delivery.includes("API Configuration"), "Delivery platform must not expose a static API form");

const conversations = read("src/modules/sales-agent/ConversationWorkspace.tsx");
includesAll(conversations, "Conversation fields and permissions", [
  "Create conversation",
  "Search conversations",
  "Internal Notes",
  "Transfer To",
  "Send message",
  "type=\"file\"",
  "Attachments:",
  "AI/Human",
  "Archive",
  "canCreateConversation",
  "canSendMessage",
  "canAssignConversation"
]);

const crm = read("src/app/dashboard/sales-agent/crm-pipeline/page.tsx");
includesAll(crm, "CRM stages", ["New", "Contacted", "Follow-up", "Interested", "Converted", "Lost", "LeadService.update"]);

const roles = read("src/modules/shared-core/RoleManagement.tsx");
includesAll(roles, "Permission matrix UI", ["Organization Roles", "FormModal", "Hierarchy Level", "PermissionMatrix", "Module Select All", "Organization Hierarchy"]);
includesAll(roles, "Compact labeled role form", ["Role Name", "Example: Branch Manager", "Description", "Example: Manages branch operations", "Status", "max-w-2xl"]);
includesAll(roles, "Level-derived organization tree", ["buildHierarchy", "parentByUser", "managerId", "reportingManager", "Level {level}", "children.map"]);
const permissions = read("src/config/permissions.json");
includesAll(permissions, "Permission matrix fields", ["Configure Permissions", "View Users", "Create Users", "Manage Rules", "Import Data"]);

const profile = read("src/components/layout/TopNavbar.tsx");
includesAll(profile, "Profile fields", ["Profile", "Name", "Email", "Role", "Phone", "Company", "Industry", "Logout", "Edit", "Save Profile", "AuthService.updateCurrentUserProfile"]);

const guard = read("src/components/layout/DashboardGuard.tsx");
includesAll(guard, "Route permission guard", ["AbilityProvider", "canAccessPath", "AuthService.can(\"read\", \"User\")", "AuthService.can(\"read\", \"Role\")", "Sales Agent", "Profit Analysis"]);

const sidebar = read("src/components/layout/Sidebar.tsx");
includesAll(sidebar, "Permission sidebar", ["canAccessItem", "AuthService.can(\"read\", \"User\")", "AuthService.can(\"read\", \"Role\")", "canViewModule"]);
includesAll(sidebar, "Blank logo state", ["No company logo", "companyName"]);
includesAll(sidebar, "Collapsible resizable sidebar", ["vernex-sidebar-width", "vernex-sidebar-collapsed", "Collapse menu", "Resize sidebar", "cursor-col-resize"]);
includesAll(sidebar, "Bounded sidebar width", ["Math.min(320", "savedWidth <= 320"]);
includesAll(read("src/lib/services.ts"), "Hierarchy-aware user editing", ["canEditUser", "targetRole.level > actorRole.level", "nextRole.level > actorRole.level"]);

const navigation = JSON.parse(read("src/config/navigation.json"));
const organizationOrder = navigation[0].items.map((item) => item.label);
assert(
  JSON.stringify(organizationOrder) === JSON.stringify(["Dashboard", "Role Management", "User Management", "Branch Management", "Department Management", "Reports", "Settings"]),
  "Organization menu order is incorrect"
);

const profitReports = read("src/app/dashboard/profit-analysis/profit-reports/page.tsx");
includesAll(profitReports, "Profit report fields", ["Daily", "Weekly", "Monthly", "From date", "To date", "Download Report"]);

const organizationReports = read("src/modules/shared-core/CommonSections.tsx");
includesAll(organizationReports, "Organization report layout", ["min-w-[620px]", "grid-cols-4", "Report chart preview"]);
assert(!organizationReports.includes("Insights and recommendations"), "Organization reports must not render the removed insights panel");

const settings = read("src/modules/shared-core/SettingsForm.tsx");
includesAll(settings, "Staged settings", ["setDraft", "saveSettings", "Save Settings", 'field.control === "color"', "Company logo preview"]);

includesAll(crm, "Optimistic CRM drag", ["pipelineLeads", "setPipelineLeads", "moveLead"]);

const attachedPlanValues = [
  "Ravi Kumar",
  "ravi.owner@test.com",
  "Test@12345",
  "Vernex Test Foods",
  "Meera Manager",
  "Arun Staff",
  "Nisha Sales",
  "Dev Analyst",
  "Anna Nagar Branch",
  "Velachery Branch",
  "Sales Team",
  "Profit Analysis Team",
  "Karthik Wedding Enquiry",
  "Corporate Lunch Lead",
  "Wedding Catering Quote",
  "Premium Buffet Package",
  "Quotation Request Auto Reply",
  "Quotation Follow-up 24h",
  "2026-06-13,BILL-001,Premium Buffet,Catering,1,180000,180000,Dine-in,19:30",
  "2026-06-15,SWG-001,Family Meal Box,Meals,5,1200,6000,20:45"
];
assert(attachedPlanValues.length === 20, "Attached test fixture values were not loaded");

const routes = [
  "/login",
  "/register",
  "/forgot-password",
  "/dashboard",
  "/dashboard/users",
  "/dashboard/branches",
  "/dashboard/departments",
  "/dashboard/roles",
  "/dashboard/reports",
  "/dashboard/sales-agent",
  "/dashboard/sales-agent/leads",
  "/dashboard/sales-agent/quotations",
  "/dashboard/sales-agent/conversations",
  "/dashboard/sales-agent/follow-up-automation",
  "/dashboard/sales-agent/ai-auto-reply",
  "/dashboard/sales-agent/human-handoff",
  "/dashboard/sales-agent/crm-pipeline",
  "/dashboard/sales-agent/analytics",
  "/dashboard/profit-analysis",
  "/dashboard/profit-analysis/sales-analytics",
  "/dashboard/profit-analysis/delivery-platform-analysis",
  "/dashboard/profit-analysis/cost-tracking",
  "/dashboard/profit-analysis/wastage-tracking",
  "/dashboard/profit-analysis/product-performance",
  "/dashboard/profit-analysis/peak-hour-analysis",
  "/dashboard/profit-analysis/profit-reports",
  "/dashboard/settings"
];

const routeResults = [];
for (const route of routes) {
  routeResults.push(await checkRoute(route));
}

if (failures.length) {
  console.error("Field and role verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Field and role verification passed.");
console.log(routeResults.join("\n"));
