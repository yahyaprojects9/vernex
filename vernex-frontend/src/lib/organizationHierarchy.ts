import type { RoleRecord, StoredUser } from "@/lib/services";

export type HierarchyEntry = {
  user: StoredUser;
  level: number;
  children: HierarchyEntry[];
};

export function buildOrganizationHierarchy(users: StoredUser[], roles: RoleRecord[]) {
  const roleLevels = new Map(roles.map((role) => [role.id, role.level]));
  const usersById = new Map(users.map((user) => [user.id, user]));
  const parentByUser = new Map<string, string>();
  const sorted = [...users].sort((a, b) => levelOf(b) - levelOf(a) || a.name.localeCompare(b.name));

  function levelOf(user: StoredUser) {
    return roleLevels.get(user.roleId) ?? 0;
  }

  for (const user of sorted) {
    const explicitId = user.managerId ?? user.reportingManager;
    const explicit = explicitId ? usersById.get(explicitId) : undefined;
    if (explicit && levelOf(explicit) > levelOf(user)) {
      parentByUser.set(user.id, explicit.id);
      continue;
    }

    const parent = sorted
      .filter((candidate) => candidate.id !== user.id && levelOf(candidate) > levelOf(user))
      .sort((a, b) => relationshipScore(b, user) - relationshipScore(a, user) || levelOf(a) - levelOf(b) || a.name.localeCompare(b.name))[0];
    if (parent) parentByUser.set(user.id, parent.id);
  }

  const entries = new Map(sorted.map((user) => [user.id, { user, level: levelOf(user), children: [] as HierarchyEntry[] }]));
  const roots: HierarchyEntry[] = [];
  for (const user of sorted) {
    const entry = entries.get(user.id);
    if (!entry) continue;
    const parent = entries.get(parentByUser.get(user.id) ?? "");
    if (parent) parent.children.push(entry);
    else roots.push(entry);
  }
  sortHierarchy(roots);
  return roots;
}

function relationshipScore(candidate: StoredUser, user: StoredUser) {
  const sameDepartment = candidate.departmentIds.some((id) => user.departmentIds.includes(id));
  const sameBranch = candidate.branchIds.some((id) => user.branchIds.includes(id));
  return Number(sameDepartment) * 2 + Number(sameBranch);
}

function sortHierarchy(items: HierarchyEntry[]) {
  items.sort((a, b) => b.level - a.level || a.user.name.localeCompare(b.user.name));
  items.forEach((item) => sortHierarchy(item.children));
}

export function canEditUserHierarchy(actorRole: RoleRecord, targetRole: RoleRecord, nextRole?: RoleRecord) {
  return targetRole.level <= actorRole.level && (!nextRole || nextRole.level <= actorRole.level);
}
