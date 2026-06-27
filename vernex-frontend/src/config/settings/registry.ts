import branding from "@/config/settings/branding.json";
import business from "@/config/settings/business.json";
import company from "@/config/settings/company.json";
import notifications from "@/config/settings/notifications.json";

export type SettingField = {
  slug: string;
  label: string;
  description: string;
  control: string;
  placeholder?: string;
  defaultValue: string | boolean | number;
  options?: string[];
  editableRoles: string[];
  visibleRoles: string[];
  dependency?: { slug: string; equals: string | boolean | number };
};

export type SettingSection = {
  heading: string;
  subheading: string;
  fields: SettingField[];
};

const sections = [company, branding, business, notifications] as SettingSection[];

export const settingsRegistry = {
  sections,
  searchableFields(query: string, roleId: string) {
    const normalized = query.trim().toLowerCase();
    return sections.flatMap((section) =>
      section.fields
        .filter((field) => field.visibleRoles.includes(roleId))
        .filter((field) => !normalized || `${section.heading} ${section.subheading} ${field.slug} ${field.label} ${field.description}`.toLowerCase().includes(normalized))
        .map((field) => ({ section, field }))
    );
  }
};
