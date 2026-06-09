import {
  businessSettings,
  conversations,
  costRecords,
  followUpRules,
  handoffRequests,
  leads,
  messageTemplates,
  productPerformance,
  profitReports,
  quotations,
  salesRecords,
  users,
  wastageRecords
} from "@/lib/mock-data";

export const demoApi = {
  getUsers: async () => users,
  getBusinessSettings: async () => businessSettings,
  getLeads: async () => leads,
  getQuotations: async () => quotations,
  getConversations: async () => conversations,
  getMessageTemplates: async () => messageTemplates,
  getFollowUpRules: async () => followUpRules,
  getHandoffRequests: async () => handoffRequests,
  getSalesRecords: async () => salesRecords,
  getProductPerformance: async () => productPerformance,
  getCostRecords: async () => costRecords,
  getWastageRecords: async () => wastageRecords,
  getProfitReports: async () => profitReports
};
