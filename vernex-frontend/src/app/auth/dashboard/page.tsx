import { redirect } from "next/navigation";

export default function AuthDashboardRedirectPage() {
  redirect("/dashboard");
}
