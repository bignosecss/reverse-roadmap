import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      selectedItemId: null,
      setSelectedItemId: (id: string | null) => set({ selectedItemId: id }),
    }),
    {
      name: "sidebar-storage",
      // 可选：只持久化 selectedItemId
      partialize: (state: SidebarState) => ({
        selectedItemId: state.selectedItemId,
      }),
    },
  ),
);
