"use client";

import { useMemo, useState } from "react";
import { Building2, CalendarClock, CheckCircle2, Flame, FileText, MapPin, Users } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { EntityManager } from "@/modules/shared-core/EntityManager";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import { Select } from "@/components/ui/Input";
import { DateInput } from "@/components/ui/DateInput";
import {
  BranchService,
  DepartmentService,
  ImportService,
  LeadService,
  QuotationService,
  CostTrackingService,
  WastageTrackingService,
  FollowUpRuleService,
  HandoffService,
  SalesWorkflowService,
  ProductPerformanceService
  ,OrganizationService
  ,AuthService
} from "@/lib/services";
import type { CostTracking, FollowUpRule, HandoffRequest, Lead, MenuItemPerformance, Quotation, WastageEntry } from "@/types";
import { branchSchema, departmentSchema } from "@/schemas/organization";

const leadStatusOptions = ["New", "Contacted", "Follow-up", "Quotation Sent", "Interested", "Converted", "Lost"];

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
        records={store.branches}
        onCreate={(record) => BranchService.create({ ...record, status: "Active", city: record.location ?? "", country: "", createdAt: new Date().toISOString() })}
        onUpdate={BranchService.update}
        onDelete={BranchService.delete}
        allowSelection={false}
        showHeading={false}
        actionMenu
        additionalFilterKeys={["managerId", "location"]}
        searchPlaceholder="Search branch"
        permissions={{ module: "Organization", create: "Edit Branches", edit: "Edit Branches", delete: "Edit Branches" }}
        validate={(payload) => {
          const result = branchSchema.safeParse(payload);
          return result.success ? null : result.error.issues[0]?.message ?? "Invalid branch details.";
        }}
        fields={[
          { key: "name", label: "Branch Name" },
          { key: "code", label: "Branch Code" },
          { key: "location", label: "Location" },
          { key: "managerId", label: "Assigned Manager", type: "select", options: managers.map((user) => user.id), optionLabels: Object.fromEntries(managers.map((user) => [user.id, user.name])), renderValue: (value) => managers.find((user) => user.id === value)?.name ?? value },
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
  const creator = AuthService.currentUser();
  const departmentManagers = creator && !managers.some((user) => user.id === creator.id) ? [creator, ...managers] : managers;
  return (
    <EntityManager
      title="Department Management"
      records={store.departments}
      onCreate={(record) => OrganizationService.createDepartment({ ...record, managerId: creator?.id ?? record.managerId, status: "Active", createdAt: new Date().toISOString() })}
      onUpdate={OrganizationService.updateDepartment}
      onDelete={DepartmentService.delete}
      allowSelection={false}
      showHeading={false}
      actionMenu
      additionalFilterKeys={["branchId", "managerId"]}
      searchPlaceholder="Search department"
      permissions={{ module: "Organization", create: "Edit Departments", edit: "Edit Departments", delete: "Edit Departments" }}
      validate={(payload) => {
        const result = departmentSchema.safeParse(payload);
        return result.success ? null : result.error.issues[0]?.message ?? "Invalid department details.";
      }}
      fields={[
        { key: "name", label: "Department Name" },
        { key: "branchId", label: "Branch", type: "select", options: store.branches.map((branch) => branch.id), optionLabels: Object.fromEntries(store.branches.map((branch) => [branch.id, branch.name])), renderValue: (value) => store.branches.find((branch) => branch.id === value)?.name ?? value },
        { key: "managerId", label: "Manager", type: "select", options: departmentManagers.map((user) => user.id), optionLabels: Object.fromEntries(departmentManagers.map((user) => [user.id, user.name])), hideOnCreate: true, defaultOnCreate: creator?.id ?? "", renderValue: (value) => store.users.find((user) => user.id === value)?.name ?? value },
        { key: "description", label: "Description", type: "textarea" },
        { key: "memberIds", label: "Department Members", type: "multiselect", options: store.users.map((user) => user.id), optionLabels: Object.fromEntries(store.users.map((user) => [user.id, user.name])), renderValue: (value, record) => String((record.memberIds as string[])?.length ?? 0) },
        { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Suspended"], hideOnCreate: true, defaultOnCreate: "Active" }
      ]}
    />
  );
}

export function LeadManagementScreen() {
  const store = useLocalStore();
  const [sourceFilter, setSourceFilter] = useState("All");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const assignableUsers = useMemo(() => store.users.filter((user) => ["sales-executive", "staff"].includes(user.roleId)), [store.users]);
  const userLabels = useMemo(() => Object.fromEntries(assignableUsers.map((user) => [user.id, user.name])), [assignableUsers]);
  const filteredLeads = useMemo(() => store.leads.filter((lead) => {
    const matchesSource = sourceFilter === "All" || lead.source === sourceFilter;
    const matchesScore = scoreFilter === "All" || lead.leadScore === scoreFilter;
    const matchesAssignee = assigneeFilter === "All" || lead.assignedUserId === assigneeFilter || lead.assignedStaff === userLabels[assigneeFilter];
    const followUpDate = lead.nextFollowUp || "";
    const matchesFrom = !fromDate || Boolean(followUpDate && followUpDate >= fromDate);
    const matchesTo = !toDate || Boolean(followUpDate && followUpDate <= toDate);
    return matchesSource && matchesScore && matchesAssignee && matchesFrom && matchesTo;
  }), [assigneeFilter, fromDate, scoreFilter, sourceFilter, store.leads, toDate, userLabels]);
  const followUpDue = filteredLeads.filter((lead) => Boolean(lead.nextFollowUp) && !["Converted", "Lost"].includes(lead.status) && new Date(`${lead.nextFollowUp}T23:59:59`).getTime() <= Date.now()).length;
  const resolveAssignee = (record: Lead) => {
    const user = assignableUsers.find((candidate) =>
      candidate.id === record.assignedUserId || candidate.name.toLowerCase() === String(record.assignedUserId ?? record.assignedStaff ?? "").toLowerCase()
    );
    return {
      ...record,
      assignedUserId: user?.id,
      assignedStaff: user?.name ?? record.assignedStaff ?? String(record.assignedUserId ?? ""),
      branchId: user?.branchIds[0],
      departmentId: user?.departmentIds[0]
    };
  };
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Leads" value={String(filteredLeads.length)} helper="Current filter scope" icon={Users} />
        <StatCard label="Hot Leads" value={String(filteredLeads.filter((lead) => lead.leadScore === "Hot").length)} helper="High intent" icon={Flame} />
        <StatCard label="Follow-up Due" value={String(followUpDue)} helper="Due or overdue" icon={CalendarClock} />
        <StatCard label="Quotation Sent" value={String(filteredLeads.filter((lead) => lead.status === "Quotation Sent" || lead.quotationStatus === "Sent").length)} helper="Awaiting decision" icon={FileText} />
        <StatCard label="Converted Leads" value={String(filteredLeads.filter((lead) => lead.status === "Converted").length)} helper="Closed successfully" icon={CheckCircle2} />
      </div>
      <EntityManager<Lead>
        title="Lead Management"
        records={filteredLeads}
        onCreate={(record) => SalesWorkflowService.createLead(resolveAssignee(record))}
        onUpdate={(id, patch) => SalesWorkflowService.updateLead(id, resolveAssignee(patch as Lead))}
        onDelete={LeadService.delete}
        actionMenu
        tableFieldLimit={11}
        tableMinWidth="1780px"
        searchPlaceholder="Search leads by name, phone, source, status, score, assigned staff"
        extraFilters={
          <>
            <label className="space-y-1">
              <span className="text-sm font-medium">Source</span>
              <Select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)} className="min-h-11">
                <option>All</option>
                {["WhatsApp", "Instagram", "Website", "Email", "Manual"].map((source) => <option key={source}>{source}</option>)}
              </Select>
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Lead Score</span>
              <Select value={scoreFilter} onChange={(event) => setScoreFilter(event.target.value)} className="min-h-11">
                <option>All</option><option>Hot</option><option>Warm</option><option>Cold</option>
              </Select>
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Assigned Staff</span>
              <Select value={assigneeFilter} onChange={(event) => setAssigneeFilter(event.target.value)} className="min-h-11">
                <option>All</option>
                {assignableUsers.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
              </Select>
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Follow-up From</span>
              <DateInput value={fromDate} onValueChange={setFromDate} className="min-h-11" />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Follow-up To</span>
              <DateInput value={toDate} onValueChange={setToDate} className="min-h-11" />
            </label>
          </>
        }
        permissions={{ module: "Sales Agent", create: "Create Lead", edit: "Edit Lead", delete: "Delete Lead", export: "Export Leads", import: "Create Lead" }}
        fields={[
          { key: "leadName", label: "Lead Name", tableClassName: "w-[170px]" },
          { key: "phone", label: "Phone", tableClassName: "w-[130px]" },
          { key: "email", label: "Email", hideInTable: true },
          { key: "source", label: "Source", type: "select", options: ["WhatsApp", "Instagram", "Website", "Email", "Manual"], tableClassName: "w-[120px]" },
          { key: "businessName", label: "Business Name", hideInTable: true },
          { key: "requirement", label: "Requirement", type: "textarea", tableClassName: "w-[220px]" },
          { key: "interestedService", label: "Interested Service", type: "select", options: ["Website", "Digital Marketing", "Automation", "Restaurant Profit AI", "WhatsApp Sales Agent", "Other"], hideInTable: true },
          { key: "budget", label: "Budget", type: "number", tableClassName: "w-[110px]" },
          { key: "location", label: "Location", hideInTable: true },
          { key: "urgency", label: "Urgency", type: "select", options: ["Immediate", "This Week", "This Month", "Just Enquiry"], hideInTable: true },
          { key: "status", label: "Status", type: "select", options: leadStatusOptions, defaultOnCreate: "New", tableClassName: "w-[130px]" },
          { key: "leadScore", label: "Lead Score", type: "select", options: ["Hot", "Warm", "Cold"], tableClassName: "w-[110px]" },
          { key: "assignedUserId", label: "Assigned Staff", type: "select", options: assignableUsers.map((user) => user.id), optionLabels: userLabels, renderValue: (value) => userLabels[value] ?? value, tableClassName: "w-[150px]" },
          {
            key: "nextFollowUp",
            label: "Next Follow-up",
            type: "date",
            tableClassName: "w-[150px]",
            renderValue: (value, record) => {
              const isClosed = ["Converted", "Lost"].includes(String(record.status));
              const isOverdue = Boolean(value) && !isClosed && new Date(`${value}T23:59:59`).getTime() < Date.now();
              return <span className={isOverdue ? "font-semibold text-danger" : ""}>{value || "-"}{isOverdue ? " (Overdue)" : ""}</span>;
            }
          },
          { key: "quotationStatus", label: "Quotation", type: "select", options: ["Not Sent", "Sent", "Accepted", "Rejected"], defaultOnCreate: "Not Sent", tableClassName: "w-[120px]" },
          { key: "conversationMode", label: "Conversation", type: "select", options: ["AI Active", "Human Active"], defaultOnCreate: "AI Active", tableClassName: "w-[130px]" },
          { key: "lastContactedDate", label: "Last Contacted Date", type: "date", hideInTable: true },
          { key: "followUpCount", label: "Follow-up Count", type: "number", hideInTable: true },
          { key: "notes", label: "Notes", type: "textarea", hideInTable: true }
        ]}
      />
    </div>
  );
}

