"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/StateViews";
import departmentsConfig from "@/config/departments.json";
import branchesConfig from "@/config/branches.json";
import { AuthService } from "@/lib/services";

type AuthFields = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role?: string;
  companyName: string;
  companySize: string;
  industry: string;
  companyRegistrationNumber?: string;
  numberOfBranches?: string;
  department?: string;
  assignedBranch?: string;
  team?: string;
  reportingManager?: string;
};

const roleOptions = [
  { id: "owner", label: "Owner", email: "owner@vernex.demo", password: "owner123" },
  { id: "manager", label: "Manager", email: "manager@vernex.demo", password: "manager123" },
  { id: "admin", label: "Admin", email: "admin@vernex.demo", password: "admin123" },
  { id: "staff", label: "Staff", email: "staff@vernex.demo", password: "staff123" },
  { id: "sales-executive", label: "Sales Executive", email: "user4@vernex.demo", password: "sales123" },
  { id: "analyst", label: "Analyst", email: "analyst@vernex.demo", password: "analyst123" },
  { id: "viewer", label: "Viewer", email: "viewer@vernex.demo", password: "viewer123" }
];

const roleToLegacyDisplayRole = (roleId: string) => {
  if (roleId === "owner") return "Owner";
  if (roleId === "admin" || roleId === "manager") return "Admin";
  return "Staff";
};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AuthFields>({
    defaultValues: {
      role: mode === "login" ? "owner" : "Owner",
      companySize: "51-200",
      companyName: "Vernex Demo Bistro",
      industry: "Restaurant & Catering",
      department: departmentsConfig[0]?.id,
      assignedBranch: branchesConfig[0]?.id
    }
  });

  const selectedRole = watch("role");

  const onSubmit = handleSubmit((values) => {
    setError("");
    if (mode === "register" && values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      try {
        if (mode === "login") {
          AuthService.login(values.email, values.password, values.role);
        } else {
          const roleId = (values.role ?? "staff").toLowerCase().replaceAll(" ", "-");
          AuthService.signup({
            id: `USR-${Date.now()}`,
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone,
            role: roleToLegacyDisplayRole(roleId),
            roleId,
            status: "Active",
            lastActive: "Now",
            companyName: values.companyName,
            companySize: values.companySize,
            industry: values.industry,
            companyRegistrationNumber: values.companyRegistrationNumber,
            numberOfBranches: values.numberOfBranches,
            team: values.team,
            reportingManager: values.reportingManager,
            managerId: values.reportingManager,
            branchIds: values.assignedBranch ? [values.assignedBranch] : ["branch-chennai"],
            departmentIds: values.department ? [values.department] : ["dept-sales"]
          });
        }
        setLoading(false);
        router.push("/dashboard");
      } catch (authError) {
        setLoading(false);
        setError(authError instanceof Error ? authError.message : "Authentication failed.");
      }
    }, 550);
  });

  return (
    <form onSubmit={onSubmit} className="dashboard-surface w-full max-w-md space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">{mode === "login" ? "Login to Vernex" : "Create Vernex account"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Role-aware local authentication backed by seeded demo users and registered accounts.
        </p>
      </div>
      {mode === "login" ? (
        <div className="rounded-md border border-border bg-muted/60 p-3">
          <p className="text-sm font-semibold">Seeded demo accounts</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {roleOptions.slice(0, 6).map((role) => (
              <button
                key={role.id}
                type="button"
                className="rounded-md bg-white px-3 py-2 text-left text-xs font-medium hover:bg-primary/10"
                onClick={() => {
                  setValue("role", role.id);
                  setValue("email", role.email);
                  setValue("password", role.password);
                }}
              >
                {role.label}
                <span className="block text-muted-foreground">{role.email}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {error ? <ErrorState title="Authentication failed" description={error} /> : null}
      {mode === "register" ? (
        <label className="block space-y-1">
          <span className="text-sm font-medium">Full name</span>
          <Input {...register("name", { required: "Name is required" })} placeholder="Aarav Sharma" />
          {errors.name ? <span className="text-xs text-danger">{errors.name.message}</span> : null}
        </label>
      ) : null}
      <label className="block space-y-1">
        <span className="text-sm font-medium">Email</span>
        <Input
          type="email"
          {...register("email", { required: "Email is required" })}
          placeholder="admin@vernex.demo"
        />
        {errors.email ? <span className="text-xs text-danger">{errors.email.message}</span> : null}
      </label>
      {mode === "login" ? (
        <label className="block space-y-1">
          <span className="text-sm font-medium">Role</span>
          <Select {...register("role", { required: "Role is required" })}>
            {roleOptions.map((role) => (
              <option key={role.id} value={role.id}>{role.label}</option>
            ))}
          </Select>
        </label>
      ) : null}
      {mode === "register" ? (
        <label className="block space-y-1">
          <span className="text-sm font-medium">Phone</span>
          <Input {...register("phone", { required: "Phone is required" })} placeholder="+91 98765 43210" />
        </label>
      ) : null}
      <label className="block space-y-1">
        <span className="text-sm font-medium">Password</span>
        <Input
          type="password"
          {...register("password", { required: "Password is required", minLength: 6 })}
          placeholder="Enter password"
        />
        {errors.password ? <span className="text-xs text-danger">Password must be at least 6 characters.</span> : null}
      </label>
      {mode === "register" ? (
        <label className="block space-y-1">
          <span className="text-sm font-medium">Confirm Password</span>
          <Input type="password" {...register("confirmPassword", { required: "Confirm password is required" })} placeholder="Confirm password" />
        </label>
      ) : null}
      {mode === "register" ? (
        <>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Role</span>
            <Select {...register("role")}>
              {roleOptions.map((role) => (
                <option key={role.id}>{role.label}</option>
              ))}
            </Select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium">Company Name</span>
              <Input {...register("companyName", { required: true })} placeholder="Company name" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Company Size</span>
              <Select {...register("companySize")}>
                <option>1-10</option>
                <option>11-50</option>
                <option>51-200</option>
                <option>201-500</option>
              </Select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Industry</span>
              <Input {...register("industry")} placeholder="Restaurant, Retail, Services" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Company Registration Number</span>
              <Input {...register("companyRegistrationNumber", { required: selectedRole === "Owner" })} placeholder="Owner specific" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Number Of Branches</span>
              <Input {...register("numberOfBranches", { required: selectedRole === "Owner" })} placeholder="Owner specific" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Department</span>
              <Select {...register("department")}>
                {departmentsConfig.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
              </Select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Assigned Branch</span>
              <Select {...register("assignedBranch")}>
                {branchesConfig.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
              </Select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Team</span>
              <Input {...register("team")} placeholder="Staff specific" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Reporting Manager</span>
              <Input {...register("reportingManager")} placeholder="Manager name or ID" />
            </label>
          </div>
        </>
      ) : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Please wait" : mode === "login" ? "Login" : "Register"}
      </Button>
      <button type="button" className="text-sm font-semibold text-primary" onClick={() => setError("Use any demo email and a password with 6 characters.")}>
        Test error state
      </button>
    </form>
  );
}
