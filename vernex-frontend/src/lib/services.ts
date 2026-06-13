import permissionsConfig from "@/config/permissions.json";
import rolesConfig from "@/config/roles.json";
import settingsConfig from "@/config/settings.json";
import type {
  Conversation,
  CostTracking,
  FollowUpRule,
  HandoffRequest,
  Lead,
  MenuItemPerformance,
  MessageTemplate,
  ProfitReport,
  Quotation,
  SalesRecord,
  User,
  WastageEntry
} from "@/types";

export type Branch = {
  id: string;
  name: string;
  status: string;
  managerId: string;
  location?: string;
  description?: string;
  city: string;
  country: string;
};

export type Department = {
  id: string;
  name: string;
  managerId: string;
  status: string;
  description?: string;
};

export type RoleRecord = {
  id: string;
  name: string;
  level: number;
  description: string;
  canModifyPermissions: boolean;
  canModifyHierarchy: boolean;
  globalVisibility: boolean;
  readOnly?: boolean;
  permissions?: Record<string, string[]>;
};

export type ImportRecord = {
  id: string;
  importDate: string;
  importedBy: string;
  sourceType: string;
  rowsImported: number;
  rowsFailed: number;
  validationErrors: string[];
  status: "Draft" | "Validated" | "Imported" | "Failed";
};

export type StoredUser = User & {
  roleId: string;
  password: string;
  phone: string;
  companyName: string;
  companySize: string;
  industry: string;
  companyRegistrationNumber?: string;
  numberOfBranches?: string;
  team?: string;
  reportingManager?: string;
  managerId?: string;
  branchIds: string[];
  departmentIds: string[];
};

type StoreShape = {
  schemaVersion: number;
  users: StoredUser[];
  roles: RoleRecord[];
  branches: Branch[];
  departments: Department[];
  leads: Lead[];
  quotations: Quotation[];
  conversations: Conversation[];
  templates: MessageTemplate[];
  rules: FollowUpRule[];
  handoffs: HandoffRequest[];
  salesRecords: SalesRecord[];
  productPerformance: MenuItemPerformance[];
  costs: CostTracking[];
  wastage: WastageEntry[];
  reports: ProfitReport[];
  imports: ImportRecord[];
  settings: typeof settingsConfig;
  currentUserId: string | null;
};

const key = "vernex-platform-v4-empty";
const schemaVersion = 4;
let cachedStore: StoreShape | null = null;
let storeRevision = 0;
let visibleStoreCache: { cacheKey: string; store: StoreShape } | null = null;

const ownerPermissions = Object.fromEntries(
  permissionsConfig.map((group) => [group.module, group.permissions])
) as Record<string, string[]>;

const defaultRolePermissions: Record<string, Record<string, string[]>> = {
  manager: {
    "Shared Core": ["View Users", "View Branches", "View Departments"],
    "Sales Agent": ["View"],
    "Profit Analysis": ["View", "View Analytics"]
  },
  staff: {
    "Sales Agent": ["View", "Send Message"]
  },
  "sales-executive": {
    "Sales Agent": ["View", "Create Lead", "Edit Lead", "Export Leads", "Create Conversation", "Assign Conversation", "Send Message", "Manage Quotations", "Manage Rules"]
  },
  analyst: {
    "Profit Analysis": ["View", "View Analytics", "Generate Reports", "Export Reports"]
  },
  viewer: {}
};

