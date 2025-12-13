import { create } from "zustand";
import { SidebarState } from "../types/models";
import { RrRootStatus } from "@repo/shared/models";

const useSidebarStore = create<SidebarState>((set) => ({
  mode: RrRootStatus.public,
  toggleMode: (m) => {
    set({ mode: m });
  },
}));

export default useSidebarStore;
