import { AbilityBuilder, createMongoAbility, type ForcedSubject, type MongoAbility } from "@casl/ability";

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

export type AbilitySubjectName =
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
  | "Notification"
  | "FollowUpRule"
  | "Cost"
  | "Wastage"
  | "Import";

type UserResource = ForcedSubject<"User"> & { id: string; managerId?: string };
type BranchResource = ForcedSubject<"Branch"> & { id: string };
type DepartmentResource = ForcedSubject<"Department"> & { id: string };

export type AbilitySubject = AbilitySubjectName | UserResource | BranchResource | DepartmentResource;
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

const permissionMap: Record<string, [AbilityAction, AbilitySubjectName]> = {
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
  "Edit Departments": ["manage", "Department"],
  "Create Lead": ["create", "Lead"],
  "Edit Lead": ["update", "Lead"],
  "Delete Lead": ["delete", "Lead"],
  "Export Leads": ["export", "Lead"],
  "Create Conversation": ["create", "Conversation"],
  "Assign Conversation": ["assign", "Conversation"],
  "Send Message": ["update", "Conversation"],
  "Manage Quotations": ["manage", "Quotation"],
  "Manage Rules": ["manage", "FollowUpRule"],
  "Import Data": ["import", "Import"],
  "Edit Cost": ["update", "Cost"],
  "Edit Wastage": ["update", "Wastage"],
  "Generate Reports": ["create", "Report"],
  "Export Reports": ["export", "Report"],
  "View Analytics": ["read", "Dashboard"]
};

export function abilitiesForPermission(module: string, permission: string): [AbilityAction, AbilitySubjectName][] {
  if (permission === "View" && module === "Sales Agent") return [["read", "Lead"], ["read", "Conversation"], ["read", "Quotation"]];
  if (permission === "View" && module === "Profit Analysis") return [["read", "Report"], ["read", "Dashboard"], ["read", "Cost"], ["read", "Wastage"]];
  return permissionMap[permission] ? [permissionMap[permission]] : [];
}

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

  Object.entries(role.permissions ?? {}).forEach(([module, permissions]) =>
    permissions.forEach((permission) =>
      abilitiesForPermission(module, permission).forEach(([action, subject]) => {
        const scopedOrganizationRead = role.id === "manager" && action === "read" && ["User", "Branch", "Department"].includes(subject);
        if (!scopedOrganizationRead) can(action, subject);
      })
    )
  );
  if (role.id === "manager") {
    can("read", "User", { managerId: user.id });
    can("read", "User", { id: user.id });
    can("read", "Branch", { id: { $in: user.branchIds } });
    can("read", "Department", { id: { $in: user.departmentIds } });
  }
  return build();
}
