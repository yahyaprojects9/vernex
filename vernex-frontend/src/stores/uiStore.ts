import { create } from "zustand";

type UiState = {
  sidebarOpen: boolean;
  searchTerm: string;
  selectedIds: string[];
  activeDialog: string | null;
  setSidebarOpen(open: boolean): void;
  setSearchTerm(term: string): void;
  setSelectedIds(ids: string[]): void;
  setActiveDialog(dialog: string | null): void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  searchTerm: "",
  selectedIds: [],
  activeDialog: null,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedIds: (selectedIds) => set({ selectedIds }),
  setActiveDialog: (activeDialog) => set({ activeDialog })
}));
