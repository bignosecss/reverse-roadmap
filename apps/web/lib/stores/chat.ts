import { create } from "zustand";
import { ChatState } from "../types/models";

export const useChatStore = create<ChatState>((set) => ({
  chatOpen: false,
  toggleChat: (open) => {
    set({ chatOpen: open });
  },
}));
