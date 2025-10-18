import { create } from "zustand";
import { CanvasState } from "../types/models";

const useCanvasStore = create<CanvasState>((set) => ({
  canvasOpen: false,
  updatingContent: false,
  setCanvasOpen: (open) => {
    set({ canvasOpen: open });
  },
  setUpdatingContent: (updating) => {
    set({ updatingContent: updating });
  },
}));

export default useCanvasStore;
