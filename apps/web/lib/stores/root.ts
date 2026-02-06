import { create } from "zustand";
import { RootState } from "../types/models";

const useRootStore = create<RootState>((set) => ({
  currentRoot: null,
  setCurrentRoot: (root) => {
    set({ currentRoot: root });
  },
}));

export default useRootStore;
