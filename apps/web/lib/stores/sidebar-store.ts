import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  selectedTreeId: string | null;
  setSelectedTreeId: (id: string | null) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      selectedTreeId: null,
      setSelectedTreeId: (id: string | null) => set({ selectedTreeId: id }),
    }),
    {
      name: "sidebar-storage",
      // 可选：只持久化 selectedTreeId
      partialize: (state: SidebarState) => ({
        selectedTreeId: state.selectedTreeId,
      }),
    },
  ),
);
