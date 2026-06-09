import { demoApi } from "@/lib/services";

export const vernexRepository = {
  users: demoApi.getUsers,
  settings: demoApi.getBusinessSettings,
  leads: demoApi.getLeads,
  quotations: demoApi.getQuotations,
  conversations: demoApi.getConversations,
  templates: demoApi.getMessageTemplates,
  followUpRules: demoApi.getFollowUpRules,
  handoffs: demoApi.getHandoffRequests,
  salesRecords: demoApi.getSalesRecords,
  productPerformance: demoApi.getProductPerformance,
  costs: demoApi.getCostRecords,
  wastage: demoApi.getWastageRecords,
  profitReports: demoApi.getProfitReports
};
