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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatFormProps {
  onSend: (message: string) => void;
  isGenerating?: boolean;
}

type Skill = "chat" | "agent";

const SKILLS: Array<{ value: Skill; label: string; description: string }> = [
  { value: "chat", label: "Chat", description: "普通对话" },
  { value: "agent", label: "Agent", description: "智能路线图生成" },
];

export function ChatForm({ onSend, isGenerating }: ChatFormProps) {
  const [inputMsg, setInputMsg] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<Skill>("chat");
  const [skillPopoverOpen, setSkillPopoverOpen] = useState(false);

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
            <DropdownMenu
              open={skillPopoverOpen}
              onOpenChange={setSkillPopoverOpen}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <InputGroupButton size="sm" className="rounded-full">
                      {selectedSkill === "agent" ? "Agent" : "Chat"}
                    </InputGroupButton>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>选择技能</TooltipContent>
              </Tooltip>
              <DropdownMenuContent
                side="top"
                align="start"
                className="[--radius:1.2rem]"
              >
                <DropdownMenuGroup className="w-48">
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                    选择功能模式
                  </DropdownMenuLabel>
                  {SKILLS.map((skill) => (
                    <DropdownMenuCheckboxItem
                      key={skill.value}
                      checked={skill.value === selectedSkill}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSkill(skill.value);
                        }
                      }}
                      className="pl-2 *:[span:first-child]:right-2 *:[span:first-child]:left-auto"
                    >
                      {skill.label}
                      <span className="text-xs text-muted-foreground">
                        {skill.description}
                      </span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

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