const mockPassword = "Mock@12345";
const mockUsers: StoredUser[] = [
  {
    id: "MOCK-OWNER",
    name: "Mock Owner",
    email: "owner@vernex.local",
    password: mockPassword,
    phone: "",
    role: "Owner",
    roleId: "owner",
    status: "Active",
    lastActive: "Mock",
    companyName: "Vernex",
    companySize: "1-10",
    industry: "",
    branchIds: ["UAT-BRANCH-ANNA", "UAT-BRANCH-VELACHERY"],
    departmentIds: ["UAT-DEPT-SALES", "UAT-DEPT-PROFIT"]
  },
  {
    id: "MOCK-MANAGER",
    name: "Mock Manager",
    email: "manager@vernex.local",
    password: mockPassword,
    phone: "",
    role: "Admin",
    roleId: "manager",
    status: "Active",
    lastActive: "Mock",
    companyName: "Vernex",
    companySize: "1-10",
    industry: "",
    branchIds: ["UAT-BRANCH-ANNA"],
    departmentIds: ["UAT-DEPT-SALES"]
  },
  {
    id: "MOCK-ADMIN",
    name: "Mock Admin",
    email: "admin@vernex.local",
    password: mockPassword,
    phone: "",
    role: "Admin",
    roleId: "admin",
    status: "Active",
    lastActive: "Mock",
    companyName: "Vernex",
    companySize: "1-10",
    industry: "",
    branchIds: ["UAT-BRANCH-ANNA", "UAT-BRANCH-VELACHERY"],
    departmentIds: ["UAT-DEPT-SALES", "UAT-DEPT-PROFIT"]
  },
  {
    id: "MOCK-STAFF",
    name: "Mock Staff",
    email: "staff@vernex.local",
    password: mockPassword,
    phone: "",
    role: "Staff",
    roleId: "staff",
    status: "Active",
    lastActive: "Mock",
    companyName: "Vernex",
    companySize: "1-10",
    industry: "",
    managerId: "MOCK-MANAGER",
    branchIds: ["UAT-BRANCH-ANNA"],
    departmentIds: ["UAT-DEPT-SALES"]
  },
  {
    id: "MOCK-SALES",
    name: "Mock Sales Executive",
    email: "sales@vernex.local",
    password: mockPassword,
    phone: "",
    role: "Staff",
    roleId: "sales-executive",
    status: "Active",
    lastActive: "Mock",
    companyName: "Vernex",
    companySize: "1-10",
    industry: "",
    managerId: "MOCK-MANAGER",
    branchIds: ["UAT-BRANCH-ANNA"],
    departmentIds: ["UAT-DEPT-SALES"]
  },
  {
    id: "MOCK-ANALYST",
    name: "Mock Analyst",
    email: "analyst@vernex.local",
    password: mockPassword,
    phone: "",
    role: "Staff",
    roleId: "analyst",
    status: "Active",
    lastActive: "Mock",
    companyName: "Vernex",
    companySize: "1-10",
    industry: "",
    branchIds: ["UAT-BRANCH-VELACHERY"],
    departmentIds: ["UAT-DEPT-PROFIT"]
  }
];

const demoUsers: StoredUser[] = [
  {
    id: "UAT-MANAGER-MEERA",
    name: "Meera Manager",
    email: "meera.manager@test.com",
    password: "Test@12345",
    phone: "9876500001",
    role: "Admin",
    roleId: "manager",
    status: "Active",
    lastActive: "UAT",
    companyName: "Vernex Test Foods",
    companySize: "51-200",
    industry: "Restaurant Operations",
    team: "Operations",
    branchIds: ["UAT-BRANCH-ANNA"],
    departmentIds: ["UAT-DEPT-SALES"]
  },
  {
    id: "UAT-STAFF-ARUN",
    name: "Arun Staff",
    email: "arun.staff@test.com",
    password: "Test@12345",
    phone: "9876500002",
    role: "Staff",
    roleId: "staff",
    status: "Active",
    lastActive: "UAT",
    companyName: "Vernex Test Foods",
    companySize: "51-200",
    industry: "Restaurant Operations",
    team: "Sales Team",
    managerId: "UAT-MANAGER-MEERA",
    branchIds: ["UAT-BRANCH-ANNA"],
    departmentIds: ["UAT-DEPT-SALES"]
  },
  {
    id: "UAT-SALES-NISHA",
    name: "Nisha Sales",
    email: "nisha.sales@test.com",
    password: "Test@12345",
    phone: "9876500003",
    role: "Staff",
    roleId: "sales-executive",
    status: "Active",
    lastActive: "UAT",
    companyName: "Vernex Test Foods",
    companySize: "51-200",
    industry: "Restaurant Operations",
    team: "Sales Team",
    managerId: "UAT-MANAGER-MEERA",
    branchIds: ["UAT-BRANCH-ANNA"],
    departmentIds: ["UAT-DEPT-SALES"]
  },
  {
    id: "UAT-ANALYST-DEV",
    name: "Dev Analyst",
    email: "dev.analyst@test.com",
    password: "Test@12345",
    phone: "9876500004",
    role: "Staff",
    roleId: "analyst",
    status: "Active",
    lastActive: "UAT",
    companyName: "Vernex Test Foods",
    companySize: "51-200",
    industry: "Restaurant Operations",
    team: "Profit Analysis Team",
    branchIds: ["UAT-BRANCH-VELACHERY"],
    departmentIds: ["UAT-DEPT-PROFIT"]
  }
];

const demoBranches: Branch[] = [
  {
    id: "UAT-BRANCH-ANNA",
    name: "Anna Nagar Branch",
    status: "Active",
    managerId: "UAT-MANAGER-MEERA",
    location: "Anna Nagar Chennai",
    description: "Primary dine-in and delivery branch",
    city: "Chennai",
    country: "India"
  },
  {
    id: "UAT-BRANCH-VELACHERY",
    name: "Velachery Branch",
    status: "Active",
    managerId: "UAT-MANAGER-MEERA",
    location: "Velachery Chennai",
    description: "Secondary outlet",
    city: "Chennai",
    country: "India"
  }
];

