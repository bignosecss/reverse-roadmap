"use client";

import { useCallback, useState } from "react";
import { DndContext, DragEndEvent, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface DraggableChatBoxProps {
  children?: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  className?: string;
}

function DraggableHandle() {
  return (
    <div className="flex items-center justify-center h-6 bg-muted/50 cursor-move border-b border-border">
      <div className="flex gap-1">
        <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
        <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
        <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
      </div>
    </div>
  );
}

function DraggableItem({
  id,
  position,
  children,
}: {
  id: string;
  position: { x: number; y: number };
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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function DraggableChat({
  children,
  defaultPosition = { x: 100, y: 100 },
  className = "",
}: DraggableChatBoxProps) {
  const [position, setPosition] = useState(defaultPosition);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { delta } = event;
    setPosition((prev) => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y,
    }));
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <DraggableItem id="draggable-box" position={position}>
        <div
          className={`w-80 bg-background border border-border rounded-lg shadow-lg overflow-hidden ${className}`}
        >
          <DraggableHandle />
          <div className="p-4">{children}</div>
        </div>
      </DraggableItem>
    </DndContext>
  );
}
