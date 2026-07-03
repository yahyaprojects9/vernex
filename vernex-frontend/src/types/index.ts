export type UserRole = "Owner" | "Admin" | "Staff";
export type UserStatus = "Active" | "Inactive" | "Suspended";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
};

export type LeadStatus = "New" | "Contacted" | "Follow-up" | "Quotation Sent" | "Interested" | "Converted" | "Lost";
export type LeadScore = "Hot" | "Warm" | "Cold";

export type Lead = {
  id: string;
  leadName: string;
  phone: string;
  email?: string;
  source: "WhatsApp" | "Instagram" | "Website" | "Email" | "Manual";
  businessName?: string;
  requirement: string;
  interestedService?: "Website" | "Digital Marketing" | "Automation" | "Restaurant Profit AI" | "WhatsApp Sales Agent" | "Other";
  budget?: number;
  location: string;
  urgency?: "Immediate" | "This Week" | "This Month" | "Just Enquiry";
  status: LeadStatus;
  leadScore: LeadScore;
  assignedStaff: string;
  assignedUserId?: string;
  branchId?: string;
  departmentId?: string;
  nextFollowUp: string;
  lastContactedDate?: string;
  followUpCount?: number;
  quotationStatus?: "Not Sent" | "Sent" | "Accepted" | "Rejected";
  conversationMode?: "AI Active" | "Human Active";
  notes: string;
};

export type Quotation = {
  id: string;
  leadId: string;
  quotationTitle: string;
  servicePackageName: string;
  price: number;
  description: string;
  terms: string;
  validity: string;
  status: "Draft" | "Sent" | "Accepted" | "Expired";
};

export type Conversation = {
  id: string;
  customerName: string;
  channel: "WhatsApp" | "Website" | "Email" | "Instagram";
  lastMessage: string;
  mode: "AI" | "Human";
  messageHistory: { id: string; sender: "ai" | "customer" | "staff"; body: string; time: string }[];
  internalNotes: string;
  leadId: string;
  assignedUserId?: string;
  branchId?: string;
  departmentId?: string;
};

export type MessageTemplate = {
  id: string;
  templateName: string;
  triggerType: string;
  language: string;
  messageBody: string;
  status: "Active" | "Inactive";
};

export type FollowUpRule = {
  id: string;
  ruleName: string;
  category?: "Pricing" | "Discount" | "Negotiation" | "Availability" | "Support" | "Business Hours" | "Escalation" | "Lead Qualification" | "Appointment Booking" | "Quotation Requests" | "Refund Requests" | "Delivery Questions" | "Custom Business Rules";
  triggerCondition: string;
  condition?: string;
  constraintType?: "None" | "Maximum Discount %" | "Maximum Order Quantity" | "Minimum Budget" | "Business Hours" | "Service Region" | "Escalation Threshold";
  constraintValue?: string;
  response?: string;
  fallback?: string;
  priority?: number;
  delayTime: string;
  template: string;
  leadStatus: LeadStatus;
  status: "Active" | "Inactive";
  createdBy?: string;
};

export type CRMStage = {
  id: string;
  title: LeadStatus;
  leadIds: string[];
};

export type HandoffRequest = {
  id: string;
  customerName: string;
  reason: string;
  conversationSummary: string;
  assignedStaff: string;
  assignedUserId?: string;
  leadId?: string;
  status: "Pending" | "In Progress" | "Closed";
};

export type SalesRecord = {
  id: string;
  date: string;
  billNumber: string;
  itemName: string;
  category: string;
  quantity: number;
  sellingPrice: number;
  totalAmount: number;
  orderSource: "Dine-in" | "Swiggy" | "Zomato" | "Takeaway";
  time: string;
  branchId?: string;
  departmentId?: string;
  assignedUserId?: string;
};

export type MenuItemPerformance = {
  id: string;
  itemName: string;
  category: string;
  quantitySold: number;
  revenue: number;
  foodCost: number;
  profitMargin: number;
  performanceStatus: "Best Seller" | "Healthy" | "Low Margin" | "Slow Moving";
};

export type CostTracking = {
  id: string;
  itemName: string;
  sellingPrice: number;
  foodCost: number;
  grossMargin: number;
  marginPercentage: number;
  status: "Healthy" | "Review" | "Critical";
};

export type WastageEntry = {
  id: string;
  date: string;
  itemName: string;
  quantityWasted: number;
  reason: "Spoilage" | "Overproduction" | "Kitchen Error" | "Expired";
  estimatedCostLoss: number;
  staffNote: string;
};

export type ProfitReport = {
  id: string;
  period: "Daily" | "Weekly" | "Monthly";
  salesSummary: string;
  bestWorstItems: string;
  foodCostSummary: string;
  wastageSummary: string;
  peakHourSummary: string;
  aiRecommendations: string;
  ownerActionPoints: string;
};

export type DashboardMetrics = {
  label: string;
  value: string;
  helper: string;
  trend?: string;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  read: boolean;
};

export type BusinessSettings = {
  businessName: string;
  language: string;
  currency: string;
  workingHours: string;
  notificationsEnabled: boolean;
};

export type SystemSettings = {
  timezone: string;
  dateFormat: string;
  demoMode: boolean;
};
