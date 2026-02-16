import { useState, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useRagQuery } from "@/hooks/use-rag-query";
import { useAgentQuery } from "@/hooks/use-agent-query";
import { toast } from "sonner";
import useAuthStore from "@/lib/stores/auth";
import useRootStore from "@/lib/stores/root";
import { useChatStore } from "@/lib/stores/chat";
import { ChatMessage } from "@repo/shared";
import { ChatState } from "@/lib/types/models";
import { generateId } from "@/lib/utils/unique-id";
import useFlowStore from "@/lib/stores/flow";
import { Skill } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { useTreeId } from "@/hooks/use-tree-id";
import { AgentSuccessToast } from "../agent-success-toast";

export interface UIMessage extends ChatMessage {
  id: string;
  isThinking?: boolean;
}

const chatStoreSelector = (state: ChatState) => ({
  aroundInfo: state.aroundInfo,
});

export function useChatMessage(skill: Skill = "chat") {
  const [messages, setMessages] = useState<UIMessage[]>([
    {
      id: generateId(),
      role: "assistant",
      content:
        skill === "agent" ? "我是 Agent，可以帮你生成路线图！" : "聊聊～",
    },
  ]);

  const { mutate: ragQuery, isPending: ragPending } = useRagQuery();
  const { mutate: agentQuery, isPending: agentPending } = useAgentQuery();
  const isPending = ragPending || agentPending;
  const user = useAuthStore((state) => state.user);
  const currentRoot = useRootStore((state) => state.currentRoot);
  const currentRrNode = useFlowStore((state) => state.currentRrNode);
  const { aroundInfo } = useChatStore(useShallow(chatStoreSelector));
  const treeId = useTreeId();
  const queryClient = useQueryClient();

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
        content: skill === "agent" ? "正在生成路线图..." : "正在思考中...",
        isThinking: true,
      };

      const historyMessages = messages.slice(1);
      setMessages((prev) => [...prev, userMessage, thinkingMessage]);
      const queryText = inputMsg;

      if (skill === "chat") {
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
      } else if (skill === "agent") {
        agentQuery(
          {
            query: queryText,
            context: {
              rrNodeId: currentRrNode?._id ?? "",
              title: currentRrNode?.title ?? "",
              description: currentRrNode?.description ?? "",
            },
          },
          {
            onSuccess: (response) => {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === thinkingMessage.id
                    ? { ...msg, content: response.reply, isThinking: false }
                    : msg,
                ),
              );

              const { model, usage, toolCalls } = response;

              toast("🤖 Agent 执行成功", {
                description: AgentSuccessToast({ model, usage, toolCalls }),
              });
            },
            onError: (err) => {
              toast.error("Agent query failed", { description: `${err}` });
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
            onSettled: () =>
              queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] }),
          },
        );
      }
    },
    [
      skill,
      messages,
      ragQuery,
      user,
      currentRoot,
      aroundInfo,
      agentQuery,
      currentRrNode,
      queryClient,
      treeId,
    ],
  );

  return { messages, handleSend, isPending };
}
