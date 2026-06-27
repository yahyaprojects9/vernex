"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Download, Edit, Eye, MoreVertical, Plus, Search, SlidersHorizontal, Upload, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { FormModal } from "@/components/modals/FormModal";
import { AuthService, OrganizationService, UserService, type StoredUser } from "@/lib/services";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";
import { userSchema } from "@/schemas/organization";

const PAGE_SIZE = 8;

const formFields = [
  ["name", "Full Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["employeeCode", "Employee Code"],
  ["joiningDate", "Joining Date"],
  ["team", "Team"]
] as const;

export function UserManagementScreen() {
  const store = useLocalStore();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<StoredUser | null>(null);
  const [editing, setEditing] = useState<StoredUser | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Record<string, string>>({});
  const canCreate = AuthService.can("create", "User");
  const canEdit = AuthService.can("update", "User");
  const canExport = AuthService.can("read", "User");

  const roleById = Object.fromEntries(store.roles.map((role) => [role.id, role]));
  const branchById = Object.fromEntries(store.branches.map((branch) => [branch.id, branch]));
  const departmentById = Object.fromEntries(store.departments.map((department) => [department.id, department]));
  const userById = Object.fromEntries(store.users.map((user) => [user.id, user]));

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return store.users.filter((user) => {
      const searchable = `${user.name} ${user.email} ${user.phone} ${user.employeeCode ?? ""}`.toLowerCase();
      return (!normalized || searchable.includes(normalized))
        && (roleFilter === "All" || user.roleId === roleFilter)
        && (statusFilter === "All" || user.status === statusFilter);
    });
  }, [query, roleFilter, statusFilter, store.users]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openCreate() {
    setEditing(null);
    setError("");
    setDraft({
      avatar: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      roleId: store.roles.find((role) => role.status !== "Inactive")?.id ?? "",
      branchId: store.branches[0]?.id ?? "",
      departmentId: store.departments[0]?.id ?? "",
      managerId: "",
      employeeCode: "",
      joiningDate: new Date().toISOString().slice(0, 10),
      team: "",
      status: "Active"
    });
    setFormOpen(true);
  }

  function openEdit(user: StoredUser) {
    setEditing(user);
    setError("");
    setDraft({
      avatar: user.avatar ?? "",
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      confirmPassword: user.password,
      roleId: user.roleId,
      branchId: user.branchId ?? user.branchIds[0] ?? "",
      departmentId: user.departmentId ?? user.departmentIds[0] ?? "",
      managerId: user.managerId ?? "",
      employeeCode: user.employeeCode ?? "",
      joiningDate: user.joiningDate ?? "",
      team: user.team ?? "",
      status: user.status
    });
    setFormOpen(true);
  }

  function saveUser() {
    if (editing) {
      if (!draft.name || !draft.email || !draft.roleId) {
        setError("Name, email, and role are required.");
        return;
      }
      OrganizationService.updateUser(editing.id, {
        ...draft,
        role: legacyRole(draft.roleId),
        status: draft.status as StoredUser["status"]
      });
    } else {
      const validation = userSchema.safeParse(draft);
      if (!validation.success) {
        setError(validation.error.issues[0]?.message ?? "Invalid user details.");
        return;
      }
      UserService.create({
        id: `USR-${Date.now()}`,
        name: draft.name,
        email: draft.email,
        phone: draft.phone,
        password: draft.password,
        role: legacyRole(draft.roleId),
        roleId: draft.roleId,
        status: draft.status as StoredUser["status"],
        lastActive: "Never",
        companyName: store.settings.companyName,
        companySize: store.settings.companySize,
        industry: store.settings.industry,
        branchId: draft.branchId,
        departmentId: draft.departmentId,
        branchIds: draft.branchId ? [draft.branchId] : [],
        departmentIds: draft.departmentId ? [draft.departmentId] : [],
        managerId: draft.managerId || undefined,
        team: draft.team,
        employeeCode: draft.employeeCode,
        joiningDate: draft.joiningDate,
        avatar: draft.avatar
      });
    }
    setFormOpen(false);
    setEditing(null);
  }

  async function exportUsers(templateOnly = false) {
    const { default: writeXlsxFile } = await import("write-excel-file/browser");
    const headers = ["Full Name", "Email", "Phone", "Role", "Branch", "Department", "Reporting Manager", "Employee Code", "Joining Date", "Team", "Status"];
    const rows = templateOnly ? [] : filtered.map((user) => [
      user.name,
      user.email,
      user.phone,
      roleById[user.roleId]?.name ?? user.roleId,
      branchById[user.branchId ?? user.branchIds[0]]?.name ?? "",
      departmentById[user.departmentId ?? user.departmentIds[0]]?.name ?? "",
      userById[user.managerId ?? ""]?.name ?? "",
      user.employeeCode ?? "",
      user.joiningDate ?? "",
      user.team ?? "",
      user.status
    ]);
    await writeXlsxFile([
      headers.map((value) => ({ value, fontWeight: "bold" as const })),
      ...rows.map((row) => row.map((value) => ({ value })))
    ]).toFile(templateOnly ? "user-import-template.xlsx" : "users.xlsx");
  }

  async function importUsers(file: File) {
    const { readSheet } = await import("read-excel-file/browser");
    const rows = await readSheet(file);
    if (!rows.length) return;
    const headers = rows[0].map((value) => String(value ?? "").trim().toLowerCase());
    const valueAt = (row: typeof rows[number], label: string) => String(row[headers.indexOf(label.toLowerCase())] ?? "").trim();
    rows.slice(1).forEach((row, index) => {
      const email = valueAt(row, "Email");
      if (!email || store.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) return;
      const roleValue = valueAt(row, "Role");
      const branchValue = valueAt(row, "Branch");
      const departmentValue = valueAt(row, "Department");
      const managerValue = valueAt(row, "Reporting Manager");
      const roleId = store.roles.find((role) => role.id === roleValue || role.name.toLowerCase() === roleValue.toLowerCase())?.id ?? "staff";
      const branchId = store.branches.find((branch) => branch.id === branchValue || branch.name.toLowerCase() === branchValue.toLowerCase())?.id ?? store.branches[0]?.id ?? "";
      const departmentId = store.departments.find((department) => department.id === departmentValue || department.name.toLowerCase() === departmentValue.toLowerCase())?.id ?? store.departments[0]?.id ?? "";
      const managerId = store.users.find((user) => user.id === managerValue || user.name.toLowerCase() === managerValue.toLowerCase())?.id;
      UserService.create({
        id: `USR-IMPORT-${Date.now()}-${index}`,
        name: valueAt(row, "Full Name") || email.split("@")[0],
        email,
        phone: valueAt(row, "Phone"),
        password: "ChangeMe123",
        role: legacyRole(roleId),
        roleId,
        status: normalizeStatus(valueAt(row, "Status")),
        lastActive: "Never",
        companyName: store.settings.companyName,
        companySize: store.settings.companySize,
        industry: store.settings.industry,
        branchId,
        departmentId,
        branchIds: branchId ? [branchId] : [],
        departmentIds: departmentId ? [departmentId] : [],
        managerId,
        employeeCode: valueAt(row, "Employee Code"),
        joiningDate: valueAt(row, "Joining Date"),
        team: valueAt(row, "Team")
      });
    });
    setImportOpen(false);
  }

  function toggleStatus(user: StoredUser) {
    OrganizationService.updateUser(user.id, { status: user.status === "Active" ? "Inactive" : "Active" });
    setMenuId(null);
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-xl font-bold">All users <span className="font-normal text-muted-foreground">{filtered.length}</span></h2>
        <div className="flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1">
          <Button variant="secondary" className={`shrink-0 ${filtersOpen ? "border-slate-400 bg-slate-200 text-slate-900 hover:bg-slate-200" : ""}`} aria-pressed={filtersOpen} onClick={() => setFiltersOpen((value) => !value)}><SlidersHorizontal className="h-4 w-4" />Filters</Button>
          {canCreate ? <Button className="shrink-0" onClick={openCreate}><Plus className="h-4 w-4" />Add user</Button> : null}
          {canCreate ? <Button variant="secondary" className="shrink-0" onClick={() => setImportOpen(true)}><Upload className="h-4 w-4" />Import</Button> : null}
          {canExport ? <Button variant="secondary" className="shrink-0" onClick={() => void exportUsers(false)}><Download className="h-4 w-4" />Export</Button> : null}
          {canExport ? <Button variant="secondary" className="shrink-0" onClick={() => void exportUsers(true)}>Template</Button> : null}
        </div>
      </div>

      <div className="dashboard-surface p-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} className="min-h-11 pl-9" placeholder="Search users" />
        </label>
        {filtersOpen ? <div className="mt-3 grid gap-3 border-t border-border pt-3 sm:grid-cols-2">
          <Field label="Role">
            <Select value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }} aria-label="Filter by role">
              <option value="All">All roles</option>{store.roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} aria-label="Filter by status">
              <option value="All">All statuses</option><option>Active</option><option>Inactive</option><option>Suspended</option>
            </Select>
          </Field>
        </div> : null}
      </div>

      <div className="dashboard-surface overflow-visible">
        <div className="hidden grid-cols-[minmax(260px,1.4fr)_minmax(280px,1fr)_130px_130px_48px] gap-4 bg-muted/70 px-5 py-3 text-xs font-semibold uppercase text-muted-foreground md:grid">
          <span>User</span><span>Access</span><span>Last active</span><span>Date added</span><span />
        </div>
        <div className="divide-y divide-border">
          {visible.map((user) => {
            const branchId = user.branchId ?? user.branchIds[0];
            const departmentId = user.departmentId ?? user.departmentIds[0];
            return <article key={user.id} className="relative grid gap-3 py-4 pl-4 pr-14 hover:bg-muted/30 md:grid-cols-[minmax(260px,1.4fr)_minmax(280px,1fr)_130px_130px_48px] md:items-center md:px-5">
              <div className="flex min-w-0 items-center gap-3">
                {user.avatar ? <Image src={user.avatar} alt="" width={44} height={44} unoptimized className="aspect-square h-11 w-11 shrink-0 rounded-full border border-border object-cover" /> : <span className="grid aspect-square h-11 w-11 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 font-bold text-primary">{user.name.charAt(0)}</span>}
                <div className="min-w-0"><h3 className="truncate font-semibold">{user.name}</h3><p className="truncate text-sm text-muted-foreground">{user.email}</p></div>
              </div>
              <div className="flex min-w-0 flex-wrap gap-1.5">
                <AccessBadge tone="role">{roleById[user.roleId]?.name ?? user.roleId}</AccessBadge>
                {branchId ? <AccessBadge tone="branch">{branchById[branchId]?.name ?? branchId}</AccessBadge> : null}
                {departmentId ? <AccessBadge tone="department">{departmentById[departmentId]?.name ?? departmentId}</AccessBadge> : null}
              </div>
              <div className="text-sm"><span className="mr-2 text-xs text-muted-foreground md:hidden">Last active</span>{user.lastActive || "-"}</div>
              <div className="text-sm"><span className="mr-2 text-xs text-muted-foreground md:hidden">Date added</span>{user.joiningDate || "-"}</div>
              <div className="absolute right-3 top-4 md:static md:justify-self-end">
                <Button variant="ghost" className="h-9 w-9 px-0" aria-label={`Actions for ${user.name}`} onClick={() => setMenuId(menuId === user.id ? null : user.id)}><MoreVertical className="h-4 w-4" /></Button>
                {menuId === user.id ? <div className="absolute right-0 z-30 mt-1 w-44 rounded-md border border-border bg-white p-1 shadow-soft">
                  <MenuButton icon={Eye} label="View details" onClick={() => { setViewing(user); setMenuId(null); }} />
                  <MenuButton icon={Edit} label="Edit user" disabled={!canEdit} onClick={() => { openEdit(user); setMenuId(null); }} />
                  <MenuButton icon={user.status === "Active" ? UserX : UserCheck} label={user.status === "Active" ? "Set inactive" : "Set active"} disabled={!canEdit} onClick={() => toggleStatus(user)} />
                </div> : null}
              </div>
            </article>;
          })}
        </div>
        {!visible.length ? <p className="p-8 text-center text-sm text-muted-foreground">No users match the current search and filters.</p> : null}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-sm text-muted-foreground">Page {page} of {pageCount}</span>
          <div className="flex gap-1">{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <Button key={number} variant={page === number ? "primary" : "ghost"} className="h-9 min-w-9 px-2" onClick={() => setPage(number)}>{number}</Button>)}</div>
        </div>
      </div>

      <FormModal open={formOpen} title={editing ? "Edit user" : "Add user"} onClose={() => setFormOpen(false)} className="max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          {error ? <p className="rounded-md bg-danger/10 p-3 text-sm font-medium text-danger sm:col-span-2">{error}</p> : null}
          <label className="space-y-1 sm:col-span-2"><span className="text-sm font-medium">Profile picture</span><Input type="file" accept="image/*" onChange={(event) => {
            const file = event.target.files?.[0]; if (!file) return;
            const reader = new FileReader(); reader.onload = () => setDraft({ ...draft, avatar: String(reader.result) }); reader.readAsDataURL(file);
          }} /></label>
          {formFields.map(([key, label]) => <Field key={key} label={label}><Input type={key === "joiningDate" ? "date" : key === "email" ? "email" : "text"} value={draft[key] ?? ""} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} /></Field>)}
          {!editing ? <><Field label="Password"><Input type="password" value={draft.password ?? ""} onChange={(event) => setDraft({ ...draft, password: event.target.value })} /></Field><Field label="Confirm Password"><Input type="password" value={draft.confirmPassword ?? ""} onChange={(event) => setDraft({ ...draft, confirmPassword: event.target.value })} /></Field></> : null}
          <Field label="Role"><Select value={draft.roleId ?? ""} onChange={(event) => setDraft({ ...draft, roleId: event.target.value })}>{store.roles.filter((role) => role.status !== "Inactive").map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</Select></Field>
          <Field label="Branch"><Select value={draft.branchId ?? ""} onChange={(event) => setDraft({ ...draft, branchId: event.target.value })}>{store.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</Select></Field>
          <Field label="Department"><Select value={draft.departmentId ?? ""} onChange={(event) => setDraft({ ...draft, departmentId: event.target.value })}>{store.departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</Select></Field>
          <Field label="Reporting Manager"><Select value={draft.managerId ?? ""} onChange={(event) => setDraft({ ...draft, managerId: event.target.value })}><option value="">No manager</option>{store.users.filter((user) => user.roleId === "manager").map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</Select></Field>
          <Field label="Status"><Select value={draft.status ?? "Active"} onChange={(event) => setDraft({ ...draft, status: event.target.value })}><option>Active</option><option>Inactive</option><option>Suspended</option></Select></Field>
          <div className="flex justify-end gap-2 sm:col-span-2"><Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button><Button onClick={saveUser}>{editing ? "Save changes" : "Add user"}</Button></div>
        </div>
      </FormModal>

      <FormModal open={Boolean(viewing)} title="User details" onClose={() => setViewing(null)} className="max-w-3xl">
        {viewing ? <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Name", viewing.name], ["Email", viewing.email], ["Phone", viewing.phone], ["Role", roleById[viewing.roleId]?.name],
            ["Branch", branchById[viewing.branchId ?? viewing.branchIds[0]]?.name], ["Department", departmentById[viewing.departmentId ?? viewing.departmentIds[0]]?.name],
            ["Reporting Manager", userById[viewing.managerId ?? ""]?.name], ["Employee Code", viewing.employeeCode], ["Joining Date", viewing.joiningDate], ["Status", viewing.status]
          ].map(([label, value]) => <div key={label} className="rounded-md border border-border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value || "-"}</p></div>)}
        </div> : null}
      </FormModal>

      <FormModal open={importOpen} title="Import users" onClose={() => setImportOpen(false)} className="max-w-xl">
        <div className="space-y-4"><p className="text-sm text-muted-foreground">Upload an Excel file using the exported template headings.</p><Input type="file" accept=".xlsx,.xls" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importUsers(file); }} /></div>
      </FormModal>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-1"><span className="text-sm font-medium">{label}</span>{children}</label>;
}

function AccessBadge({ children, tone }: { children: React.ReactNode; tone: "role" | "branch" | "department" }) {
  const tones = {
    role: "border-emerald-200 bg-emerald-50 text-emerald-700",
    branch: "border-sky-200 bg-sky-50 text-sky-700",
    department: "border-violet-200 bg-violet-50 text-violet-700"
  };
  return <span className={`max-w-40 truncate rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

function MenuButton({ icon: Icon, label, onClick, disabled = false }: { icon: typeof Eye; label: string; onClick: () => void; disabled?: boolean }) {
  return <button type="button" disabled={disabled} onClick={onClick} className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"><Icon className="h-4 w-4" />{label}</button>;
}

function legacyRole(roleId: string): StoredUser["role"] {
  if (roleId === "owner") return "Owner";
  if (roleId === "admin" || roleId === "manager") return "Admin";
  return "Staff";
}

function normalizeStatus(status: string): StoredUser["status"] {
  return status === "Inactive" || status === "Suspended" ? status : "Active";
}
