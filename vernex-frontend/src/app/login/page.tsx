import Link from "next/link";
import { AuthForm } from "@/components/modules/shared-core/AuthForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <AuthForm mode="login" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          New to Vernex? <Link className="font-semibold text-primary" href="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
