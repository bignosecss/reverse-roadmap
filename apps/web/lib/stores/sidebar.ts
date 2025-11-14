import { create } from "zustand";
import { RrRootStatus, SidebarState } from "../types/models";

const useSidebarStore = create<SidebarState>((set) => ({
  mode: RrRootStatus.public,
  toggleMode: (m) => {
    set({ mode: m });
  },
}));

export default useSidebarStore;
