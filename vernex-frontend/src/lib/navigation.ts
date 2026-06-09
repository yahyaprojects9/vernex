import {
  BarChart3,
  Bot,
  ChartNoAxesCombined,
  FileText,
  Handshake,
  Inbox,
  LayoutDashboard,
  MessageSquareText,
  PackageSearch,
  ReceiptText,
  Settings,
  TrendingUp,
  Upload,
  Users,
  WalletCards
} from "lucide-react";
import type { NavigationGroup } from "@/types/navigation";

export const navigationGroups: NavigationGroup[] = [
  {
    label: "Shared Core Platform",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Users", href: "/dashboard/users", icon: Users },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
      { label: "Reports", href: "/dashboard/reports", icon: FileText }
    ]
  },
  {
    label: "Social Media AI Sales Agent",
    items: [
      { label: "Overview", href: "/dashboard/sales-agent", icon: Bot },
      { label: "Leads", href: "/dashboard/sales-agent/leads", icon: Inbox },
      { label: "Quotations", href: "/dashboard/sales-agent/quotations", icon: ReceiptText },
      { label: "Conversations", href: "/dashboard/sales-agent/conversations", icon: MessageSquareText },
      { label: "AI Auto Reply", href: "/dashboard/sales-agent/ai-auto-reply", icon: Bot },
      { label: "Follow-up Automation", href: "/dashboard/sales-agent/follow-up-automation", icon: Handshake },
      { label: "CRM Pipeline", href: "/dashboard/sales-agent/crm-pipeline", icon: ChartNoAxesCombined },
      { label: "Human Handoff", href: "/dashboard/sales-agent/human-handoff", icon: Users },
      { label: "Analytics", href: "/dashboard/sales-agent/analytics", icon: BarChart3 }
    ]
  },
  {
    label: "Profit Analysis Tool",
    items: [
      { label: "Overview", href: "/dashboard/profit-analysis", icon: TrendingUp },
      { label: "Sales Analytics", href: "/dashboard/profit-analysis/sales-analytics", icon: Upload },
      { label: "Peak Hour Analysis", href: "/dashboard/profit-analysis/peak-hour-analysis", icon: BarChart3 },
      { label: "Delivery Platforms", href: "/dashboard/profit-analysis/delivery-platform-analysis", icon: WalletCards },
      { label: "Product Performance", href: "/dashboard/profit-analysis/product-performance", icon: PackageSearch },
      { label: "Cost Tracking", href: "/dashboard/profit-analysis/cost-tracking", icon: ReceiptText },
      { label: "Wastage Tracking", href: "/dashboard/profit-analysis/wastage-tracking", icon: ChartNoAxesCombined },
      { label: "Profit Reports", href: "/dashboard/profit-analysis/profit-reports", icon: FileText }
    ]
  }
];
