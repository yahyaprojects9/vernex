import branchesConfig from "@/config/branches.json";
import departmentsConfig from "@/config/departments.json";
import permissionsConfig from "@/config/permissions.json";
import rolesConfig from "@/config/roles.json";
import settingsConfig from "@/config/settings.json";
import {
  conversations,
  costRecords,
  followUpRules,
  handoffRequests,
  leads,
  messageTemplates,
  productPerformance,
  profitReports,
  quotations,
  salesRecords,
  users,
  wastageRecords
} from "@/lib/mock-data";
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
  city: string;
  country: string;
};

export type Department = {
  id: string;
  name: string;
  managerId: string;
  status: string;
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
  currentUserId: string;
};

const key = "vernex-platform-v3";
const schemaVersion = 2;
const rolePasswords: Record<string, string> = {
  owner: "owner123",
  manager: "manager123",
  admin: "admin123",
  staff: "staff123",
  "sales-executive": "sales123",
  analyst: "analyst123",
  viewer: "viewer123"
};

function withOrg<T extends object>(record: T, index: number) {
  const branchIds = ["branch-chennai", "branch-coimbatore", "branch-bangalore", "branch-dubai", "branch-london"];
  const departmentIds = ["dept-sales", "dept-marketing", "dept-operations", "dept-finance", "dept-support", "dept-kitchen"];
  return {
    ...record,
    branchId: branchIds[index % branchIds.length],
    departmentId: departmentIds[index % departmentIds.length],
    ownerId: "USR-1",
    assignedUserId: `USR-${(index % 12) + 1}`
  };
}

const seededUsers: StoredUser[] = users.map((user, index) => ({
  ...user,
  roleId:
    index === 0
      ? "owner"
      : user.role === "Admin"
        ? "admin"
        : index % 4 === 0
          ? "manager"
          : index % 3 === 0
            ? "sales-executive"
            : "staff",
  password:
    index === 0
      ? rolePasswords.owner
      : user.role === "Admin"
        ? rolePasswords.admin
        : index % 4 === 0
          ? rolePasswords.manager
          : index % 3 === 0
            ? rolePasswords["sales-executive"]
            : rolePasswords.staff,
  phone: `+91 98765${String(10000 + index).slice(-5)}`,
  companyName: "Vernex Demo Bistro",
  companySize: "51-200",
  industry: "Restaurant & Catering",
  managerId: index < 2 ? undefined : `USR-${(index % 4) + 2}`,
  branchIds: [["branch-chennai"], ["branch-coimbatore"], ["branch-bangalore"], ["branch-dubai"], ["branch-london"]][index % 5],
  departmentIds: [["dept-sales"], ["dept-marketing"], ["dept-operations"], ["dept-finance"], ["dept-kitchen"]][index % 5]
}));

const namedSeedUsers: StoredUser[] = [
  {
    id: "USR-DEMO-OWNER",
    name: "Vernex Owner",
    email: "owner@vernex.demo",
    password: rolePasswords.owner,
    role: "Owner",
    roleId: "owner",
    status: "Active",
    lastActive: "Now",
    phone: "+91 90000 00001",
    companyName: "Vernex Demo Bistro",
    companySize: "51-200",
    industry: "Restaurant & Catering",
    companyRegistrationNumber: "VRNX-OWN-001",
    numberOfBranches: "5",
    branchIds: ["branch-chennai", "branch-coimbatore", "branch-bangalore", "branch-dubai", "branch-london"],
    departmentIds: ["dept-management", "dept-sales", "dept-operations", "dept-finance"]
  },
  {
    id: "USR-DEMO-MANAGER",
    name: "Meera Manager",
    email: "manager@vernex.demo",
    password: rolePasswords.manager,
    role: "Admin",
    roleId: "manager",
    status: "Active",
    lastActive: "Today",
    phone: "+91 90000 00002",
    companyName: "Vernex Demo Bistro",
    companySize: "51-200",
    industry: "Restaurant & Catering",
    branchIds: ["branch-chennai"],
    departmentIds: ["dept-sales"]
  },
  {
    id: "USR-DEMO-ADMIN",
    name: "Arjun Admin",
    email: "admin@vernex.demo",
    password: rolePasswords.admin,
    role: "Admin",
    roleId: "admin",
    status: "Active",
    lastActive: "Today",
    phone: "+91 90000 00003",
    companyName: "Vernex Demo Bistro",
    companySize: "51-200",
    industry: "Restaurant & Catering",
    branchIds: ["branch-chennai", "branch-coimbatore", "branch-bangalore", "branch-dubai", "branch-london"],
    departmentIds: ["dept-management", "dept-sales", "dept-operations", "dept-finance", "dept-support", "dept-kitchen"]
  },
  {
    id: "USR-DEMO-STAFF",
    name: "Sara Staff",
    email: "staff@vernex.demo",
    password: rolePasswords.staff,
    role: "Staff",
    roleId: "staff",
    status: "Active",
    lastActive: "Today",
    phone: "+91 90000 00004",
    companyName: "Vernex Demo Bistro",
    companySize: "51-200",
    industry: "Restaurant & Catering",
    managerId: "USR-DEMO-MANAGER",
    branchIds: ["branch-chennai"],
    departmentIds: ["dept-sales"],
    team: "Inbound Sales",
    reportingManager: "Meera Manager"
  },
  {
    id: "USR-DEMO-ANALYST",
    name: "Dev Analyst",
    email: "analyst@vernex.demo",
    password: rolePasswords.analyst,
    role: "Staff",
    roleId: "analyst",
    status: "Active",
    lastActive: "Today",
    phone: "+91 90000 00005",
    companyName: "Vernex Demo Bistro",
    companySize: "51-200",
    industry: "Restaurant & Catering",
    managerId: "USR-DEMO-MANAGER",
    branchIds: ["branch-chennai", "branch-bangalore"],
    departmentIds: ["dept-finance"]
  },
  {
    id: "USR-DEMO-VIEWER",
    name: "Nina Viewer",
    email: "viewer@vernex.demo",
    password: rolePasswords.viewer,
    role: "Staff",
    roleId: "viewer",
    status: "Active",
    lastActive: "Today",
    phone: "+91 90000 00006",
    companyName: "Vernex Demo Bistro",
    companySize: "51-200",
    industry: "Restaurant & Catering",
    managerId: "USR-DEMO-MANAGER",
    branchIds: ["branch-chennai"],
    departmentIds: ["dept-support"]
  }
];

