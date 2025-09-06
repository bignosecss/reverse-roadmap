import { create } from "zustand";
import { SidebarState } from "../types/models";

const useSidebarStore = create<SidebarState>((set) => ({
  rrRoots: [],
  setRrRoots: (roots) => {
    set({ rrRoots: roots });
  },
}));

export default useSidebarStore;
