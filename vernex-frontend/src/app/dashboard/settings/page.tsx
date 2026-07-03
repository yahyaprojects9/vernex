import { PageHeader } from "@/components/layout/PageHeader";
import { SettingsForm } from "@/modules/shared-core/SettingsForm";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" breadcrumbs={["Buisness Administration", "Settings"]} />
      <SettingsForm />
    </>
  );
}