const demoDepartments: Department[] = [
  {
    id: "UAT-DEPT-SALES",
    name: "Sales Team",
    managerId: "UAT-MANAGER-MEERA",
    status: "Active",
    description: "Handles leads conversations quotations and follow-ups"
  },
  {
    id: "UAT-DEPT-PROFIT",
    name: "Profit Analysis Team",
    managerId: "UAT-ANALYST-DEV",
    status: "Active",
    description: "Handles imports costs wastage and reporting"
  }
];

const demoLeads: Lead[] = [
  {
    id: "UAT-LEAD-KARTHIK",
    leadName: "Karthik Wedding Enquiry",
    phone: "9888800011",
    source: "WhatsApp",
    requirement: "Wedding catering for evening reception",
    budget: 180000,
    location: "Anna Nagar Chennai",
    status: "New",
    leadScore: "Hot",
    assignedStaff: "Nisha Sales",
    assignedUserId: "UAT-SALES-NISHA",
    branchId: "UAT-BRANCH-ANNA",
    departmentId: "UAT-DEPT-SALES",
    nextFollowUp: "2026-06-14",
    notes: "Premium buffet enquiry with high purchase intent"
  },
  {
    id: "UAT-LEAD-CORPORATE",
    leadName: "Corporate Lunch Lead",
    phone: "9888800022",
    source: "Website",
    requirement: "Corporate lunch for 80 people",
    budget: 60000,
    location: "Velachery Chennai",
    status: "Interested",
    leadScore: "Warm",
    assignedStaff: "Arun Staff",
    assignedUserId: "UAT-STAFF-ARUN",
    branchId: "UAT-BRANCH-ANNA",
    departmentId: "UAT-DEPT-SALES",
    nextFollowUp: "2026-06-15",
    notes: "Needs menu confirmation and quotation follow-up"
  }
];

const demoQuotations: Quotation[] = [
  {
    id: "UAT-QUOTE-WEDDING",
    quotationTitle: "Wedding Catering Quote",
    servicePackageName: "Premium Buffet Package",
    price: 180000,
    description: "Premium buffet catering package for Karthik Wedding Enquiry",
    terms: "50% advance payment. Final guest count due 48 hours before service.",
    validity: "2026-06-30",
    status: "Draft"
  }
];

const demoConversations: Conversation[] = [
  {
    id: "UAT-CONV-KARTHIK",
    customerName: "Karthik Wedding Enquiry",
    channel: "WhatsApp",
    lastMessage: "Please share the premium buffet quotation and availability.",
    mode: "AI",
    messageHistory: [
      { id: "UAT-MSG-1", sender: "customer", body: "Need catering for a wedding reception.", time: "2026-06-13 10:00" },
      { id: "UAT-MSG-2", sender: "ai", body: "Please share date, location, guest count, and preferred menu so we can confirm availability.", time: "2026-06-13 10:01" }
    ],
    internalNotes: "Attach quotation before handoff if customer confirms date.",
    leadId: "UAT-LEAD-KARTHIK",
    assignedUserId: "UAT-SALES-NISHA",
    branchId: "UAT-BRANCH-ANNA",
    departmentId: "UAT-DEPT-SALES"
  }
];

const demoFollowUpRules: FollowUpRule[] = [
  {
    id: "UAT-RULE-QUOTE-24H",
    ruleName: "Quotation Follow-up 24h",
    category: "Quotation Requests",
    triggerCondition: "Quotation sent but not accepted",
    condition: "Send a polite reminder if no response is received within one day",
    constraintType: "None",
    constraintValue: "",
    response: "We are checking whether you need any changes to the quotation.",
    fallback: "A team member will follow up if the customer asks for custom changes.",
    priority: 6,
    delayTime: "1 day",
    template: "Quotation follow-up",
    leadStatus: "Follow-up",
    status: "Active",
    createdBy: "MOCK-OWNER"
  },
  {
    id: "UAT-RULE-QUOTE-MIN-BUDGET",
    ruleName: "Quotation Request Auto Reply",
    category: "Quotation Requests",
    triggerCondition: "Customer asks for a quotation",
    condition: "Only auto-quote when the minimum budget constraint is met",
    constraintType: "Minimum Budget",
    constraintValue: "25000",
    response: "We can prepare a quotation once the requirement meets the configured minimum budget.",
    fallback: "This request is below the configured quotation threshold. I can collect details or transfer it for manual review.",
    priority: 7,
    delayTime: "Immediate",
    template: "Quotation qualification",
    leadStatus: "Interested",
    status: "Active",
    createdBy: "MOCK-OWNER"
  }
];

