import Link from "next/link";
import { AuthForm } from "@/modules/shared-core/AuthForm";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <AuthForm mode="register" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link className="font-semibold text-primary" href="/auth/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
