import { useState, useCallback } from "react";
import { useRagQuery } from "@/hooks/use-rag-query";
import { toast } from "sonner";
import useAuthStore from "@/lib/stores/auth";
import useRootStore from "@/lib/stores/root";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
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

      setMessages((prev) => [...prev, userMessage]);
      const queryText = inputMsg;

      ragQuery(
        {
          query: queryText,
          context: {
            isAuthenticated: !!user,
            rrRootId: currentRoot?._id ?? "",
          },
        },
        {
          onSuccess: (response) => {
            console.log("yes", response);
            const assistantMessage: Message = {
              id: generateId(),
              role: "assistant",
              content: response,
            };

            setMessages((prev) => [...prev, assistantMessage]);
          },
          onError: (err) => {
            toast.error("RAG query failed", { description: `${err}` });
            const errorMessage: Message = {
              id: generateId(),
              role: "assistant",
              content: `Error: ${err instanceof Error ? err.message : "Failed to get response"}`,
            };
            setMessages((prev) => [...prev, errorMessage]);
          },
        },
      );
    },
    [currentRoot?._id, ragQuery, user],
  );

  return { messages, handleSend, isPending };
}
