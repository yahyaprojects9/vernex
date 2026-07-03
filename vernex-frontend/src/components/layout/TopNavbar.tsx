"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Edit, LogOut, Menu, Save, Search, UserCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthService, StorageService } from "@/lib/services";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";

export function TopNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLLabelElement>(null);
  const [profileDraft, setProfileDraft] = useState({
    name: "",
    phone: "",
    companyName: "",
    industry: "",
    companySize: "",
    team: "",
    reportingManager: ""
  });
  const store = useLocalStore();
  const currentUser = AuthService.currentUser();
  const currentRole = currentUser ? store.roles.find((role) => role.id === currentUser.roleId) : null;
  const searchResults = searchTerm.trim() ? [
    ...store.roles.filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => ({ group: "Roles", label: item.name, href: "/dashboard/roles" })),
    ...store.users.filter((item) => `${item.name} ${item.email} ${item.phone} ${item.employeeCode ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => ({ group: "Users", label: item.name, href: "/dashboard/users" })),
    ...store.branches.filter((item) => `${item.name} ${item.location ?? ""} ${item.code ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => ({ group: "Branches", label: item.name, href: "/dashboard/branches" })),
    ...store.departments.filter((item) => `${item.name} ${item.description ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => ({ group: "Departments", label: item.name, href: "/dashboard/departments" })),
    ...store.reports.filter((item) => `${item.period} ${item.salesSummary}`.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => ({ group: "Reports", label: `${item.period} report`, href: "/dashboard/reports" }))
  ].slice(0, 12) : [];

  useEffect(() => {
    if (!currentUser) return;
    setProfileDraft({
      name: currentUser.name ?? "",
      phone: currentUser.phone ?? "",
      companyName: currentUser.companyName ?? "",
      industry: currentUser.industry ?? "",
      companySize: currentUser.companySize ?? "",
      team: currentUser.team ?? "",
      reportingManager: currentUser.reportingManager ?? ""
    });
  }, [currentUser]);

  useEffect(() => {
    function closePopups(event: MouseEvent) {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
        setEditingProfile(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(target)) setNotificationsOpen(false);
      if (searchRef.current && !searchRef.current.contains(target)) setSearchTerm("");
    }
    document.addEventListener("mousedown", closePopups);
    return () => document.removeEventListener("mousedown", closePopups);
  }, []);

  function logout() {
    AuthService.logout();
    router.replace("/login");
  }

  function saveProfile() {
    AuthService.updateCurrentUserProfile(profileDraft);
    setEditingProfile(false);
  }

  return (
    <header className="sticky top-0 z-40 flex shrink-0 flex-wrap items-center gap-3 border-b border-border bg-background/95 px-3 py-3 backdrop-blur md:flex-nowrap md:px-6">
      <Button variant="ghost" className="h-10 w-10 shrink-0 px-0 lg:hidden" onClick={onMenuClick} aria-label="Open sidebar">
        <Menu className="h-5 w-5" />
      </Button>
      <label ref={searchRef} className="relative order-3 w-full md:order-none md:block md:max-w-3xl md:flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="bg-white pl-9" placeholder="Search roles, users, branches, departments, reports" />
        {searchResults.length ? <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-md border border-border bg-white p-2 shadow-soft">
          {searchResults.map((result, index) => <button key={`${result.group}-${result.label}-${index}`} type="button" className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-muted" onClick={() => { setSearchTerm(""); router.push(result.href); }}>
            <span>{result.label}</span><span className="text-xs text-muted-foreground">{result.group}</span>
          </button>)}
        </div> : null}
      </label>
      <div className="ml-auto flex min-w-0 items-center gap-2">
        <div ref={notificationRef} className="relative">
          <Button variant="ghost" className="h-10 w-10 px-0" aria-label="Notifications" onClick={() => setNotificationsOpen((value) => !value)}>
            <Bell className="h-5 w-5" />
          </Button>
          {notificationsOpen ? <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1rem)] rounded-md border border-border bg-white p-3 shadow-soft">
            <h3 className="font-semibold">Notifications</h3>
            <div className="mt-2 space-y-2 text-sm">
              <p className="rounded-md bg-muted p-2">{store.handoffs.filter((item) => item.status === "Pending").length} pending handoffs</p>
              <p className="rounded-md bg-muted p-2">{store.leads.filter((item) => Boolean(item.nextFollowUp) && !["Converted", "Lost"].includes(item.status)).length} lead follow-ups</p>
              <p className="rounded-md bg-muted p-2">{store.imports.filter((item) => item.status === "Failed").length} failed imports</p>
            </div>
          </div> : null}
        </div>
        <div ref={profileRef} className="relative">
          <button
            type="button"
            className="focus-ring grid h-12 w-12 shrink-0 place-items-center rounded-md border border-border bg-white text-primary transition hover:bg-muted"
            onClick={() => setProfileOpen((value) => !value)}
            aria-label="Open profile"
            aria-expanded={profileOpen}
            title={currentUser?.name ?? "Profile"}
          >
            <UserCircle className="h-7 w-7" />
          </button>
          {profileOpen ? (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1rem)] rounded-md border border-border bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">Profile</h3>
                <Button variant="secondary" className="h-9 px-2" onClick={() => setEditingProfile((value) => !value)}>
                  {editingProfile ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {editingProfile ? "Cancel" : "Edit"}
                </Button>
              </div>
              {editingProfile ? (
                <div className="mt-3 grid gap-2 text-sm">
                  {[
                    ["name", "Name"],
                    ["phone", "Phone"],
                    ["companyName", "Company Name"],
                    ["industry", "Industry"],
                    ["companySize", "Company Size"],
                    ["team", "Team"],
                    ["reportingManager", "Reporting Manager"]
                  ].map(([key, label]) => (
                    <label key={key} className="space-y-1">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <Input
                        value={profileDraft[key as keyof typeof profileDraft]}
                        onChange={(event) => setProfileDraft({ ...profileDraft, [key]: event.target.value })}
                      />
                    </label>
                  ))}
                  <Button onClick={saveProfile}>
                    <Save className="h-4 w-4" />
                    Save Profile
                  </Button>
                </div>
              ) : (
                <dl className="mt-3 space-y-2 text-sm">
                  <div><dt className="text-xs text-muted-foreground">Name</dt><dd className="font-medium">{currentUser?.name ?? "Guest"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Email</dt><dd className="break-all font-medium">{currentUser?.email ?? "Not signed in"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Role</dt><dd className="font-medium">{currentRole?.name ?? currentUser?.roleId ?? "Guest"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Phone</dt><dd className="font-medium">{currentUser?.phone || "Not set"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Company</dt><dd className="font-medium">{currentUser?.companyName || "Not set"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Industry</dt><dd className="font-medium">{currentUser?.industry || "Not set"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Company Size</dt><dd className="font-medium">{currentUser?.companySize || "Not set"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Team</dt><dd className="font-medium">{currentUser?.team || "Not set"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Reporting Manager</dt><dd className="font-medium">{currentUser?.reportingManager || "Not set"}</dd></div>
                </dl>
              )}
              <Button variant="danger" className="mt-4 w-full" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : null}
        </div>
        <Button variant="secondary" onClick={() => StorageService.reset()} className="hidden md:inline-flex">
          Reset data
        </Button>
      </div>
    </header>
  );
}

