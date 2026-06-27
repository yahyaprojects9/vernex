"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/StateViews";
import departmentsConfig from "@/config/departments.json";
import branchesConfig from "@/config/branches.json";
import { AuthService } from "@/lib/services";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";

const departmentOptions = departmentsConfig as { id: string; name: string }[];
const branchOptions = branchesConfig as { id: string; name: string }[];

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
  { id: "owner", label: "Owner" },
  { id: "manager", label: "Manager" },
  { id: "admin", label: "Admin" },
  { id: "staff", label: "Staff" },
  { id: "sales-executive", label: "Sales Executive" },
  { id: "analyst", label: "Analyst" },
  { id: "viewer", label: "Viewer" }
];

const mockCredentials = [
  { role: "Owner", email: "owner@vernex.local", password: "Mock@12345" },
  { role: "Manager", email: "manager@vernex.local", password: "Mock@12345" },
  { role: "Admin", email: "admin@vernex.local", password: "Mock@12345" },
  { role: "Staff", email: "staff@vernex.local", password: "Mock@12345" },
  { role: "Sales Executive", email: "sales@vernex.local", password: "Mock@12345" },
  { role: "Analyst", email: "analyst@vernex.local", password: "Mock@12345" }
];

const roleToLegacyDisplayRole = (roleId: string) => {
  if (roleId === "owner") return "Owner";
  if (roleId === "admin" || roleId === "manager") return "Admin";
  return "Staff";
};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const store = useLocalStore();
  const companyName = store.settings.companyName || store.settings.brandName;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<AuthFields>({
    defaultValues: {
      role: mode === "login" ? "owner" : "Owner",
      companySize: "51-200",
      companyName: "",
      industry: "",
      department: "",
      assignedBranch: ""
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
          router.push(AuthService.roleHomePath());
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
            branchIds: values.assignedBranch ? [values.assignedBranch] : [],
            departmentIds: values.department ? [values.department] : []
          });
          router.push(AuthService.roleHomePath());
        }
        setLoading(false);
      } catch (authError) {
        setLoading(false);
        setError(authError instanceof Error ? authError.message : "Authentication failed.");
      }
    }, 550);
  });

  return (
    <form onSubmit={onSubmit} className="dashboard-surface w-full max-w-md space-y-4 p-6">
      <div>
        <div className="mb-3 flex items-center gap-3">
          {store.settings.companyLogo ? <Image src={store.settings.companyLogo} alt="" width={40} height={40} unoptimized className="h-10 w-10 rounded-md object-cover" /> : null}
          <h1 className="text-2xl font-bold">{mode === "login" ? `Login to ${companyName}` : `Create ${companyName} account`}</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Role-aware local authentication. Sign up first to create the first account.
        </p>
      </div>
      {error ? <ErrorState title="Authentication failed" description={error} /> : null}
      {mode === "register" ? (
        <label className="block space-y-1">
          <span className="text-sm font-medium">Full name</span>
          <Input {...register("name", { required: "Name is required" })} placeholder="Full name" />
          {errors.name ? <span className="text-xs text-danger">{errors.name.message}</span> : null}
        </label>
      ) : null}
      <label className="block space-y-1">
        <span className="text-sm font-medium">Email</span>
        <Input
          type="email"
          {...register("email", { required: "Email is required" })}
          placeholder="you@company.com"
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
          <Input {...register("phone", { required: "Phone is required" })} placeholder="Phone number" />
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
              <Input {...register("industry")} placeholder="Industry" />
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
                <option value="">No department yet</option>
                {departmentOptions.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
              </Select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Assigned Branch</span>
              <Select {...register("assignedBranch")}>
                <option value="">No branch yet</option>
                {branchOptions.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
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
      {mode === "login" ? (
        <>
          <Link href="/forgot-password" className="block text-center text-sm font-semibold text-primary">Forgot password?</Link>
          <div className="rounded-md border border-border bg-muted/50 p-3">
            <p className="text-sm font-semibold">Mock login IDs</p>
            <div className="mt-2 max-h-44 space-y-2 overflow-y-auto text-xs">
              {mockCredentials.map((item) => (
                <div key={item.email} className="grid gap-1 rounded-md bg-white p-2 sm:grid-cols-[1fr_1.4fr_1fr]">
                  <span className="font-semibold">{item.role}</span>
                  <span>{item.email}</span>
                  <span>{item.password}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </form>
  );
}
