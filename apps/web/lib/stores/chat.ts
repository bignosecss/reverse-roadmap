import { create } from "zustand";
import { ChatState } from "../types/models";

// 聊天窗口的尺寸（与 Tailwind 类 w-md h-128 对应）
const CHAT_WIDTH = 448; // w-md = 28rem = 448px
const CHAT_HEIGHT = 512; // h-128 = 32rem = 512px

function ensurePositionInViewport(position: { x: number; y: number }): {
  x: number;
  y: number;
} {
  const { innerWidth, innerHeight } = window;

  return {
    x: Math.max(0, Math.min(position.x, innerWidth - 1.2 * CHAT_WIDTH)),
    y: Math.max(0, Math.min(position.y, innerHeight - CHAT_HEIGHT)),
  };
}

export const useChatStore = create<ChatState>((set) => ({
  chatOpen: false,
  chatPosition: { x: 100, y: 100 },
  aroundInfo: "",
  toggleChat: (open, position, aroundInfo) => {
    set(() => {
      const adjustedPosition = position
        ? ensurePositionInViewport(position)
        : undefined;

      return {
        chatOpen: open,
        ...(adjustedPosition && { chatPosition: adjustedPosition }),
        ...(aroundInfo !== undefined && { aroundInfo }),
      };
    });
  },
  setAroundInfo: (info) => set({ aroundInfo: info }),
}));