const demoHandoffs: HandoffRequest[] = [
  {
    id: "UAT-HANDOFF-KARTHIK",
    customerName: "Karthik Wedding Enquiry",
    reason: "Quotation approval and negotiation",
    conversationSummary: "Customer requested wedding catering quotation and availability confirmation.",
    assignedStaff: "UAT-SALES-NISHA",
    assignedUserId: "UAT-SALES-NISHA",
    leadId: "UAT-LEAD-KARTHIK",
    status: "Pending"
  }
];

const demoSalesRecords: SalesRecord[] = [
  {
    id: "UAT-SALE-BILL-001",
    date: "2026-06-13",
    billNumber: "BILL-001",
    itemName: "Premium Buffet",
    category: "Catering",
    quantity: 1,
    sellingPrice: 180000,
    totalAmount: 180000,
    orderSource: "Dine-in",
    time: "19:30",
    branchId: "UAT-BRANCH-ANNA",
    departmentId: "UAT-DEPT-PROFIT",
    assignedUserId: "UAT-ANALYST-DEV"
  },
  {
    id: "UAT-SALE-BILL-002",
    date: "2026-06-13",
    billNumber: "BILL-002",
    itemName: "Corporate Lunch",
    category: "Meals",
    quantity: 80,
    sellingPrice: 750,
    totalAmount: 60000,
    orderSource: "Takeaway",
    time: "13:00",
    branchId: "UAT-BRANCH-ANNA",
    departmentId: "UAT-DEPT-PROFIT",
    assignedUserId: "UAT-ANALYST-DEV"
  },
  {
    id: "UAT-SALE-BILL-003",
    date: "2026-06-14",
    billNumber: "BILL-003",
    itemName: "Delivery Dinner Combo",
    category: "Meals",
    quantity: 30,
    sellingPrice: 500,
    totalAmount: 15000,
    orderSource: "Swiggy",
    time: "20:00",
    branchId: "UAT-BRANCH-VELACHERY",
    departmentId: "UAT-DEPT-PROFIT",
    assignedUserId: "UAT-ANALYST-DEV"
  },
  {
    id: "UAT-SALE-SWG-001",
    date: "2026-06-15",
    billNumber: "SWG-001",
    itemName: "Family Meal Box",
    category: "Meals",
    quantity: 5,
    sellingPrice: 1200,
    totalAmount: 6000,
    orderSource: "Swiggy",
    time: "20:45",
    branchId: "UAT-BRANCH-VELACHERY",
    departmentId: "UAT-DEPT-PROFIT",
    assignedUserId: "UAT-ANALYST-DEV"
  },
  {
    id: "UAT-SALE-SWG-002",
    date: "2026-06-15",
    billNumber: "SWG-002",
    itemName: "Dinner Combo",
    category: "Meals",
    quantity: 3,
    sellingPrice: 800,
    totalAmount: 2400,
    orderSource: "Swiggy",
    time: "21:15",
    branchId: "UAT-BRANCH-VELACHERY",
    departmentId: "UAT-DEPT-PROFIT",
    assignedUserId: "UAT-ANALYST-DEV"
  }
];

const demoProductPerformance: MenuItemPerformance[] = [
  {
    id: "UAT-PRODUCT-PREMIUM-BUFFET",
    itemName: "Premium Buffet",
    category: "Catering",
    quantitySold: 1,
    revenue: 180000,
    foodCost: 95000,
    profitMargin: 85000,
    performanceStatus: "Best Seller"
  },
  {
    id: "UAT-PRODUCT-CORPORATE-LUNCH",
    itemName: "Corporate Lunch",
    category: "Meals",
    quantitySold: 80,
    revenue: 60000,
    foodCost: 36000,
    profitMargin: 24000,
    performanceStatus: "Healthy"
  }
];

const demoCosts: CostTracking[] = [
  {
    id: "UAT-COST-PREMIUM-BUFFET",
    itemName: "Premium Buffet",
    sellingPrice: 180000,
    foodCost: 95000,
    grossMargin: 85000,
    marginPercentage: 47.22,
    status: "Healthy"
  }
];

const demoWastage: WastageEntry[] = [
  {
    id: "UAT-WASTE-RICE",
    date: "2026-06-13",
    itemName: "Rice",
    quantityWasted: 8,
    reason: "Overproduction",
    estimatedCostLoss: 1200,
    staffNote: "Overproduction during dinner prep"
  }
];

