"use client";

import { Building2, MapPin, Users } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { EntityManager } from "@/modules/shared-core/EntityManager";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import {
  BranchService,
  DepartmentService,
  ImportService,
  LeadService,
  QuotationService,
  UserService,
  CostTrackingService,
  WastageTrackingService,
  FollowUpRuleService,
  HandoffService,
  ProductPerformanceService
  ,OrganizationService
} from "@/lib/services";
import type { CostTracking, FollowUpRule, HandoffRequest, Lead, MenuItemPerformance, Quotation, WastageEntry } from "@/types";

export function UserManagementScreen() {
  const store = useLocalStore();
  const roleName = Object.fromEntries(store.roles.map((role) => [role.id, role.name]));
  const branchName = Object.fromEntries(store.branches.map((branch) => [branch.id, branch.name]));
  const departmentName = Object.fromEntries(store.departments.map((department) => [department.id, department.name]));
  const userName = Object.fromEntries(store.users.map((user) => [user.id, user.name]));
  return (
    <EntityManager
      title="User Management"
      description="Create, edit, delete, search, filter, bulk select, and export users with role, branch, and department assignments."
      records={store.users}
      onCreate={(record) => UserService.create({
        ...record,
        role: record.roleId === "owner" ? "Owner" : record.roleId === "admin" || record.roleId === "manager" ? "Admin" : "Staff",
        password: record.password || "ChangeMe123",
        lastActive: "Never",
        companyName: store.settings.companyName,
        companySize: record.companySize || "",
        industry: record.industry || "",
        branchIds: record.branchId ? [record.branchId] : [],
        departmentIds: record.departmentId ? [record.departmentId] : []
      })}
      onUpdate={OrganizationService.updateUser}
      onDelete={UserService.delete}
      permissions={{ module: "Organization", create: "Create Users", edit: "Edit Users", export: "View Users" }}
      allowDelete={false}
      fields={[
        { key: "name", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "password", label: "Password", hideInTable: true },
        { key: "roleId", label: "Role", type: "select", options: store.roles.filter((role) => role.status !== "Inactive").map((role) => role.id), renderValue: (value) => roleName[value] ?? value },
        { key: "branchId", label: "Branch", type: "select", options: store.branches.map((branch) => branch.id), renderValue: (value, record) => branchName[value] ?? branchName[String((record.branchIds as string[])?.[0])] ?? value },
        { key: "departmentId", label: "Department", type: "select", options: store.departments.map((department) => department.id), renderValue: (value, record) => departmentName[value] ?? departmentName[String((record.departmentIds as string[])?.[0])] ?? value },
        { key: "managerId", label: "Reporting Manager", type: "select", options: store.users.filter((user) => user.roleId === "manager").map((user) => user.id), renderValue: (value) => userName[value] ?? value },
        { key: "employeeCode", label: "Employee Code" },
        { key: "joiningDate", label: "Joining Date", type: "date" },
        { key: "team", label: "Team" },
        { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Suspended"] }
      ]}
    />
  );
}

export function BranchManagementScreen() {
  const store = useLocalStore();
  const managers = store.users.filter((user) => user.roleId === "manager" && user.status === "Active");
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Branches" value={String(store.branches.length)} helper="Operational locations" icon={MapPin} />
        <StatCard label="Managers" value={String(new Set(store.branches.map((branch) => branch.managerId)).size)} helper="Assigned branch owners" icon={Users} />
        <StatCard label="Active Branches" value={String(store.branches.filter((branch) => branch.status === "Active").length)} helper="Live branches" icon={Building2} />
      </div>
      <EntityManager
        title="Branch Management"
        description="Create branches, assign managers and staff, manage status, settings, and branch analytics filters."
        records={store.branches}
        onCreate={(record) => BranchService.create({ ...record, status: "Active", city: record.location ?? "", country: "", createdAt: new Date().toISOString() })}
        onUpdate={BranchService.update}
        onDelete={BranchService.delete}
        permissions={{ module: "Organization", create: "Edit Branches", edit: "Edit Branches", delete: "Edit Branches" }}
        fields={[
          { key: "name", label: "Branch Name" },
          { key: "code", label: "Branch Code" },
          { key: "location", label: "Location" },
          { key: "managerId", label: "Assigned Manager", type: "select", options: managers.map((user) => user.id), renderValue: (value) => managers.find((user) => user.id === value)?.name ?? value },
          { key: "phone", label: "Phone" },
          { key: "operatingHours", label: "Operating Hours" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Suspended", "Closed"], hideOnCreate: true, defaultOnCreate: "Active" }
        ]}
      />
    </div>
  );
}

export function DepartmentManagementScreen() {
  const store = useLocalStore();
  const managers = store.users.filter((user) => user.roleId === "manager" && user.status === "Active");
  return (
    <EntityManager
      title="Department Management"
      description="Create departments, assign managers and users, manage visibility, and review department analytics."
      records={store.departments}
      onCreate={(record) => OrganizationService.createDepartment({ ...record, status: "Active", createdAt: new Date().toISOString() })}
      onUpdate={OrganizationService.updateDepartment}
      onDelete={DepartmentService.delete}
      permissions={{ module: "Organization", create: "Edit Departments", edit: "Edit Departments", delete: "Edit Departments" }}
      fields={[
        { key: "name", label: "Department Name" },
        { key: "branchId", label: "Branch", type: "select", options: store.branches.map((branch) => branch.id), renderValue: (value) => store.branches.find((branch) => branch.id === value)?.name ?? value },
        { key: "managerId", label: "Manager", type: "select", options: managers.map((user) => user.id), renderValue: (value) => managers.find((user) => user.id === value)?.name ?? value },
        { key: "description", label: "Description", type: "textarea" },
        { key: "memberIds", label: "Department Members", type: "multiselect", options: store.users.map((user) => user.id), renderValue: (value, record) => String((record.memberIds as string[])?.length ?? 0) },
        { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Suspended"], hideOnCreate: true, defaultOnCreate: "Active" }
      ]}
    />
  );
}

export function LeadManagementScreen() {
  const store = useLocalStore();
  return (
    <EntityManager<Lead>
      title="Lead Management"
      description="Create, update, delete, filter, bulk export, and assign leads. Analytics recalculate from stored lead data."
      records={store.leads}
      onCreate={(record) => LeadService.create(record)}
      onUpdate={LeadService.update}
      onDelete={LeadService.delete}
      permissions={{ module: "Sales Agent", create: "Create Lead", edit: "Edit Lead", delete: "Delete Lead", export: "Export Leads", import: "Create Lead" }}
      fields={[
        { key: "leadName", label: "Lead Name" },
        { key: "phone", label: "Phone" },
        { key: "source", label: "Source", type: "select", options: ["WhatsApp", "Website", "Email", "Manual"] },
        { key: "requirement", label: "Requirement" },
        { key: "budget", label: "Budget", type: "number" },
        { key: "location", label: "Location" },
        { key: "status", label: "Status", type: "select", options: ["New", "Contacted", "Follow-up", "Interested", "Converted", "Lost"] },
        { key: "leadScore", label: "Lead Score", type: "select", options: ["Hot", "Warm", "Cold"] },
        { key: "assignedStaff", label: "Assigned Staff" },
        { key: "nextFollowUp", label: "Next Follow-up", type: "date" },
        { key: "notes", label: "Notes", type: "textarea" }
      ]}
    />
  );
}

export function QuotationManagementScreen() {
  const store = useLocalStore();
  return (
    <EntityManager<Quotation>
      title="Quotation Management"
      description="Create, edit, preview, send, filter, export, and delete quotations with local persistence."
      records={store.quotations}
      onCreate={(record) => QuotationService.create(record)}
      onUpdate={QuotationService.update}
      onDelete={QuotationService.delete}
      permissions={{ module: "Sales Agent", create: "Manage Quotations", edit: "Manage Quotations", delete: "Manage Quotations", export: "Manage Quotations" }}
      fields={[
        { key: "quotationTitle", label: "Quotation Title" },
        { key: "servicePackageName", label: "Service/Package Name" },
        { key: "price", label: "Price", type: "number" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "terms", label: "Terms", type: "textarea" },
        { key: "validity", label: "Validity" },
        { key: "status", label: "Status", type: "select", options: ["Draft", "Sent", "Accepted", "Expired"] }
      ]}
    />
  );
}

export function CostTrackingScreen() {
  const store = useLocalStore();
  return (
    <EntityManager<CostTracking>
      title="Cost Tracking"
      description="Create, update, delete, search, filter, export, and review food-cost margin records."
      records={store.costs}
      onCreate={(record) => CostTrackingService.create(record)}
      onUpdate={CostTrackingService.update}
      onDelete={CostTrackingService.delete}
      permissions={{ module: "Profit Analysis", create: "Edit Cost", edit: "Edit Cost", delete: "Edit Cost", import: "Import Data", export: "Export Reports" }}
      fields={[
        { key: "itemName", label: "Item Name" },
        { key: "sellingPrice", label: "Selling Price", type: "number" },
        { key: "foodCost", label: "Food Cost", type: "number" },
        { key: "grossMargin", label: "Gross Margin", type: "number" },
        { key: "marginPercentage", label: "Margin Percentage", type: "number" },
        { key: "status", label: "Status", type: "select", options: ["Healthy", "Review", "Critical"] }
      ]}
    />
  );
}

export function WastageTrackingScreen() {
  const store = useLocalStore();
  return (
    <EntityManager<WastageEntry>
      title="Wastage Tracking"
      description="Create, edit, delete, filter, export, and analyze wastage records."
      records={store.wastage}
      onCreate={(record) => WastageTrackingService.create(record)}
      onUpdate={WastageTrackingService.update}
      onDelete={WastageTrackingService.delete}
      permissions={{ module: "Profit Analysis", create: "Edit Wastage", edit: "Edit Wastage", delete: "Edit Wastage", import: "Import Data", export: "Export Reports" }}
      fields={[
        { key: "date", label: "Date", type: "date" },
        { key: "itemName", label: "Item Name" },
        { key: "quantityWasted", label: "Quantity Wasted", type: "number" },
        { key: "reason", label: "Reason", type: "select", options: ["Spoilage", "Overproduction", "Kitchen Error", "Expired"] },
        { key: "estimatedCostLoss", label: "Estimated Cost Loss", type: "number" },
        { key: "staffNote", label: "Staff Note", type: "textarea" }
      ]}
    />
  );
}

export function FollowUpRuleScreen() {
  const store = useLocalStore();
  return (
    <EntityManager<FollowUpRule>
      title="Follow-Up Automation"
      description="Create, edit, delete, search, filter, export, and status-manage automation rules."
      records={store.rules}
      onCreate={(record) => FollowUpRuleService.create(record)}
      onUpdate={FollowUpRuleService.update}
      onDelete={FollowUpRuleService.delete}
      permissions={{ module: "Sales Agent", create: "Manage Rules", edit: "Manage Rules", delete: "Manage Rules" }}
      fields={[
        { key: "ruleName", label: "Rule Name" },
        { key: "triggerCondition", label: "Trigger Condition", type: "select", options: ["No response after first contact", "Quotation sent but not accepted", "Follow-up date reached", "Lead marked interested", "Conversation needs human reply", "Custom trigger"] },
        { key: "delayTime", label: "Delay Time", type: "select", options: ["Immediate", "15 minutes", "1 hour", "4 hours", "1 day", "3 days", "1 week"] },
        { key: "template", label: "Template", type: "select", options: ["Friendly reminder", "Quotation follow-up", "Availability confirmation", "Need more details", "Escalation notice", "Custom template"] },
        { key: "leadStatus", label: "Lead Status", type: "select", options: ["New", "Contacted", "Follow-up", "Interested", "Converted", "Lost"] },
        { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }
      ]}
    />
  );
}

export function HandoffManagementScreen() {
  const store = useLocalStore();
  const userNameById = Object.fromEntries(store.users.map((user) => [user.id, user.name]));
  const assigneeOptions = store.users.map((user) => user.id);
  return (
    <EntityManager<HandoffRequest>
      title="Human Handoff"
      description="Create, assign, close, search, filter, export, and manage AI-to-human handoff requests."
      records={store.handoffs}
      onCreate={(record) => HandoffService.create({ ...record, assignedUserId: record.assignedStaff })}
      onUpdate={HandoffService.update}
      onDelete={HandoffService.delete}
      permissions={{ module: "Sales Agent", create: "Assign Conversation", edit: "Assign Conversation", delete: "Assign Conversation" }}
      fields={[
        { key: "customerName", label: "Customer Name", tableClassName: "w-[15%]" },
        { key: "reason", label: "Reason" },
        { key: "conversationSummary", label: "Conversation Summary", type: "textarea", tableClassName: "w-[28%]" },
        {
          key: "assignedStaff",
          label: "Assigned To",
          type: "select",
          options: assigneeOptions,
          tableClassName: "w-[14%]",
          renderValue: (value) => userNameById[value] ?? value
        },
        { key: "assignedUserId", label: "Assigned User ID", type: "select", options: assigneeOptions, hideOnCreate: true, hideInTable: true },
        { key: "status", label: "Status", type: "select", options: ["Pending", "In Progress", "Closed"], tableClassName: "w-[11%]" }
      ]}
    />
  );
}

export function ProductPerformanceScreen() {
  const store = useLocalStore();
  return (
    <EntityManager<MenuItemPerformance>
      title="Product Performance"
      description="Create, edit, delete, search, filter, export, and review menu item performance records."
      records={store.productPerformance}
      onCreate={(record) => ProductPerformanceService.create(record)}
      onUpdate={ProductPerformanceService.update}
      onDelete={ProductPerformanceService.delete}
      permissions={{ module: "Profit Analysis", create: "Import Data", edit: "View Analytics", delete: "Import Data", import: "Import Data", export: "Export Reports" }}
      fields={[
        { key: "itemName", label: "Item Name" },
        { key: "category", label: "Category" },
        { key: "quantitySold", label: "Quantity Sold", type: "number" },
        { key: "revenue", label: "Revenue", type: "number" },
        { key: "foodCost", label: "Food Cost", type: "number" },
        { key: "profitMargin", label: "Profit Margin", type: "number" },
        { key: "performanceStatus", label: "Performance Status", type: "select", options: ["Best Seller", "Healthy", "Low Margin", "Slow Moving"] }
      ]}
    />
  );
}

export function ImportHistoryScreen() {
  const store = useLocalStore();
  return (
    <EntityManager
      title="Import History"
      description="Manage imports, validation errors, statuses, and export audit logs."
      records={store.imports}
      onCreate={(record) => ImportService.create(record)}
      onUpdate={ImportService.update}
      onDelete={ImportService.delete}
      permissions={{ module: "Profit Analysis", create: "Import Data", edit: "Import Data", delete: "Import Data", export: "Export Reports" }}
      fields={[
        { key: "importDate", label: "Import Date", type: "date" },
        { key: "importedBy", label: "Imported By" },
        { key: "sourceType", label: "Source Type" },
        { key: "rowsImported", label: "Rows Imported", type: "number" },
        { key: "rowsFailed", label: "Rows Failed", type: "number" },
        { key: "status", label: "Status", type: "select", options: ["Draft", "Validated", "Imported", "Failed"] }
      ]}
    />
  );
}
