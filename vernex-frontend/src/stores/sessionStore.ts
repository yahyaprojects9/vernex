import { create } from "zustand";

export type SessionSummary = {
  userId: string;
  roleId: string;
  companyId: string;
  branchIds: string[];
  departmentIds: string[];
};

type SessionState = {
  session: SessionSummary | null;
  setSession(session: SessionSummary | null): void;
};

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  setSession: (session) => set({ session })
}));