const demoReports: ProfitReport[] = [
  {
    id: "UAT-REPORT-DAILY-2026-06-13",
    period: "Daily",
    salesSummary: "2026-06-13 to 2026-06-15 revenue is generated from Premium Buffet, Corporate Lunch, and Swiggy orders.",
    bestWorstItems: "Best seller: Premium Buffet. Healthy performer: Corporate Lunch.",
    foodCostSummary: "Premium Buffet selling price 180000, food cost 95000, margin 85000.",
    wastageSummary: "Rice wastage logged with estimated loss 1200 due to overproduction.",
    peakHourSummary: "Strongest hours are 19:30 to 21:15 based on stored sales rows.",
    aiRecommendations: "Follow up on the wedding quotation and monitor delivery dinner demand.",
    ownerActionPoints: "Review quotation conversion, confirm buffet capacity, and reduce rice overproduction."
  }
];

const demoImports: ImportRecord[] = [
  {
    id: "UAT-IMPORT-MANUAL-SALES",
    importDate: "2026-06-13",
    importedBy: "Mock Owner",
    sourceType: "Manual Entry",
    rowsImported: 3,
    rowsFailed: 0,
    validationErrors: [],
    status: "Imported"
  },
  {
    id: "UAT-IMPORT-SWIGGY",
    importDate: "2026-06-15",
    importedBy: "Dev Analyst",
    sourceType: "Swiggy",
    rowsImported: 2,
    rowsFailed: 0,
    validationErrors: [],
    status: "Imported"
  }
];

const defaultAiRules: FollowUpRule[] = [
  {
    id: "FAQ-DISCOUNT-LIMIT",
    ruleName: "Discount limit response",
    category: "Discount",
    triggerCondition: "Customer asks for a discount above the approved limit",
    condition: "Compare requested discount against configured maximum",
    constraintType: "Maximum Discount %",
    constraintValue: "15",
    response: "We can support the approved discount range for this request.",
    fallback: "That request is above the configured discount limit. I can offer the approved limit or escalate this for special approval.",
    priority: 1,
    delayTime: "Immediate",
    template: "Discount threshold response",
    leadStatus: "Interested",
    status: "Active"
  },
  {
    id: "FAQ-AVAILABILITY",
    ruleName: "Availability check",
    category: "Availability",
    triggerCondition: "Customer asks whether a date, slot, product, or service is available",
    condition: "Ask for date, location, quantity, and required service details",
    constraintType: "None",
    constraintValue: "",
    response: "Please share the date, location, quantity, and requirement details so we can confirm availability.",
    fallback: "If availability cannot be confirmed automatically, transfer the conversation to a team member.",
    priority: 2,
    delayTime: "Immediate",
    template: "Availability qualification",
    leadStatus: "New",
    status: "Active"
  },
  {
    id: "FAQ-ORDER-LIMIT",
    ruleName: "Order quantity limit",
    category: "Lead Qualification",
    triggerCondition: "Customer asks for a quantity above operational capacity",
    condition: "Compare requested quantity with configured capacity",
    constraintType: "Maximum Order Quantity",
    constraintValue: "100",
    response: "We can support this request within the configured capacity.",
    fallback: "This request is above our configured capacity. I can offer the supported quantity or escalate for manual review.",
    priority: 3,
    delayTime: "Immediate",
    template: "Quantity threshold response",
    leadStatus: "Interested",
    status: "Active"
  },
  {
    id: "FAQ-BUSINESS-HOURS",
    ruleName: "Business hours reply",
    category: "Business Hours",
    triggerCondition: "Customer asks for support outside working hours",
    condition: "Compare current time with configured working hours",
    constraintType: "Business Hours",
    constraintValue: "10:00 AM - 11:00 PM",
    response: "Our team is available during working hours and will assist you in that window.",
    fallback: "We received your request outside working hours. A team member will follow up when support resumes.",
    priority: 4,
    delayTime: "Immediate",
    template: "Business hours response",
    leadStatus: "Contacted",
    status: "Active"
  },
  {
    id: "FAQ-HANDOFF",
    ruleName: "Escalation and human handoff",
    category: "Escalation",
    triggerCondition: "Customer asks for refund, complaint handling, custom approval, or sensitive negotiation",
    condition: "Escalate when request requires human judgement",
    constraintType: "Escalation Threshold",
    constraintValue: "Manual approval required",
    response: "I will connect this request to the right team member for review.",
    fallback: "This needs manual approval. I have marked it for human handoff.",
    priority: 5,
    delayTime: "Immediate",
    template: "Escalation response",
    leadStatus: "Follow-up",
    status: "Active"
  }
];

