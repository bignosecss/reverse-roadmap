import { useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollToBottom } from "../hooks/use-scroll-to-bottom";
import { useChatMessage } from "../hooks/use-chat-message";
import { AIResponseViewer } from "@/components/tiptap/ai-response-viewer";
import { ChatForm } from "./chat-form";
import { Spinner } from "@/components/ui/spinner";
import { Skill } from "../types";

export function ChatUI() {
  const [selectedSkill, setSelectedSkill] = useState<Skill>("chat");

  const { messages, handleSend, isPending } = useChatMessage(selectedSkill);
  const messagesEndRef = useScrollToBottom([messages]);

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
              message.isThinking ? (
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <Spinner />
                  <span>{message.content}</span>
                </div>
              ) : (
                <AIResponseViewer aiMDResponse={message.content} />
              )
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
      <div className="p-4 pt-0">
        <ChatForm
          onSend={handleSend}
          isGenerating={isPending}
          selectedSkill={selectedSkill}
          onSkillChange={setSelectedSkill}
        />
      </div>
    </div>
  );
}
