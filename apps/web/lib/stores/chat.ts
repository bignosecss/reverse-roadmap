import { create } from "zustand";
import { ChatState } from "../types/models";

export const useChatStore = create<ChatState>((set) => ({
  chatOpen: false,
  chatPosition: { x: 100, y: 100 },
  toggleChat: (open, position) => {
    set(() => ({
      chatOpen: open,
      ...(position && { chatPosition: position }),
    }));
  },
}));