const initialStore: StoreShape = {
  schemaVersion,
  users: [...mockUsers, ...demoUsers],
  roles: (rolesConfig as RoleRecord[]).map((role) => ({
    ...role,
    permissions:
      role.id === "owner"
        ? ownerPermissions
        : role.id === "admin"
          ? Object.fromEntries(permissionsConfig.map((group) => [group.module, group.permissions.filter((permission) => permission.startsWith("View"))]))
          : defaultRolePermissions[role.id] ?? {}
  })),
  branches: demoBranches,
  departments: demoDepartments,
  leads: demoLeads,
  quotations: demoQuotations,
  conversations: demoConversations,
  templates: [],
  rules: [...defaultAiRules, ...demoFollowUpRules],
  handoffs: demoHandoffs,
  salesRecords: demoSalesRecords,
  productPerformance: demoProductPerformance,
  costs: demoCosts,
  wastage: demoWastage,
  reports: demoReports,
  imports: demoImports,
  settings: settingsConfig,
  currentUserId: null
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function appendMissingById<T extends { id: string }>(current: T[], defaults: T[]) {
  const existingIds = new Set(current.map((item) => item.id));
  return [...current, ...defaults.filter((item) => !existingIds.has(item.id))];
}

function withRuntimeDefaults(store: StoreShape): StoreShape {
  const next = clone(store);
  next.users = appendMissingById(next.users, [...mockUsers, ...demoUsers]).map((user) => {
    const seeded = [...mockUsers, ...demoUsers].find((item) => item.id === user.id);
    if (!seeded) return user;
    return {
      ...seeded,
      ...user,
      branchIds: user.branchIds?.length ? user.branchIds : seeded.branchIds,
      departmentIds: user.departmentIds?.length ? user.departmentIds : seeded.departmentIds,
      managerId: user.managerId ?? seeded.managerId
    };
  });
  next.roles = next.roles.map((role) => {
    if (role.id === "owner") return { ...role, permissions: role.permissions && Object.keys(role.permissions).length ? role.permissions : ownerPermissions };
    if (role.id === "admin") {
      return {
        ...role,
        readOnly: true,
        permissions: role.permissions && Object.keys(role.permissions).length
          ? role.permissions
          : Object.fromEntries(permissionsConfig.map((group) => [group.module, group.permissions.filter((permission) => permission.startsWith("View"))]))
      };
    }
    return {
      ...role,
      permissions: role.permissions && Object.keys(role.permissions).length ? role.permissions : defaultRolePermissions[role.id] ?? {}
    };
  });
  next.branches = appendMissingById(next.branches, demoBranches);
  next.departments = appendMissingById(next.departments, demoDepartments);
  next.leads = appendMissingById(next.leads, demoLeads);
  next.quotations = appendMissingById(next.quotations, demoQuotations);
  next.conversations = appendMissingById(next.conversations, demoConversations);
  next.rules = appendMissingById(next.rules, [...defaultAiRules, ...demoFollowUpRules]);
  next.handoffs = appendMissingById(next.handoffs, demoHandoffs);
  next.salesRecords = appendMissingById(next.salesRecords, demoSalesRecords);
  next.productPerformance = appendMissingById(next.productPerformance, demoProductPerformance);
  next.costs = appendMissingById(next.costs, demoCosts);
  next.wastage = appendMissingById(next.wastage, demoWastage);
  next.reports = appendMissingById(next.reports, demoReports);
  next.imports = appendMissingById(next.imports, demoImports);
  return next;
}

export class StorageService {
  static read(): StoreShape {
    if (typeof window === "undefined") return clone(initialStore);
    if (cachedStore) return cachedStore;
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      const fallback = withRuntimeDefaults(initialStore);
      this.write(fallback);
      return fallback;
    }
    const parsed = JSON.parse(stored) as Partial<StoreShape>;
    if (parsed.schemaVersion !== schemaVersion) {
      const fallback = withRuntimeDefaults({ ...clone(initialStore), ...parsed, schemaVersion } as StoreShape);
      this.write(fallback);
      return fallback;
    }
    cachedStore = withRuntimeDefaults({ ...clone(initialStore), ...parsed } as StoreShape);
    window.localStorage.setItem(key, JSON.stringify(cachedStore));
    return cachedStore;
  }

  static write(data: StoreShape) {
    if (typeof window === "undefined") return;
    cachedStore = data;
    storeRevision += 1;
    visibleStoreCache = null;
    window.localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("vernex-store-change"));
  }

  static reset() {
    this.write(initialStore);
  }
}

