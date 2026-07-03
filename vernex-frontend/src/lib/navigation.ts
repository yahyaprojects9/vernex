import {
  BarChart3,
  Bot,
  Building2,
  ChartNoAxesCombined,
  CircleCheckBig,
  ClipboardCheck,
  FileText,
  Handshake,
  Gauge,
  Inbox,
  LayoutDashboard,
  MapPin,
  MessageSquareText,
  PackageSearch,
  ReceiptText,
  Settings,
  ShieldCheck,
  TrendingUp,
  Upload,
  Users,
  WalletCards
} from "lucide-react";
import navigationConfig from "@/config/navigation.json";
import type { NavigationGroup, NavigationItem } from "@/types/navigation";

const icons = {
  BarChart3,
  Bot,
  Building2,
  ChartNoAxesCombined,
  CircleCheckBig,
  ClipboardCheck,
  FileText,
  Handshake,
  Gauge,
  Inbox,
  LayoutDashboard,
  MapPin,
  MessageSquareText,
  PackageSearch,
  ReceiptText,
  Settings,
  ShieldCheck,
  TrendingUp,
  Upload,
  Users,
  WalletCards
};

type ConfigItem = Omit<NavigationItem, "icon"> & {
  icon: keyof typeof icons;
};

export const navigationGroups: NavigationGroup[] = navigationConfig.map((group) => ({
  label: group.label,
  items: (group.items as ConfigItem[]).map((item) => ({
    ...item,
    icon: icons[item.icon] ?? LayoutDashboard
  }))
}));
