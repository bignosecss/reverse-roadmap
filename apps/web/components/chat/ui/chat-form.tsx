"use client";

import { useState, useCallback } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp } from "lucide-react";

interface ChatFormProps {
  onSend: (message: string) => void;
  isGenerating?: boolean;
}

export function ChatForm({ onSend, isGenerating }: ChatFormProps) {
  const [inputMsg, setInputMsg] = useState("");

  const handleSendAndClear = useCallback(() => {
    if (!inputMsg.trim() || isGenerating) return;
    onSend(inputMsg);
    setInputMsg("");
  }, [onSend, inputMsg, isGenerating]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendAndClear();
      }
    },
    [handleSendAndClear],
  );

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Field>
        <FieldLabel htmlFor="notion-prompt" className="sr-only">
          Prompt
        </FieldLabel>
        <InputGroup className="rounded-xl has-[[data-slot=input-group-control]:focus-visible]:ring-0!">
          <InputGroupTextarea
            id="notion-prompt"
            placeholder="聊聊～"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            className="max-h-48 field-sizing-content"
          />
          <InputGroupAddon align="block-end" className="gap-1">
            {/* <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  size="icon-sm"
                  className="rounded-full"
                  aria-label="添加文件"
                >
                  <Paperclip />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>添加文件</TooltipContent>
            </Tooltip> */}

            <InputGroupButton
              aria-label="Send"
              className="ml-auto rounded-full"
              variant="default"
              size="icon-sm"
              onClick={handleSendAndClear}
              disabled={isGenerating || !inputMsg.trim()}
            >
              <ArrowUp />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </form>
  );
}