function collectionService<K extends keyof StoreShape>(collection: K) {
  return {
    list: () => StorageService.read()[collection] as StoreShape[K],
    create: (record: StoreShape[K] extends Array<infer R> ? R : never) => {
      const store = StorageService.read();
      (store[collection] as unknown[]).unshift(record);
      StorageService.write(store);
      return record;
    },
    update: (id: string, patch: Record<string, unknown>) => {
      const store = StorageService.read();
      store[collection] = (store[collection] as unknown[]).map((record) =>
        (record as { id?: string }).id === id ? { ...(record as object), ...patch } : record
      ) as StoreShape[K];
      StorageService.write(store);
    },
    delete: (id: string) => {
      const store = StorageService.read();
      store[collection] = (store[collection] as unknown[]).filter((record) => (record as { id?: string }).id !== id) as StoreShape[K];
      StorageService.write(store);
    }
  };
}

export class AuthService {
  static roleHomePath() {
    const user = this.currentUser();
    if (user?.roleId === "sales-executive" || user?.roleId === "staff") return "/dashboard/sales-agent";
    if (user?.roleId === "analyst") return "/dashboard/profit-analysis";
    return "/dashboard";
  }

  static login(email: string, password: string, roleId?: string) {
    const store = StorageService.read();
    const user = store.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("No account exists for this email. Please sign up first.");
    if (user.password !== password) throw new Error("Invalid password.");
    if (roleId && user.roleId !== roleId) throw new Error(`This account is registered as ${user.roleId}, not ${roleId}.`);
    store.currentUserId = user.id;
    StorageService.write(store);
    return user;
  }

  static signup(user: StoredUser) {
    const store = StorageService.read();
    if (store.users.some((item) => item.email.toLowerCase() === user.email.toLowerCase())) {
      throw new Error("A user with this email already exists.");
    }
    store.users.unshift(user);
    store.currentUserId = user.id;
    StorageService.write(store);
    return user;
  }

  static currentUser(store = StorageService.read()) {
    return store.users.find((user) => user.id === store.currentUserId) ?? null;
  }

  static logout() {
    const store = StorageService.read();
    store.currentUserId = null;
    StorageService.write(store);
  }

  static currentRole() {
    const store = StorageService.read();
    const user = this.currentUser(store);
    return user ? store.roles.find((role) => role.id === user.roleId) ?? null : null;
  }

  static hasPermission(module: string, permission: string) {
    const role = this.currentRole();
    if (!role) return false;
    if (role.readOnly) return permission.startsWith("View");
    if (role.globalVisibility && role.id === "owner") return true;
    return Boolean(role.permissions?.[module]?.includes(permission));
  }

  static canModify(module?: string, permission?: string) {
    const role = this.currentRole();
    if (!role || role.readOnly) return false;
    if (!module || !permission) return role.id === "owner";
    return this.hasPermission(module, permission);
  }

  static canViewModule(module: string) {
    const role = this.currentRole();
    if (!role) return false;
    if (role.globalVisibility) return true;
    const permissions = role.permissions?.[module] ?? [];
    return permissions.some((permission) => permission.startsWith("View") || permission.includes("View"));
  }

  static updateCurrentUserProfile(patch: Partial<Pick<StoredUser, "name" | "phone" | "companyName" | "industry" | "companySize" | "team" | "reportingManager">>) {
    const store = StorageService.read();
    if (!store.currentUserId) return;
    store.users = store.users.map((user) => (user.id === store.currentUserId ? { ...user, ...patch } : user));
    StorageService.write(store);
  }
}

export const RoleService = collectionService("roles");
export const RolePermissionService = {
  updatePermissions: (roleId: string, module: string, permissions: string[]) => {
    const store = StorageService.read();
    store.roles = store.roles.map((role) => {
      if (role.id !== roleId || role.readOnly) return role;
      return {
        ...role,
        permissions: {
          ...(role.permissions ?? {}),
          [module]: Array.from(new Set(permissions))
        }
      };
    });
    StorageService.write({ ...store, roles: [...store.roles] });
  }
};
export const PermissionService = {
  list: () => permissionsConfig,
  matrixForRole: (roleId: string) => StorageService.read().roles.find((role) => role.id === roleId)?.permissions ?? {}
};
export const UserService = collectionService("users");
export const BranchService = collectionService("branches");
export const DepartmentService = collectionService("departments");
export const LeadService = collectionService("leads");
export const ConversationService = collectionService("conversations");
export const QuotationService = collectionService("quotations");
export const TemplateService = collectionService("templates");
export const FollowUpRuleService = collectionService("rules");
export const HandoffService = collectionService("handoffs");
export const SalesAnalyticsService = collectionService("salesRecords");
export const ProductPerformanceService = collectionService("productPerformance");
export const CostTrackingService = collectionService("costs");
export const WastageTrackingService = collectionService("wastage");
export const ImportService = collectionService("imports");
export const SettingsService = {
  get: () => StorageService.read().settings,
  update: (patch: Partial<typeof settingsConfig>) => {
    const store = StorageService.read();
    store.settings = { ...store.settings, ...patch };
    StorageService.write(store);
  }
};

