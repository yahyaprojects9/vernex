"use client";

import { useState } from "react";
import { GitBranch, ShieldCheck, Users } from "lucide-react";
import permissionsConfig from "@/config/permissions.json";
import { StatCard } from "@/components/cards/StatCard";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { RoleService, StorageService } from "@/lib/services";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";

export function RoleManagement() {
  const store = useLocalStore();
  const [activeRoleId, setActiveRoleId] = useState(store.roles[0]?.id ?? "owner");
  const activeRole = store.roles.find((role) => role.id === activeRoleId) ?? store.roles[0];
  const [newRole, setNewRole] = useState({ name: "", description: "" });

  function togglePermission(module: string, permission: string) {
    if (!activeRole || activeRole.id === "admin") return;
    const current = activeRole.permissions?.[module] ?? [];
    const next = current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission];
    RoleService.update(activeRole.id, {
      permissions: {
        ...(activeRole.permissions ?? {}),
        [module]: next
      }
    });
  }

  function createRole() {
    if (!newRole.name.trim()) return;
    RoleService.create({
      id: `role-${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      level: 25,
      canModifyPermissions: false,
      canModifyHierarchy: false,
      globalVisibility: false,
      permissions: {}
    });
    setNewRole({ name: "", description: "" });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Roles" value={String(store.roles.length)} helper="System and custom roles" icon={ShieldCheck} />
        <StatCard label="Assigned Users" value={String(store.users.length)} helper="Hierarchy-aware" icon={Users} />
        <StatCard label="Branches" value={String(store.branches.length)} helper="Visibility scopes" icon={GitBranch} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <section className="dashboard-surface p-4">
          <h2 className="font-semibold">Role List</h2>
          <div className="mt-4 space-y-2">
            {store.roles.map((role) => (
              <button
                key={role.id}
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium ${activeRoleId === role.id ? "bg-primary text-primary-foreground" : "bg-muted/60 hover:bg-muted"}`}
                onClick={() => setActiveRoleId(role.id)}
              >
                {role.name}
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-3 border-t border-border pt-4">
            <Input placeholder="New role name" value={newRole.name} onChange={(event) => setNewRole({ ...newRole, name: event.target.value })} />
            <Textarea placeholder="Role description" value={newRole.description} onChange={(event) => setNewRole({ ...newRole, description: event.target.value })} />
            <Button onClick={createRole}>Create Role</Button>
          </div>
        </section>

        <section className="space-y-6">
          <div className="dashboard-surface p-5">
            <h2 className="text-lg font-semibold">Role Details</h2>
            <p className="mt-1 text-sm text-muted-foreground">{activeRole?.description}</p>
            {activeRole?.id === "admin" ? (
              <p className="mt-3 rounded-md bg-warning/15 p-3 text-sm font-medium text-amber-800">
                Admin is global read-only. It can view all data but cannot modify permissions, hierarchy, or assignments.
              </p>
            ) : null}
          </div>

          <div className="dashboard-surface p-5">
            <h2 className="text-lg font-semibold">Permission Matrix</h2>
            <div className="mt-4 space-y-5">
              {permissionsConfig.map((group) => (
                <div key={group.module} className="rounded-md border border-border p-4">
                  <h3 className="font-semibold">{group.module}</h3>
                  <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                    {group.permissions.map((permission) => (
                      <label key={permission} className="flex items-center gap-2 rounded-md bg-muted/60 p-2 text-sm">
                        <input
                          type="checkbox"
                          checked={Boolean(activeRole?.permissions?.[group.module]?.includes(permission))}
                          disabled={activeRole?.id === "admin"}
                          onChange={() => togglePermission(group.module, permission)}
                          className="h-4 w-4 accent-teal-700"
                        />
                        {permission}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-surface p-5">
            <h2 className="text-lg font-semibold">Hierarchy Tree</h2>
            <div className="mt-4 rounded-md bg-muted p-4 text-sm">
              <p className="font-semibold">Owner</p>
              {store.users.filter((user) => user.roleId === "manager").map((manager) => (
                <div key={manager.id} className="ml-5 mt-3 border-l border-border pl-4">
                  <p className="font-semibold">{manager.name} - Manager</p>
                  {store.users.filter((user) => user.managerId === manager.id).map((user) => (
                    <p key={user.id} className="ml-4 mt-1 text-muted-foreground">{user.name} - {user.roleId}</p>
                  ))}
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" onClick={() => StorageService.reset()}>Reset Demo Data</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
