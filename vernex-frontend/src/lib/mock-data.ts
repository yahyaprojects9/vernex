import type {
  BusinessSettings,
  Conversation,
  CostTracking,
  FollowUpRule,
  HandoffRequest,
  Lead,
  MenuItemPerformance,
  MessageTemplate,
  ProfitReport,
  Quotation,
  SalesRecord,
  User,
  WastageEntry
} from "@/types";

const names = [
  "Aarav Sharma",
  "Diya Nair",
  "Kabir Mehta",
  "Anika Rao",
  "Rohan Kapoor",
  "Meera Iyer",
  "Vihaan Patel",
  "Sara Khan",
  "Ishaan Menon",
  "Tara Singh"
];
const staff = ["Neha", "Arjun", "Maya", "Dev", "Priya"];
const items = ["Paneer Tikka", "Chicken Biryani", "Masala Dosa", "Veg Thali", "Cold Coffee", "Momos", "Pasta Alfredo", "Gulab Jamun"];
const categories = ["Starters", "Main Course", "Beverages", "Desserts", "Combos"];
const sources: Lead["source"][] = ["WhatsApp", "Website", "Email", "Manual"];
const statuses: Lead["status"][] = ["New", "Contacted", "Follow-up", "Interested", "Converted", "Lost"];
const scores: Lead["leadScore"][] = ["Hot", "Warm", "Cold"];

export const users: User[] = Array.from({ length: 20 }, (_, index) => ({
  id: `USR-${index + 1}`,
  name: names[index % names.length],
  email: `user${index + 1}@vernex.demo`,
  role: index % 5 === 0 ? "Owner" : index % 3 === 0 ? "Admin" : "Staff",
  status: index % 7 === 0 ? "Inactive" : "Active",
  lastActive: `${index + 1} hours ago`
}));

export const businessSettings: BusinessSettings = {
  businessName: "Vernex Demo Bistro",
  language: "English",
  currency: "INR",
  workingHours: "10:00 AM - 11:00 PM",
  notificationsEnabled: true
};

export const leads: Lead[] = Array.from({ length: 100 }, (_, index) => ({
  id: `LED-${String(index + 1).padStart(3, "0")}`,
  leadName: names[index % names.length],
  phone: `+91 98${String(70000000 + index * 731).slice(0, 8)}`,
  source: sources[index % sources.length],
  requirement: ["Catering enquiry", "Bulk order", "Birthday package", "Corporate lunch"][index % 4],
  budget: 5000 + (index % 12) * 2500,
  location: ["Kochi", "Bengaluru", "Chennai", "Hyderabad", "Mumbai"][index % 5],
  status: statuses[index % statuses.length],
  leadScore: scores[index % scores.length],
  assignedStaff: staff[index % staff.length],
  nextFollowUp: `2026-06-${String(10 + (index % 18)).padStart(2, "0")}`,
  notes: "Asked for package details and availability confirmation."
}));

export const quotations: Quotation[] = Array.from({ length: 30 }, (_, index) => ({
  id: `QUO-${String(index + 1).padStart(3, "0")}`,
  quotationTitle: `${["Wedding", "Corporate", "Birthday", "Cafe Launch"][index % 4]} Catering Quote`,
  servicePackageName: ["Silver Buffet", "Gold Buffet", "Premium Snack Box", "Chef Special"][index % 4],
  price: 12000 + index * 1750,
  description: "Includes food, service staff, setup, and basic serving counters.",
  terms: "50% advance payment. Menu changes accepted up to 48 hours before event.",
  validity: `${7 + (index % 10)} days`,
  status: ["Draft", "Sent", "Accepted", "Expired"][index % 4] as Quotation["status"]
}));

export const conversations: Conversation[] = Array.from({ length: 50 }, (_, index) => ({
  id: `CNV-${String(index + 1).padStart(3, "0")}`,
  customerName: leads[index].leadName,
  channel: ["WhatsApp", "Website", "Email", "Instagram"][index % 4] as Conversation["channel"],
  lastMessage: "Can you send me the best package for 40 people?",
  mode: index % 4 === 0 ? "Human" : "AI",
  leadId: leads[index].id,
  internalNotes: "Customer prefers quick response and clear pricing.",
  messageHistory: [
    { id: `m-${index}-1`, sender: "customer", body: "Hi, I need catering details.", time: "10:12 AM" },
    { id: `m-${index}-2`, sender: "ai", body: "Sure. How many guests should we plan for?", time: "10:13 AM" },
    { id: `m-${index}-3`, sender: "customer", body: "Around 40 people this weekend.", time: "10:14 AM" }
  ]
}));

export const messageTemplates: MessageTemplate[] = Array.from({ length: 20 }, (_, index) => ({
  id: `TPL-${index + 1}`,
  templateName: `${["Welcome", "Quotation follow-up", "Payment reminder", "Event confirmation"][index % 4]} Template`,
  triggerType: ["New lead", "Quote sent", "No reply", "Converted"][index % 4],
  language: ["English", "Hindi", "Malayalam", "Tamil"][index % 4],
  messageBody: "Thank you for contacting us. We can help with a package that fits your requirement.",
  status: index % 5 === 0 ? "Inactive" : "Active"
}));

