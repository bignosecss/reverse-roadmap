import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
      content: "Hello! How can I help you today?",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");

  const handleSend = useCallback(() => {
    if (!inputMsg.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: inputMsg,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMsg("");
  }, [inputMsg]);

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
          />
          <Button onClick={handleSend}>发送</Button>
        </ButtonGroup>
      </Field>
    </div>
  );
}
