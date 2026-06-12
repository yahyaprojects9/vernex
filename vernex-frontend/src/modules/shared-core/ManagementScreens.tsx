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
} from "@/lib/services";
import type { CostTracking, FollowUpRule, HandoffRequest, Lead, MenuItemPerformance, Quotation, WastageEntry } from "@/types";

export function UserManagementScreen() {
  const store = useLocalStore();
  return (
    <EntityManager
      title="User Management"
      description="Create, edit, delete, search, filter, bulk select, and export users with role, branch, and department assignments."
      records={store.users}
      onCreate={(record) => UserService.create(record)}
      onUpdate={UserService.update}
      onDelete={UserService.delete}
      fields={[
        { key: "name", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "roleId", label: "Role", type: "select", options: store.roles.map((role) => role.id) },
        { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
        { key: "companyName", label: "Company" },
        { key: "companySize", label: "Company Size" },
        { key: "industry", label: "Industry" }
      ]}
    />
  );
}

export function BranchManagementScreen() {
  const store = useLocalStore();
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
        onCreate={(record) => BranchService.create(record)}
        onUpdate={BranchService.update}
        onDelete={BranchService.delete}
        fields={[
          { key: "name", label: "Branch Name" },
          { key: "city", label: "City" },
          { key: "country", label: "Country" },
          { key: "managerId", label: "Manager", type: "select", options: store.users.map((user) => user.id) },
          { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Planning"] }
        ]}
      />
    </div>
  );
}

export function DepartmentManagementScreen() {
  const store = useLocalStore();
  return (
    <EntityManager
      title="Department Management"
      description="Create departments, assign managers and users, manage visibility, and review department analytics."
      records={store.departments}
      onCreate={(record) => DepartmentService.create(record)}
      onUpdate={DepartmentService.update}
      onDelete={DepartmentService.delete}
      fields={[
        { key: "name", label: "Department Name" },
        { key: "managerId", label: "Manager", type: "select", options: store.users.map((user) => user.id) },
        { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }
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
      fields={[
        { key: "ruleName", label: "Rule Name" },
        { key: "triggerCondition", label: "Trigger Condition" },
        { key: "delayTime", label: "Delay Time" },
        { key: "template", label: "Template" },
        { key: "leadStatus", label: "Lead Status", type: "select", options: ["New", "Contacted", "Follow-up", "Interested", "Converted", "Lost"] },
        { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }
      ]}
    />
  );
}

export function HandoffManagementScreen() {
  const store = useLocalStore();
  return (
    <EntityManager<HandoffRequest>
      title="Human Handoff"
      description="Create, assign, close, search, filter, export, and manage AI-to-human handoff requests."
      records={store.handoffs}
      onCreate={(record) => HandoffService.create(record)}
      onUpdate={HandoffService.update}
      onDelete={HandoffService.delete}
      fields={[
        { key: "customerName", label: "Customer Name" },
        { key: "reason", label: "Reason" },
        { key: "conversationSummary", label: "Conversation Summary", type: "textarea" },
        { key: "assignedStaff", label: "Assigned Staff" },
        { key: "status", label: "Status", type: "select", options: ["Pending", "In Progress", "Closed"] }
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
