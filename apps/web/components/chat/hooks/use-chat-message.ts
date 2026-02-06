import { useState, useCallback } from "react";
import { useRagQuery } from "@/hooks/use-rag-query";
import { toast } from "sonner";
import useAuthStore from "@/lib/stores/auth";
import useRootStore from "@/lib/stores/root";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isThinking?: boolean;
}

// 生成唯一id，用于消息标识
export const generateId = () =>
  Date.now().toString() + Math.random().toString(36).slice(2);

export function useChatMessage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: "assistant",
      content: "聊聊～",
    },
  ]);

  const { mutate: ragQuery, isPending } = useRagQuery();
  const user = useAuthStore((state) => state.user);
  const currentRoot = useRootStore((state) => state.currentRoot);

  const handleSend = useCallback(
    (inputMsg: string) => {
      if (!inputMsg.trim()) return;

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: inputMsg,
      };

      const thinkingMessage: Message = {
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
    [currentRoot?._id, messages, ragQuery, user],
  );

  return { messages, handleSend, isPending };
}
