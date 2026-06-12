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

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AuthFields>();

  const onSubmit = handleSubmit((values) => {
    setError("");
    if (mode === "register" && values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      if (mode === "login") {
        AuthService.login(values.email);
      } else {
        AuthService.signup({
          id: `USR-${Date.now()}`,
          name: values.name,
          email: values.email,
          phone: values.phone,
          role: values.role === "Owner" ? "Owner" : values.role === "Manager" ? "Admin" : "Staff",
          roleId: (values.role ?? "staff").toLowerCase().replaceAll(" ", "-"),
          status: "Active",
          lastActive: "Now",
          companyName: values.companyName,
          companySize: values.companySize,
          industry: values.industry,
          branchIds: values.assignedBranch ? [values.assignedBranch] : ["branch-chennai"],
          departmentIds: values.department ? [values.department] : ["dept-sales"]
        });
      }
      setLoading(false);
      router.push("/dashboard");
    }, 550);
  });

  return (
    <form onSubmit={onSubmit} className="dashboard-surface w-full max-w-md space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">{mode === "login" ? "Login to Vernex" : "Create Vernex account"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Demo authentication for owner, admin, and staff access.
        </p>
      </div>
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
              <option>Owner</option>
              <option>Manager</option>
              <option>Staff</option>
              <option>Sales Executive</option>
              <option>Analyst</option>
              <option>Viewer</option>
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
              <Input {...register("companyRegistrationNumber")} placeholder="Owner specific" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Number Of Branches</span>
              <Input {...register("numberOfBranches")} placeholder="Owner specific" />
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
