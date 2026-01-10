import { create } from "zustand";

interface ImageDialogState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const useImageDialogStore = create<ImageDialogState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useImageDialogStore;