export function QuotationManagementScreen() {
  const store = useLocalStore();
  const eligibleLeads = store.leads.filter((lead) => ["Contacted", "Follow-up", "Interested", "Quotation Sent"].includes(lead.status));
  const leadLabels = Object.fromEntries(store.leads.map((lead) => [lead.id, lead.leadName]));
  return (
    <EntityManager<Quotation>
      title="Quotation Management"
      records={store.quotations}
      onCreate={(record) => SalesWorkflowService.createQuotation(record)}
      onUpdate={SalesWorkflowService.updateQuotation}
      onDelete={QuotationService.delete}
      actionMenu
      permissions={{ module: "Sales Agent", create: "Manage Quotations", edit: "Manage Quotations", delete: "Manage Quotations", export: "Manage Quotations" }}
      validate={(payload) => payload.leadId && eligibleLeads.some((lead) => lead.id === payload.leadId) ? null : "Select a contacted, follow-up, interested, or quotation-stage lead before creating the quotation."}
      fields={[
        { key: "leadId", label: "Lead", type: "select", options: eligibleLeads.map((lead) => lead.id), optionLabels: leadLabels, renderValue: (value) => leadLabels[value] ?? value },
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
      actionMenu
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
      actionMenu
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
  if (!store.quotations.some((quotation) => quotation.status === "Sent")) {
    return <div className="dashboard-surface p-6 text-sm text-muted-foreground">Send a quotation before configuring automated follow-ups.</div>;
  }
  return (
    <EntityManager<FollowUpRule>
      title="Follow-Up Automation"
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
        { key: "leadStatus", label: "Lead Status", type: "select", options: leadStatusOptions },
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
      records={store.handoffs}
      onCreate={(record) => {
        const lead = store.leads.find((item) => item.id === record.leadId);
        SalesWorkflowService.createHandoff({
          ...record,
          customerName: lead?.leadName ?? record.customerName,
          assignedUserId: record.assignedStaff,
          assignedStaff: userNameById[record.assignedStaff] ?? record.assignedStaff
        });
      }}
      onUpdate={HandoffService.update}
      onDelete={HandoffService.delete}
      validate={(payload) => payload.leadId && store.conversations.some((conversation) => conversation.leadId === payload.leadId) ? null : "Select a lead with an existing conversation."}
      permissions={{ module: "Sales Agent", create: "Assign Conversation", edit: "Assign Conversation", delete: "Assign Conversation" }}
      fields={[
        { key: "leadId", label: "Lead Conversation", type: "select", options: store.leads.filter((lead) => store.conversations.some((conversation) => conversation.leadId === lead.id)).map((lead) => lead.id), optionLabels: Object.fromEntries(store.leads.map((lead) => [lead.id, lead.leadName])), hideInTable: true },
        { key: "customerName", label: "Customer Name", tableClassName: "w-[15%]", hideOnCreate: true },
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
      actionMenu
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
