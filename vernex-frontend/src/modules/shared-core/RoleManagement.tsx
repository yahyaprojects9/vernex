"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Edit, Eye, Plus, Trash2 } from "lucide-react";
import permissionsConfig from "@/config/permissions.json";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AuthService, RolePermissionService, RoleService, type RoleRecord } from "@/lib/services";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";

type RoleDraft = {
  name: string;
  description: string;
  displayOrder: string;
  status: "Active" | "Inactive";
  permissions: Record<string, string[]>;
};

const emptyDraft = (): RoleDraft => ({
  name: "",
  description: "",
  displayOrder: "10",
  status: "Active",
  permissions: {}
});

export function RoleManagement() {
  const store = useLocalStore();
  const [draft, setDraft] = useState<RoleDraft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string[]>(["owner"]);
  const canCreate = AuthService.can("create", "Role");
  const canEdit = AuthService.can("update", "Role") || AuthService.can("manage", "Role");
  const canDelete = AuthService.can("delete", "Role");
  const sortedRoles = useMemo(
    () => [...store.roles].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [store.roles]
  );
  const viewingRole = store.roles.find((role) => role.id === viewingId);

  function editRole(role: RoleRecord) {
    setEditingId(role.id);
    setViewingId(null);
    setDraft({
      name: role.name,
      description: role.description,
      displayOrder: String(role.displayOrder ?? 0),
      status: role.status ?? "Active",
      permissions: role.permissions ?? {}
    });
  }

  function togglePermission(module: string, permission: string) {
    if (!draft) return;
    const current = draft.permissions[module] ?? [];
    setDraft({
      ...draft,
      permissions: {
        ...draft.permissions,
        [module]: current.includes(permission)
          ? current.filter((item) => item !== permission)
          : [...current, permission]
      }
    });
  }

  function setModule(module: string, permissions: string[]) {
    if (!draft) return;
    const current = draft.permissions[module] ?? [];
    const allSelected = permissions.every((permission) => current.includes(permission));
    setDraft({ ...draft, permissions: { ...draft.permissions, [module]: allSelected ? [] : permissions } });
  }

  function saveRole() {
    if (!draft?.name.trim()) return;
    if (editingId) {
      RoleService.update(editingId, {
        name: draft.name,
        description: draft.description,
        displayOrder: Number(draft.displayOrder),
        status: draft.status
      });
      Object.entries(draft.permissions).forEach(([module, permissions]) =>
        RolePermissionService.updatePermissions(editingId, module, permissions)
      );
    } else {
      RoleService.create({
        id: `role-${Date.now()}`,
        name: draft.name,
        description: draft.description,
        level: 25,
        displayOrder: Number(draft.displayOrder),
        status: draft.status,
        createdAt: new Date().toISOString(),
        protected: false,
        canModifyPermissions: false,
        canModifyHierarchy: false,
        globalVisibility: false,
        permissions: draft.permissions
      });
    }
    setDraft(null);
    setEditingId(null);
  }

  function deleteRole(role: RoleRecord) {
    const activeMembers = store.users.filter((user) => user.roleId === role.id && user.status === "Active");
    if (role.protected || role.id === "owner" || activeMembers.length) return;
    if (window.confirm(`Delete role "${role.name}"?`)) RoleService.delete(role.id);
  }

  return (
    <div className="space-y-6">
      <div className="dashboard-surface flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <h2 className="text-lg font-semibold">Organization Roles</h2>
          <p className="text-sm text-muted-foreground">Reusable roles, permissions, members, and hierarchy.</p>
        </div>
        <Button onClick={() => { setEditingId(null); setViewingId(null); setDraft(emptyDraft()); }} disabled={!canCreate}>
          <Plus className="h-4 w-4" /> Add Role
        </Button>
      </div>

      <div className="dashboard-surface overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr>{["S.No", "Role Name", "Description", "Members", "Status", "Created", "Actions"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedRoles.map((role, index) => {
              const members = store.users.filter((user) => user.roleId === role.id);
              const deletionBlocked = role.protected || role.id === "owner" || members.some((user) => user.status === "Active");
              return (
                <tr key={role.id}>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold">{role.name}</td>
                  <td className="max-w-sm px-4 py-3 text-muted-foreground">{role.description}</td>
                  <td className="px-4 py-3">{members.length}</td>
                  <td className="px-4 py-3"><StatusBadge tone={role.status === "Inactive" ? "neutral" : "success"}>{role.status ?? "Active"}</StatusBadge></td>
                  <td className="px-4 py-3">{role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-3"><div className="flex gap-2">
                    <Button variant="secondary" className="h-9 w-9 px-0" aria-label="View role" onClick={() => { setViewingId(role.id); setDraft(null); }}><Eye className="h-4 w-4" /></Button>
                    <Button variant="secondary" className="h-9 w-9 px-0" aria-label="Edit role" disabled={!canEdit || role.id === "admin"} onClick={() => editRole(role)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="danger" className="h-9 w-9 px-0" aria-label="Delete role" title={deletionBlocked ? "Protected roles and roles with active users cannot be deleted" : "Delete role"} disabled={!canDelete || deletionBlocked} onClick={() => deleteRole(role)}><Trash2 className="h-4 w-4" /></Button>
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {draft ? (
        <section className="dashboard-surface space-y-5 p-5">
          <h2 className="text-lg font-semibold">{editingId ? "Edit Role" : "Create Role"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Role name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            <Input type="number" placeholder="Display order" value={draft.displayOrder} onChange={(event) => setDraft({ ...draft, displayOrder: event.target.value })} />
            <Textarea className="md:col-span-2" placeholder="Description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
            <Select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as RoleDraft["status"] })}><option>Active</option><option>Inactive</option></Select>
          </div>
          <PermissionMatrix permissions={draft.permissions} editable onToggle={togglePermission} onToggleModule={setModule} />
          <div className="flex justify-center gap-2"><Button onClick={saveRole}>Save Role</Button><Button variant="secondary" onClick={() => setDraft(null)}>Cancel</Button></div>
        </section>
      ) : null}

      {viewingRole ? (
        <section className="dashboard-surface space-y-5 p-5">
          <div><h2 className="text-lg font-semibold">{viewingRole.name}</h2><p className="text-sm text-muted-foreground">{viewingRole.description}</p></div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Info label="Hierarchy Level" value={String(viewingRole.level)} />
            <Info label="Assigned Users" value={String(store.users.filter((user) => user.roleId === viewingRole.id).length)} />
            <Info label="Accessible Modules" value={String(Object.values(viewingRole.permissions ?? {}).filter((items) => items.length).length)} />
          </div>
          <PermissionMatrix permissions={viewingRole.permissions ?? {}} />
        </section>
      ) : null}

      <section className="dashboard-surface p-5">
        <h2 className="text-lg font-semibold">Organization Hierarchy</h2>
        <div className="mt-4 space-y-2">
          {store.users.filter((user) => user.roleId === "owner").map((owner) => (
            <HierarchyNode key={owner.id} userId={owner.id} depth={0} expanded={expanded} setExpanded={setExpanded} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PermissionMatrix({ permissions, editable = false, onToggle, onToggleModule }: {
  permissions: Record<string, string[]>;
  editable?: boolean;
  onToggle?: (module: string, permission: string) => void;
  onToggleModule?: (module: string, permissions: string[]) => void;
}) {
  return <div className="space-y-3">{permissionsConfig.map((group) => (
    <div key={group.module} className="rounded-md border border-border p-4">
      <div className="flex items-center justify-between"><h3 className="font-semibold">{group.module}</h3>{editable ? <Button variant="secondary" onClick={() => onToggleModule?.(group.module, group.permissions)}>Module Select All</Button> : null}</div>
      <div className="mt-3 grid gap-2 md:grid-cols-3">{group.permissions.map((permission) => (
        <label key={permission} className="flex items-center gap-2 rounded-md bg-muted/60 p-2 text-sm">
          <input type="checkbox" checked={permissions[group.module]?.includes(permission) ?? false} disabled={!editable} onChange={() => onToggle?.(group.module, permission)} />{permission}
        </label>
      ))}</div>
    </div>
  ))}</div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md bg-muted p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="font-semibold">{value}</p></div>;
}

function HierarchyNode({ userId, depth, expanded, setExpanded }: { userId: string; depth: number; expanded: string[]; setExpanded: (ids: string[]) => void }) {
  const store = useLocalStore();
  const user = store.users.find((item) => item.id === userId);
  if (!user) return null;
  const children = store.users.filter((item) => item.managerId === user.id || item.reportingManager === user.id);
  const isOpen = expanded.includes(user.id);
  const role = store.roles.find((item) => item.id === user.roleId)?.name ?? user.roleId;
  const branch = store.branches.find((item) => user.branchIds.includes(item.id))?.name ?? "Unassigned";
  const department = store.departments.find((item) => user.departmentIds.includes(item.id))?.name ?? "Unassigned";
  return <div style={{ marginLeft: depth * 20 }}>
    <button className="flex w-full items-center gap-3 rounded-md border border-border p-3 text-left hover:bg-muted" onClick={() => setExpanded(isOpen ? expanded.filter((id) => id !== user.id) : [...expanded, user.id])}>
      {children.length ? isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" /> : <span className="w-4" />}
      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">{user.name.charAt(0)}</span>
      <span><span className="block font-semibold">{user.name} - {role}</span><span className="block text-xs text-muted-foreground">{department} | {branch}</span></span>
    </button>
    {isOpen ? children.map((child) => <HierarchyNode key={child.id} userId={child.id} depth={depth + 1} expanded={expanded} setExpanded={setExpanded} />) : null}
  </div>;
}
