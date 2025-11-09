import { create } from "zustand";
import { CanvasState } from "../types/models";

const useCanvasStore = create<CanvasState>((set) => ({
  canvasOpen: false,
  savingContent: false,
  curRrContentTab: null,
  setCanvasOpen: (open) => {
    set({ canvasOpen: open });
  },
  setSavingContent: (updating) => {
    set({ savingContent: updating });
  },
  setCurRrContentTab: (rrContentTab) => {
    set({ curRrContentTab: rrContentTab });
  },
}));

export default useCanvasStore;
