import { AbilityBuilder, createMongoAbility, type MongoAbility } from "@casl/ability";

export type AbilityAction =
  | "manage"
  | "create"
  | "read"
  | "update"
  | "delete"
  | "export"
  | "import"
  | "approve"
  | "assign"
  | "transfer"
  | "archive"
  | "restore";

export type AbilitySubject =
  | "all"
  | "Company"
  | "User"
  | "Role"
  | "Branch"
  | "Department"
  | "Lead"
  | "Conversation"
  | "Quotation"
  | "Report"
  | "Settings"
  | "Dashboard"
  | "Notification";

export type AppAbility = MongoAbility<[AbilityAction, AbilitySubject]>;

export type AbilityUser = {
  id: string;
  roleId: string;
  branchIds: string[];
  departmentIds: string[];
};

export type AbilityRole = {
  id: string;
  readOnly?: boolean;
  globalVisibility: boolean;
  permissions?: Record<string, string[]>;
};

const legacyPermissionMap: Record<string, [AbilityAction, AbilitySubject]> = {
  "View Users": ["read", "User"],
  "Create Users": ["create", "User"],
  "Edit Users": ["update", "User"],
  "Delete Users": ["delete", "User"],
  "View Roles": ["read", "Role"],
  "Create Roles": ["create", "Role"],
  "Edit Roles": ["update", "Role"],
  "Delete Roles": ["delete", "Role"],
  "Configure Permissions": ["manage", "Role"],
  "View Branches": ["read", "Branch"],
  "Edit Branches": ["manage", "Branch"],
  "View Departments": ["read", "Department"],
  "Edit Departments": ["manage", "Department"]
};

export function defineAbilityFor(user: AbilityUser | null, role: AbilityRole | null): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  if (!user || !role) return build();
  if (role.id === "owner") {
    can("manage", "all");
    return build();
  }
  if (role.readOnly && role.globalVisibility) {
    can("read", "all");
    return build();
  }

  Object.values(role.permissions ?? {}).flat().forEach((permission) => {
    const mapped = legacyPermissionMap[permission];
    if (mapped) can(mapped[0], mapped[1]);
  });

  if (role.permissions?.["Sales Agent"]?.some((permission) => permission.includes("View"))) {
    can("read", ["Lead", "Conversation", "Quotation"]);
  }
  if (role.permissions?.["Profit Analysis"]?.some((permission) => permission.includes("View"))) {
    can("read", ["Report", "Dashboard"]);
  }
  return build();
}
