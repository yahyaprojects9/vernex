import type { Lead, SalesRecord } from "@/types";

export function groupLeadsBySource(leads: Lead[]) {
  return ["WhatsApp", "Website", "Email", "Manual"].map((source) => ({
    name: source,
    value: leads.filter((lead) => lead.source === source).length
  }));
}

export function groupSalesBySource(records: SalesRecord[]) {
  return ["Dine-in", "Swiggy", "Zomato", "Takeaway"].map((source) => ({
    name: source,
    value: records.filter((record) => record.orderSource === source).reduce((sum, record) => sum + record.totalAmount, 0)
  }));
}
