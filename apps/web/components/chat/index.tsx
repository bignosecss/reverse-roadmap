"use client";

import { useCallback } from "react";
import { DndContext, DragEndEvent, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useChatStore } from "@/lib/stores/chat";
import { X } from "lucide-react";
import { ChatUI } from "./ui";
import { cn } from "@/lib/utils";

function DraggableItem({
  id,
  position,
  onClose,
  children,
}: {
  id: string;
  position: { x: number; y: number };
  onClose: () => void;
  children?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    position: "absolute" as const,
    left: position.x,
    top: position.y,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={cn(
          "w-md h-128 bg-background border border-border rounded-lg shadow-lg overflow-hidden",
          "flex flex-col",
        )}
      >
        <div className="flex items-center justify-between h-6 bg-muted/50 border-b border-border">
          <div
            className="flex gap-1 pl-3 cursor-grab"
            {...attributes}
            {...listeners}
          >
            <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
            <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
            <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
          </div>
          <button
            onClick={onClose}
            className="p-1 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export default function DraggableChat() {
  const chatOpen = useChatStore((state) => state.chatOpen);
  const toggleChat = useChatStore((state) => state.toggleChat);
  const chatPosition = useChatStore((state) => state.chatPosition);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { delta } = event;
      const newPosition = {
        x: chatPosition.x + delta.x,
        y: chatPosition.y + delta.y,
      };

      // 确保位置在视口内（防止窗口尺寸变化导致位置溢出）
      const { innerWidth, innerHeight } = window;
      const chatWidth = 448; // w-md
      const chatHeight = 512; // h-128

      toggleChat(true, {
        x: Math.max(0, Math.min(newPosition.x, innerWidth - chatWidth)),
        y: Math.max(0, Math.min(newPosition.y, innerHeight - chatHeight)),
      });
    },
    [toggleChat, chatPosition],
  );

  const handleClose = useCallback(() => {
    toggleChat(false);
  }, [toggleChat]);

  if (!chatOpen) return null;

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
      <DraggableItem
        id="draggable-chat-box"
        position={chatPosition}
        onClose={handleClose}
      >
        <ChatUI />
      </DraggableItem>
    </DndContext>
  );
}
