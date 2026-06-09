import { PageHeader } from "@/components/layout/PageHeader";
import { SettingsForm } from "@/components/modules/shared-core/SettingsForm";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Business profile, logo, working hours, language, currency, and notifications." breadcrumbs={["Shared Core Platform", "Settings"]} />
      <SettingsForm />
    </>
  );
}
