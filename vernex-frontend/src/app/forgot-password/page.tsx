"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <form
        className="dashboard-surface w-full max-w-md space-y-4 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <div>
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your account email to start a local reset flow.</p>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Email</span>
          <Input type="email" required placeholder="you@company.com" />
        </label>
        {sent ? <p className="rounded-md bg-success/10 p-3 text-sm font-medium text-success">Reset instructions are ready for your configured email workflow.</p> : null}
        <Button type="submit" className="w-full">Send reset instructions</Button>
        <Link className="block text-center text-sm font-semibold text-primary" href="/login">Back to login</Link>
      </form>
    </main>
  );
}
