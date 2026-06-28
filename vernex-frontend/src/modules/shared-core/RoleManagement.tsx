"use client";

import { useMemo, useState } from "react";
import { Edit, Eye, Plus } from "lucide-react";
import permissionsConfig from "@/config/permissions.json";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { AuthService, RolePermissionService, RoleService, type RoleRecord } from "@/lib/services";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import { roleSchema } from "@/schemas/organization";
import { FormModal } from "@/components/modals/FormModal";
import { DetailItem, KebabActionMenu, LabeledField, UserAvatar } from "@/components/ui/ManagementPrimitives";
import { buildOrganizationHierarchy, type HierarchyEntry } from "@/lib/organizationHierarchy";

type RoleDraft = {
  name: string;
  description: string;
  hierarchyLevel: string;
  status: "Active" | "Inactive";
  permissions: Record<string, string[]>;
};

const emptyDraft = (): RoleDraft => ({
  name: "",
  description: "",
  hierarchyLevel: "25",
  status: "Active",
  permissions: {}
});

export function RoleManagement() {
  const store = useLocalStore();
  const [draft, setDraft] = useState<RoleDraft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState("");
  const canCreate = AuthService.can("create", "Role");
  const canEdit = AuthService.can("update", "Role") || AuthService.can("manage", "Role");
  const sortedRoles = useMemo(
    () => [...store.roles].sort((a, b) => b.level - a.level),
    [store.roles]
  );
  const viewingRole = store.roles.find((role) => role.id === viewingId);
  const hierarchy = useMemo(() => buildOrganizationHierarchy(store.users, store.roles), [store.roles, store.users]);

  function editRole(role: RoleRecord) {
    setEditingId(role.id);
    setViewingId(null);
    setDraft({
      name: role.name,
      description: role.description,
      hierarchyLevel: String(role.level),
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
    if (!draft) return;
    const validation = roleSchema.safeParse({ ...draft, hierarchyLevel: Number(draft.hierarchyLevel) });
    if (!validation.success) {
      setValidationError(validation.error.issues[0]?.message ?? "Invalid role details.");
      return;
    }
    setValidationError("");
    if (editingId) {
      RoleService.update(editingId, {
        name: draft.name,
        description: draft.description,
        level: Number(draft.hierarchyLevel),
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
        level: Number(draft.hierarchyLevel),
        displayOrder: 100 - Number(draft.hierarchyLevel),
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
            <tr>{["S.No", "Role Name", "Description", "Actions"].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3">{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedRoles.map((role, index) => {
              return (
                <tr key={role.id}>
                  <td className="whitespace-nowrap px-4 py-3">{index + 1}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold">{role.name}</td>
                  <td className="max-w-sm truncate whitespace-nowrap px-4 py-3 text-muted-foreground">{role.description}</td>
                  <td className="relative whitespace-nowrap px-4 py-3">
                    <KebabActionMenu
                      open={menuId === role.id}
                      onToggle={() => setMenuId(menuId === role.id ? null : role.id)}
                      ariaLabel={`Actions for ${role.name}`}
                      openAbove={index >= sortedRoles.length - 2}
                      items={[
                        { icon: Eye, label: "View", onClick: () => { setViewingId(role.id); setDraft(null); setMenuId(null); } },
                        { icon: Edit, label: "Edit", disabled: !canEdit || role.id === "admin", onClick: () => { editRole(role); setMenuId(null); } }
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <FormModal open={Boolean(draft)} title={editingId ? "Edit Role" : "Add Role"} onClose={() => { setDraft(null); setEditingId(null); }} className="max-w-2xl">
        {draft ? <div className="space-y-5">
          {validationError ? <p className="rounded-md bg-danger/10 p-3 text-sm font-medium text-danger">{validationError}</p> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <LabeledField label="Role Name"><Input placeholder="Example: Branch Manager" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></LabeledField>
            <LabeledField label="Description"><Input placeholder="Example: Manages branch operations" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></LabeledField>
            <LabeledField label="Hierarchy Level"><Input type="number" min="1" max="100" placeholder="Example: 50" value={draft.hierarchyLevel} onChange={(event) => setDraft({ ...draft, hierarchyLevel: event.target.value })} /></LabeledField>
            <LabeledField label="Status"><Select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as RoleDraft["status"] })}><option>Active</option><option>Inactive</option></Select></LabeledField>
          </div>
          <PermissionMatrix permissions={draft.permissions} editable onToggle={togglePermission} onToggleModule={setModule} />
          <div className="flex justify-end gap-2"><Button onClick={saveRole}>Save Role</Button><Button variant="secondary" onClick={() => { setDraft(null); setEditingId(null); }}>Cancel</Button></div>
        </div> : null}
      </FormModal>

      <FormModal open={Boolean(viewingRole)} title={viewingRole?.name ?? "Role Details"} onClose={() => setViewingId(null)} className="max-w-2xl">
        {viewingRole ? <div className="space-y-5">
          <div><h2 className="text-lg font-semibold">{viewingRole.name}</h2><p className="text-sm text-muted-foreground">{viewingRole.description}</p></div>
          <div className="grid gap-3 sm:grid-cols-3">
            <DetailItem muted label="Hierarchy Level" value={String(viewingRole.level)} />
            <DetailItem muted label="Assigned Users" value={String(store.users.filter((user) => user.roleId === viewingRole.id).length)} />
            <DetailItem muted label="Accessible Modules" value={String(Object.values(viewingRole.permissions ?? {}).filter((items) => items.length).length)} />
          </div>
          <PermissionMatrix permissions={viewingRole.permissions ?? {}} />
        </div> : null}
      </FormModal>

      <section className="dashboard-surface p-5">
        <h2 className="text-lg font-semibold">Organization Hierarchy</h2>
        <div className="mt-5 overflow-x-auto pb-4">
          <div className="org-tree min-w-max">
            <ul>
              {hierarchy.map((node) => <HierarchyNode key={node.user.id} node={node} store={store} />)}
            </ul>
          </div>
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

function HierarchyNode({ node, store }: { node: HierarchyEntry; store: ReturnType<typeof useLocalStore> }) {
  const { user, level, children } = node;
  const role = store.roles.find((item) => item.id === user.roleId)?.name ?? user.roleId;
  const branch = store.branches.find((item) => user.branchIds.includes(item.id))?.name ?? "Unassigned";
  const department = store.departments.find((item) => user.departmentIds.includes(item.id))?.name ?? "Unassigned";
  return <li>
    <div className="org-node">
      <UserAvatar name={user.name} src={user.avatar} size={64} strong />
      <div className="min-w-0 text-left">
        <p className="truncate font-semibold">{user.name}</p>
        <p className="truncate text-sm text-primary">{role} - Level {level}</p>
        <p className="truncate text-xs text-muted-foreground">{department} | {branch}</p>
      </div>
    </div>
    {children.length ? <ul>{children.map((child) => <HierarchyNode key={child.user.id} node={child} store={store} />)}</ul> : null}
  </li>;
}