const ownerPermissions = Object.fromEntries(
  permissionsConfig.map((group) => [group.module, group.permissions])
) as Record<string, string[]>;

const initialStore: StoreShape = {
  schemaVersion,
  users: [...namedSeedUsers, ...seededUsers],
  roles: (rolesConfig as RoleRecord[]).map((role) => ({
    ...role,
    permissions:
      role.id === "owner"
        ? ownerPermissions
        : role.id === "admin"
          ? Object.fromEntries(permissionsConfig.map((group) => [group.module, group.permissions.filter((permission) => permission.startsWith("View"))]))
          : {}
  })),
  branches: branchesConfig as Branch[],
  departments: departmentsConfig as Department[],
  leads: leads.map(withOrg),
  quotations: quotations.map(withOrg),
  conversations: conversations.map((conversation, index) => ({
    ...withOrg(conversation, index),
    unreadCount: index % 4,
    pinned: index % 9 === 0,
    archived: false
  })),
  templates: messageTemplates,
  rules: followUpRules,
  handoffs: handoffRequests,
  salesRecords: salesRecords.map(withOrg),
  productPerformance,
  costs: costRecords,
  wastage: wastageRecords.map(withOrg),
  reports: profitReports,
  imports: [
    {
      id: "IMP-001",
      importDate: "2026-06-12",
      importedBy: "Demo Admin",
      sourceType: "CSV",
      rowsImported: 100,
      rowsFailed: 0,
      validationErrors: [],
      status: "Imported"
    }
  ],
  settings: settingsConfig,
  currentUserId: "USR-1"
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class StorageService {
  static read(): StoreShape {
    if (typeof window === "undefined") return clone(initialStore);
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      this.write(initialStore);
      return clone(initialStore);
    }
    const parsed = JSON.parse(stored) as Partial<StoreShape>;
    const merged = { ...clone(initialStore), ...parsed } as StoreShape;
    if (merged.schemaVersion !== schemaVersion || merged.users.some((user) => !user.password || !user.roleId)) {
      const previousUsers = merged.users;
      const existingByEmail = new Map(merged.users.map((user) => [user.email.toLowerCase(), user]));
      merged.users = initialStore.users.map((seedUser) => ({
        ...seedUser,
        ...(existingByEmail.get(seedUser.email.toLowerCase()) ?? {}),
        password: existingByEmail.get(seedUser.email.toLowerCase())?.password ?? seedUser.password,
        roleId: existingByEmail.get(seedUser.email.toLowerCase())?.roleId ?? seedUser.roleId
      }));
      const customUsers = previousUsers.filter((user) => !initialStore.users.some((seedUser) => seedUser.email.toLowerCase() === user.email.toLowerCase()));
      merged.users = [...merged.users, ...customUsers];
      merged.schemaVersion = schemaVersion;
      this.write(merged);
    }
    return merged;
  }

  static write(data: StoreShape) {
    if (typeof window === "undefined") return;
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
  static login(email: string, password: string, roleId?: string) {
    const store = StorageService.read();
    const user = store.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("No user exists for this email. Use a seeded account or register first.");
    if (user.password !== password) throw new Error("Invalid password for this role-based account.");
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
    UserService.create(user);
    return this.login(user.email, user.password, user.roleId);
  }

  static currentUser() {
    const store = StorageService.read();
    return store.users.find((user) => user.id === store.currentUserId) ?? store.users[0];
  }
}

export const RoleService = collectionService("roles");
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
    const user = AuthService.currentUser();
    const role = store.roles.find((item) => item.id === user.roleId);
    if (role?.globalVisibility) return store;

    const filterVisible = <T extends object>(records: T[]): T[] =>
      records.filter(
        (record) =>
          (record as { assignedUserId?: string }).assignedUserId === user.id ||
          Boolean((record as { branchId?: string }).branchId && user.branchIds.includes((record as { branchId: string }).branchId)) ||
          Boolean((record as { departmentId?: string }).departmentId && user.departmentIds.includes((record as { departmentId: string }).departmentId))
      );

    return {
      ...store,
      leads: filterVisible(store.leads),
      conversations: filterVisible(store.conversations) as Conversation[],
      salesRecords: filterVisible(store.salesRecords),
      wastage: filterVisible(store.wastage) as WastageEntry[]
    };
  }

  static dashboardMetrics() {
    const store = this.visibleStore();
    const totalSales = store.salesRecords.reduce((sum, row) => sum + row.totalAmount, 0);
    const wastage = store.wastage.reduce((sum, row) => sum + row.estimatedCostLoss, 0);
    return { totalSales, totalOrders: store.salesRecords.length, leads: store.leads.length, wastage, profit: totalSales - wastage };
  }

  static salesTrend() {
    const store = this.visibleStore();
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, index) => ({
      name: day,
      value: store.salesRecords.filter((_, rowIndex) => rowIndex % 7 === index).reduce((sum, row) => sum + row.totalAmount, 0)
    }));
  }
}

export const demoApi = {
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
