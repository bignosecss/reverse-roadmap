import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useScrollToBottom } from "../hooks/use-scroll-to-bottom";
import { useChatMessage } from "../hooks/use-chat-message";
import { AIResponseViewer } from "@/components/tiptap/ai-response-viewer";

export function ChatUI() {
  const [inputMsg, setInputMsg] = useState("");
  const { messages, handleSend, isPending } = useChatMessage();
  const messagesEndRef = useScrollToBottom([messages]);

  const handleSendAndClear = useCallback(() => {
    handleSend(inputMsg);
    setInputMsg("");
  }, [handleSend, inputMsg]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSendAndClear();
    },
    [handleSendAndClear],
  );

  return (
    <div className="size-full flex flex-col bg-background">
      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", message.role === "user" ? "justify-end" : "")}
          >
            {message.role === "assistant" ? (
              <AIResponseViewer aiMDResponse={message.content} />
            ) : (
              <div className={cn("rounded-lg px-4 py-2 bg-muted max-w-4/5")}>
                {message.content}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <Field className="p-4 pt-0">
        <ButtonGroup>
          <Input
            id="input-message"
            placeholder="聊聊～"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
          />
          <Button onClick={handleSendAndClear} disabled={isPending}>
            发送
          </Button>
        </ButtonGroup>
      </Field>
    </div>
  );
}
