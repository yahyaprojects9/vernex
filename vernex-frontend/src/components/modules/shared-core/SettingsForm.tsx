"use client";

import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { businessSettings } from "@/lib/mock-data";

export function SettingsForm() {
  return (
    <form className="dashboard-surface grid gap-4 p-5 md:grid-cols-2">
      <label className="space-y-1">
        <span className="text-sm font-medium">Business name</span>
        <Input defaultValue={businessSettings.businessName} />
      </label>
      <label className="space-y-1">
        <span className="text-sm font-medium">Working hours</span>
        <Input defaultValue={businessSettings.workingHours} />
      </label>
      <label className="space-y-1">
        <span className="text-sm font-medium">Language</span>
        <Select defaultValue={businessSettings.language}>
          <option>English</option>
          <option>Hindi</option>
          <option>Malayalam</option>
          <option>Tamil</option>
        </Select>
      </label>
      <label className="space-y-1">
        <span className="text-sm font-medium">Currency</span>
        <Select defaultValue={businessSettings.currency}>
          <option>INR</option>
          <option>USD</option>
          <option>AED</option>
        </Select>
      </label>
      <label className="dashboard-surface flex cursor-pointer items-center justify-center border-dashed p-5 text-sm font-medium md:col-span-2">
        Upload logo
        <input type="file" className="sr-only" />
      </label>
      <div className="flex items-center justify-between rounded-md bg-muted/70 p-4 md:col-span-2">
        <div>
          <p className="font-semibold">Notifications</p>
          <p className="text-sm text-muted-foreground">Lead alerts, report reminders, and handoff updates.</p>
        </div>
        <input type="checkbox" defaultChecked className="h-5 w-5 accent-teal-700" />
      </div>
      <div className="md:col-span-2">
        <Button type="button">Save settings</Button>
      </div>
    </form>
  );
}
