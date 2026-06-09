"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/StateViews";

type AuthFields = {
  name?: string;
  email: string;
  password: string;
  role?: string;
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

  const onSubmit = handleSubmit(() => {
    setError("");
    setLoading(true);
    window.setTimeout(() => {
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
          <span className="text-sm font-medium">Role</span>
          <Select {...register("role")}>
            <option>Owner</option>
            <option>Admin</option>
            <option>Staff</option>
          </Select>
        </label>
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
