import { create } from "zustand";
import { CanvasState } from "../types/models";

const useCanvasStore = create<CanvasState>((set) => ({
  canvasOpen: false,
  savingContent: false,
  selectedRrContentTab: "",
  setCanvasOpen: (open) => {
    set({ canvasOpen: open });
  },
  setSavingContent: (updating) => {
    set({ savingContent: updating });
  },
  setSelectedRrContentTab: (rrContentTab) => {
    set({ selectedRrContentTab: rrContentTab });
  },
}));

export default useCanvasStore;