export const followUpRules: FollowUpRule[] = Array.from({ length: 20 }, (_, index) => ({
  id: `FLW-${index + 1}`,
  ruleName: `${["Quote", "Hot lead", "No response", "Post-event"][index % 4]} follow-up`,
  triggerCondition: ["Quote sent", "Lead marked hot", "No response for 24h", "Event completed"][index % 4],
  delayTime: `${index % 6 + 1} hours`,
  template: messageTemplates[index % messageTemplates.length].templateName,
  leadStatus: statuses[index % statuses.length],
  status: index % 6 === 0 ? "Inactive" : "Active"
}));

export const handoffRequests: HandoffRequest[] = Array.from({ length: 18 }, (_, index) => ({
  id: `HND-${index + 1}`,
  customerName: leads[index].leadName,
  reason: ["Pricing negotiation", "Complex event details", "Complaint", "Custom menu"][index % 4],
  conversationSummary: "AI collected requirement, guest count, budget, and event date.",
  assignedStaff: staff[index % staff.length],
  status: ["Pending", "In Progress", "Closed"][index % 3] as HandoffRequest["status"]
}));

export const salesRecords: SalesRecord[] = Array.from({ length: 100 }, (_, index) => {
  const quantity = 1 + (index % 6);
  const sellingPrice = 90 + (index % 8) * 35;
  return {
    id: `SAL-${index + 1}`,
    date: `2026-06-${String(1 + (index % 28)).padStart(2, "0")}`,
    billNumber: `BILL-${1000 + index}`,
    itemName: items[index % items.length],
    category: categories[index % categories.length],
    quantity,
    sellingPrice,
    totalAmount: quantity * sellingPrice,
    orderSource: ["Dine-in", "Swiggy", "Zomato", "Takeaway"][index % 4] as SalesRecord["orderSource"],
    time: `${String(10 + (index % 12)).padStart(2, "0")}:30`
  };
});

export const productPerformance: MenuItemPerformance[] = Array.from({ length: 50 }, (_, index) => ({
  id: `PRD-${index + 1}`,
  itemName: `${items[index % items.length]} ${index > 7 ? index : ""}`.trim(),
  category: categories[index % categories.length],
  quantitySold: 30 + index * 3,
  revenue: 4500 + index * 420,
  foodCost: 1800 + index * 160,
  profitMargin: 22 + (index % 30),
  performanceStatus: ["Best Seller", "Healthy", "Low Margin", "Slow Moving"][index % 4] as MenuItemPerformance["performanceStatus"]
}));

export const costRecords: CostTracking[] = Array.from({ length: 30 }, (_, index) => {
  const sellingPrice = 120 + index * 12;
  const foodCost = 48 + index * 6;
  const grossMargin = sellingPrice - foodCost;
  return {
    id: `CST-${index + 1}`,
    itemName: items[index % items.length],
    sellingPrice,
    foodCost,
    grossMargin,
    marginPercentage: Math.round((grossMargin / sellingPrice) * 100),
    status: grossMargin / sellingPrice > 0.55 ? "Healthy" : index % 3 === 0 ? "Critical" : "Review"
  };
});

export const wastageRecords: WastageEntry[] = Array.from({ length: 30 }, (_, index) => ({
  id: `WST-${index + 1}`,
  date: `2026-06-${String(1 + (index % 28)).padStart(2, "0")}`,
  itemName: items[index % items.length],
  quantityWasted: 1 + (index % 5),
  reason: ["Spoilage", "Overproduction", "Kitchen Error", "Expired"][index % 4] as WastageEntry["reason"],
  estimatedCostLoss: 120 + index * 35,
  staffNote: "Logged during closing stock check."
}));

export const profitReports: ProfitReport[] = Array.from({ length: 10 }, (_, index) => ({
  id: `RPT-${index + 1}`,
  period: ["Daily", "Weekly", "Monthly"][index % 3] as ProfitReport["period"],
  salesSummary: "Sales improved during dinner hours with strong delivery contribution.",
  bestWorstItems: "Chicken Biryani leads revenue; Cold Coffee needs promotion support.",
  foodCostSummary: "Food cost is within target for most high-volume items.",
  wastageSummary: "Wastage is concentrated in prep-heavy items after 9 PM.",
  peakHourSummary: "Best sales window is 7 PM to 9 PM.",
  aiRecommendations: "Run a combo offer at 5 PM and reduce prep for slow-moving items.",
  ownerActionPoints: "Review low-margin products and adjust purchasing for weekends."
}));

export const leadTrend = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 18 },
  { name: "Wed", value: 16 },
  { name: "Thu", value: 24 },
  { name: "Fri", value: 31 },
  { name: "Sat", value: 28 },
  { name: "Sun", value: 36 }
];

export const sourceSplit = sources.map((source) => ({
  name: source,
  value: leads.filter((lead) => lead.source === source).length
}));

export const salesTrend = Array.from({ length: 7 }, (_, index) => ({
  name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
  value: salesRecords.slice(index * 10, index * 10 + 10).reduce((sum, row) => sum + row.totalAmount, 0)
}));

export const hourlySales = Array.from({ length: 12 }, (_, index) => ({
  name: `${10 + index}:00`,
  value: 3000 + ((index * 1375) % 9000)
}));
