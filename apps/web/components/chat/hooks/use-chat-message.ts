import { useState, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useRagQuery } from "@/hooks/use-rag-query";
import { toast } from "sonner";
import useAuthStore from "@/lib/stores/auth";
import useRootStore from "@/lib/stores/root";
import { useChatStore } from "@/lib/stores/chat";
import { ChatMessage } from "@repo/shared";
import { ChatState } from "@/lib/types/models";
import { generateId } from "@/lib/utils/unique-id";

export interface UIMessage extends ChatMessage {
  id: string;
  isThinking?: boolean;
}

const chatStoreSelector = (state: ChatState) => ({
  aroundInfo: state.aroundInfo,
});

export function useChatMessage() {
  const [messages, setMessages] = useState<UIMessage[]>([
    {
      id: generateId(),
      role: "assistant",
      content: "聊聊～",
    },
  ]);

  const { mutate: ragQuery, isPending } = useRagQuery();
  const user = useAuthStore((state) => state.user);
  const currentRoot = useRootStore((state) => state.currentRoot);
  const { aroundInfo } = useChatStore(useShallow(chatStoreSelector));

  const handleSend = useCallback(
    (inputMsg: string) => {
      if (!inputMsg.trim()) return;

      const userMessage: UIMessage = {
        id: generateId(),
        role: "user",
        content: inputMsg,
      };

      const thinkingMessage: UIMessage = {
        id: generateId(),
        role: "assistant",
        content: "正在思考中...",
        isThinking: true,
      };

      const historyMessages = messages.slice(1);
      setMessages((prev) => [...prev, userMessage, thinkingMessage]);
      const queryText = inputMsg;

      ragQuery(
        {
          query: queryText,
          context: {
            isAuthenticated: !!user,
            rrRootId: currentRoot?._id ?? "",
            aroundInfo,
          },
          history: historyMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
        {
          onSuccess: (response) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === thinkingMessage.id
                  ? { ...msg, content: response, isThinking: false }
                  : msg,
              ),
            );
          },
          onError: (err) => {
            toast.error("RAG query failed", { description: `${err}` });
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === thinkingMessage.id
                  ? {
                      ...msg,
                      content: `Error: ${err instanceof Error ? err.message : "Failed to get response"}`,
                      isThinking: false,
                    }
                  : msg,
              ),
            );
          },
        },
      );
    },
    [aroundInfo, currentRoot?._id, messages, ragQuery, user],
  );

  return { messages, handleSend, isPending };
}
