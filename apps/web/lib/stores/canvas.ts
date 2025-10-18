import { create } from "zustand";
import { CanvasState } from "../types/models";

const useCanvasStore = create<CanvasState>((set) => ({
  updatingContent: false,
  setUpdatingContent: (updating: boolean) => {
    set({ updatingContent: updating });
  },
}));

export default useCanvasStore;
