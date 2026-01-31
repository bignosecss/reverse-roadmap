import { create } from "zustand";
import { SidebarState } from "../types/models";

const useSidebarStore = create<SidebarState>(() => ({}));

export default useSidebarStore;
