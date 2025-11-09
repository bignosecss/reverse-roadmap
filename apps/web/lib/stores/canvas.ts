import { create } from "zustand";
import { CanvasState } from "../types/models";

const useCanvasStore = create<CanvasState>((set) => ({
  canvasOpen: false,
  savingContent: false,
  setCanvasOpen: (open) => {
    set({ canvasOpen: open });
  },
  setSavingContent: (updating) => {
    set({ savingContent: updating });
  },
}));

export default useCanvasStore;
