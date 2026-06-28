"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { settingsRegistry, type SettingField } from "@/config/settings/registry";
import { AuthService, SettingsService } from "@/lib/services";
import { applyPrimaryColor } from "@/lib/theme";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";

export function SettingsForm() {
  const store = useLocalStore();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Record<string, unknown>>(() => ({ ...store.settings }));
  const [saved, setSaved] = useState(false);
  const roleId = AuthService.currentRole()?.id ?? "viewer";
  const results = useMemo(() => settingsRegistry.searchableFields(query, roleId), [query, roleId]);

  useEffect(() => {
    setDraft({ ...store.settings });
  }, [store.settings]);

  function update(field: SettingField, value: string | boolean) {
    setSaved(false);
    setDraft((current) => ({ ...current, [field.slug]: value }));
    if (field.slug === "primaryColor") applyPrimaryColor(String(value));
  }

  function saveSettings() {
    SettingsService.update(draft as Parameters<typeof SettingsService.update>[0]);
    setSaved(true);
  }

  return (
    <div className="space-y-5">
      <label className="dashboard-surface relative block p-4">
        <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search settings" />
      </label>
      <section className="dashboard-surface p-5">
          <div className="settings-fields">
            {results.map(({ field }) => {
              const value = draft[field.slug] ?? field.defaultValue;
              const editable = field.editableRoles.includes(roleId);
              return <div key={field.slug} id={field.slug} className="settings-field min-w-0 space-y-2">
                <label className="text-sm font-medium">{field.label}</label>
                <SettingControl field={field} value={value} disabled={!editable} onChange={(next) => update(field, next)} />
              </div>;
            })}
          </div>
      </section>
      <div className="dashboard-surface flex items-center justify-end gap-3 p-4">
        {saved ? <span className="text-sm font-medium text-success">Settings saved</span> : null}
        <Button type="button" onClick={saveSettings} disabled={roleId !== "owner" && !AuthService.can("update", "Settings")}>Save Settings</Button>
      </div>
    </div>
  );
}

function SettingControl({ field, value, disabled, onChange }: {
  field: SettingField;
  value: unknown;
  disabled: boolean;
  onChange: (value: string | boolean) => void;
}) {
  if (field.control === "textarea") return <Textarea value={String(value ?? "")} disabled={disabled} onChange={(event) => onChange(event.target.value)} />;
  if (field.control === "dropdown") {
    const selectedValue = field.slug === "dateFormat" ? String(value ?? "").toUpperCase() : String(value ?? "");
    return <Select value={selectedValue} disabled={disabled} onChange={(event) => onChange(event.target.value)}>{field.options?.map((option) => <option key={option}>{option}</option>)}</Select>;
  }
  if (field.control === "toggle") return <input type="checkbox" checked={Boolean(value)} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className="block h-5 w-5 accent-primary" />;
  if (field.control === "color") return <input
    aria-label={field.label}
    className="color-picker-square"
    style={{ width: 48, height: 48, minWidth: 48, maxWidth: 48, minHeight: 48, maxHeight: 48 }}
    type="color"
    value={String(value ?? "#0f766e")}
    disabled={disabled}
    onChange={(event) => onChange(event.target.value)}
  />;
  if (field.control === "image") return <div className="space-y-3">
    <Input className="max-w-full file:mr-2 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1" type="file" accept="image/*" disabled={disabled} onChange={(event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => onChange(String(reader.result));
      reader.readAsDataURL(file);
    }} />
    {value ? <Image src={String(value)} alt="Company logo preview" width={72} height={72} unoptimized className="h-[72px] w-[72px] rounded-md border border-border object-contain" /> : null}
    {value && !disabled ? <Button type="button" variant="secondary" onClick={() => onChange("")}>Remove logo</Button> : null}
  </div>;
  return <Input type={field.control === "phone" ? "tel" : field.control} value={String(value ?? "")} placeholder={field.placeholder} disabled={disabled} onChange={(event) => onChange(event.target.value)} />;
}
