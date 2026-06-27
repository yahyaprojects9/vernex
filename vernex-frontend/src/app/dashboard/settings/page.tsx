import { PageHeader } from "@/components/layout/PageHeader";
import { SettingsForm } from "@/modules/shared-core/SettingsForm";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="JSON-driven company, branding, business, appearance, and notification configuration." breadcrumbs={["Organization", "Settings"]} />
      <SettingsForm />
    </>
  );
}
