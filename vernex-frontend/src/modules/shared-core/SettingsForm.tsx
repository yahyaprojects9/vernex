"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { AuthService, SettingsService } from "@/lib/services";
import { settingsRegistry, type SettingField } from "@/config/settings/registry";
import { useLocalStore } from "@/modules/shared-core/useLocalStore";

export function SettingsForm() {
  const store = useLocalStore();
  const [query, setQuery] = useState("");
  const roleId = AuthService.currentRole()?.id ?? "viewer";
  const results = useMemo(() => settingsRegistry.searchableFields(query, roleId), [query, roleId]);
  const grouped = useMemo(() => {
    return results.reduce<Record<string, typeof results>>((groups, result) => {
      (groups[result.section.heading] ??= []).push(result);
      return groups;
    }, {});
  }, [results]);

  function update(field: SettingField, value: string | boolean) {
    SettingsService.update({ [field.slug]: value } as Parameters<typeof SettingsService.update>[0]);
  }

  return (
    <div className="space-y-5">
      <label className="dashboard-surface relative block p-4">
        <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search settings by heading, label, slug, or description" />
      </label>
      {Object.entries(grouped).map(([heading, items]) => (
        <section key={heading} className="dashboard-surface p-5">
          <h2 className="text-lg font-semibold">{heading}</h2>
          <p className="text-sm text-muted-foreground">{items[0]?.section.subheading}</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {items.map(({ field }) => {
              const value = (store.settings as Record<string, unknown>)[field.slug] ?? field.defaultValue;
              const editable = field.editableRoles.includes(roleId);
              return <label key={field.slug} id={field.slug} className="space-y-1">
                <span className="text-sm font-medium">{field.label}</span>
                <span className="block text-xs text-muted-foreground">{field.description}</span>
                <SettingControl field={field} value={value} disabled={!editable} onChange={(next) => update(field, next)} />
              </label>;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function SettingControl({ field, value, disabled, onChange }: { field: SettingField; value: unknown; disabled: boolean; onChange: (value: string | boolean) => void }) {
  if (field.control === "textarea") return <Textarea value={String(value ?? "")} disabled={disabled} onChange={(event) => onChange(event.target.value)} />;
  if (field.control === "dropdown") return <Select value={String(value ?? "")} disabled={disabled} onChange={(event) => onChange(event.target.value)}>{field.options?.map((option) => <option key={option}>{option}</option>)}</Select>;
  if (field.control === "toggle") return <input type="checkbox" checked={Boolean(value)} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-teal-700" />;
  if (field.control === "image") return <div className="flex flex-col gap-3 rounded-md border border-dashed border-input p-3 sm:flex-row sm:items-center">
    {value ? <Image src={String(value)} alt="Company logo preview" width={64} height={64} unoptimized className="h-16 w-16 self-center rounded-md object-contain sm:self-auto" /> : <span className="h-16 w-16 self-center rounded-md bg-muted sm:self-auto" aria-label="No company logo" />}
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <Input className="max-w-full file:mr-2 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1" type="file" accept="image/*" disabled={disabled} onChange={(event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => onChange(String(reader.result));
        reader.readAsDataURL(file);
      }} />
      {value && !disabled ? <Button type="button" variant="secondary" className="w-full sm:w-fit" onClick={() => onChange("")}>Remove logo</Button> : null}
    </div>
  </div>;
  return <Input type={field.control === "phone" ? "tel" : field.control} value={String(value ?? "")} placeholder={field.placeholder} disabled={disabled} onChange={(event) => onChange(event.target.value)} />;
}