export class AnalyticsService {
  static visibleStore() {
    const store = StorageService.read();
    const cacheKey = `${storeRevision}:${store.currentUserId ?? "guest"}`;
    if (visibleStoreCache?.cacheKey === cacheKey) return visibleStoreCache.store;
    const user = AuthService.currentUser(store);
    if (!user) return store;
    const role = store.roles.find((item) => item.id === user.roleId);
    if (role?.globalVisibility) return store;

    const isManager = user.roleId === "manager";
    const assignedUserIds = new Set([
      user.id,
      ...store.users
        .filter(
          (item) =>
            item.managerId === user.id ||
            item.reportingManager === user.id ||
            item.branchIds.some((branchId) => user.branchIds.includes(branchId)) ||
            item.departmentIds.some((departmentId) => user.departmentIds.includes(departmentId))
        )
        .map((item) => item.id)
    ]);

    const filterVisible = <T extends object>(records: T[]): T[] =>
      records.filter(
        (record) => {
          const scoped = record as {
            assignedUserId?: string;
            assignedStaff?: string;
            managerId?: string;
            branchId?: string;
            departmentId?: string;
            leadId?: string;
          };
          const lead = scoped.leadId ? store.leads.find((item) => item.id === scoped.leadId) : null;
          return (
            Boolean(scoped.assignedUserId && assignedUserIds.has(scoped.assignedUserId)) ||
            scoped.assignedStaff === user.id ||
            scoped.assignedStaff === user.name ||
            scoped.managerId === user.id ||
            Boolean(scoped.branchId && user.branchIds.includes(scoped.branchId)) ||
            Boolean(scoped.departmentId && user.departmentIds.includes(scoped.departmentId)) ||
            Boolean(lead && filterVisible([lead]).length)
          );
        }
      );

    const visibleStore = {
      ...store,
      users: isManager ? store.users.filter((item) => assignedUserIds.has(item.id)) : store.users.filter((item) => item.id === user.id),
      branches: store.branches.filter((item) => item.managerId === user.id || user.branchIds.includes(item.id)),
      departments: store.departments.filter((item) => item.managerId === user.id || user.departmentIds.includes(item.id)),
      leads: filterVisible(store.leads),
      quotations: filterVisible(store.quotations),
      conversations: filterVisible(store.conversations) as Conversation[],
      handoffs: filterVisible(store.handoffs),
      salesRecords: filterVisible(store.salesRecords),
      productPerformance: filterVisible(store.productPerformance),
      costs: filterVisible(store.costs),
      wastage: filterVisible(store.wastage) as WastageEntry[],
      reports: user.roleId === "analyst" ? store.reports : isManager ? filterVisible(store.reports) : [],
      imports: user.roleId === "analyst" ? store.imports : isManager ? filterVisible(store.imports) : []
    };
    visibleStoreCache = { cacheKey, store: visibleStore };
    return visibleStore;
  }

  static dashboardMetrics() {
    const store = this.visibleStore();
    const totalSales = store.salesRecords.reduce((sum, row) => sum + row.totalAmount, 0);
    const wastage = store.wastage.reduce((sum, row) => sum + row.estimatedCostLoss, 0);
    return { totalSales, totalOrders: store.salesRecords.length, leads: store.leads.length, wastage, profit: totalSales - wastage };
  }

  static salesTrend() {
    const store = this.visibleStore();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days.map((day, index) => ({
      name: day,
      value: store.salesRecords
        .filter((row) => new Date(row.date).getDay() === index)
        .reduce((sum, row) => sum + Number(row.totalAmount || 0), 0)
    }));
  }
}

export const localApi = {
  getUsers: async () => UserService.list(),
  getBusinessSettings: async () => SettingsService.get(),
  getLeads: async () => LeadService.list(),
  getQuotations: async () => QuotationService.list(),
  getConversations: async () => ConversationService.list(),
  getMessageTemplates: async () => StorageService.read().templates,
  getFollowUpRules: async () => StorageService.read().rules,
  getHandoffRequests: async () => StorageService.read().handoffs,
  getSalesRecords: async () => SalesAnalyticsService.list(),
  getProductPerformance: async () => StorageService.read().productPerformance,
  getCostRecords: async () => CostTrackingService.list(),
  getWastageRecords: async () => WastageTrackingService.list(),
  getProfitReports: async () => StorageService.read().reports
};
