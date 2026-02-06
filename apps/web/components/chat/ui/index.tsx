import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRagQuery } from "@/hooks/use-rag-query";
import { useScrollToBottom } from "../hooks/use-scroll-to-bottom";
import { toast } from "sonner";
import useAuthStore from "@/lib/stores/auth";
import useRootStore from "@/lib/stores/root";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// 生成唯一id，用于消息标识
const generateId = () =>
  Date.now().toString() + Math.random().toString(36).slice(2);

export function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: "assistant",
      content: "聊聊～",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const messagesEndRef = useScrollToBottom([messages]);
  const { mutate: ragQuery, isPending } = useRagQuery();
  const user = useAuthStore((state) => state.user);
  const currentRoot = useRootStore((state) => state.currentRoot);

  const handleSend = useCallback(async () => {
    if (!inputMsg.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: inputMsg,
    };

    setMessages((prev) => [...prev, userMessage]);
    const queryText = inputMsg;
    setInputMsg("");
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
  }, [currentRoot?._id, inputMsg, ragQuery, user]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSend();
    },
    [handleSend],
  );

  return (
    <div className="size-full flex flex-col bg-background">
      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div className={cn("max-w-[80%] rounded-lg px-4 py-2 bg-muted")}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <Field className="p-4">
        <ButtonGroup>
          <Input
            id="input-message"
            placeholder="聊聊～"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
          />
          <Button onClick={handleSend} disabled={isPending}>
            发送
          </Button>
        </ButtonGroup>
      </Field>
    </div>
  );
}
