import { useCallback, useRef, useState } from "react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { cn } from "@/lib/utils";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export default function ImageView(props: NodeViewProps) {
  const { node, selected, updateAttributes, deleteNode } = props;
  const { src, alt, title, width, align } = node.attrs;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleResize = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startWidth = containerRef.current.offsetWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const currentX = moveEvent.clientX;
        let newWidth = startWidth + (currentX - startX);
        if (newWidth < 50) {
          newWidth = 50;
        }
        if (containerRef.current) {
          containerRef.current.style.width = `${newWidth}px`;
        }
      };

      const handleMouseUp = () => {
        if (containerRef.current) {
          updateAttributes({ width: containerRef.current.offsetWidth });
        }
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [updateAttributes],
  );

  return (
    <NodeViewWrapper
      className={cn("flex py-2", {
        "justify-start": align === "left",
        "justify-center": align === "center",
        "justify-end": align === "right",
      })}
    >
      <div
        ref={containerRef}
        data-drag-handle
        draggable="true"
        className="relative inline-block"
        style={{ width: width ?? "auto" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={src}
          alt={alt}
          title={title}
          className={cn("rounded-sm w-full h-auto", {
            "ring-2 ring-muted-foreground ring-offset-2": selected,
          })}
        />

        {(isHovered || selected) && (
          <>
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md bg-card/50 p-1 backdrop-blur-sm">
              <Button
                variant={align === "left" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => updateAttributes({ align: "left" })}
                className="h-7 w-7"
              >
                <TextAlignLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={align === "center" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => updateAttributes({ align: "center" })}
                className="h-7 w-7"
              >
                <TextAlignCenterIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={align === "right" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => updateAttributes({ align: "right" })}
                className="h-7 w-7"
              >
                <TextAlignRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={deleteNode}
                className="h-7 w-7 hover:bg-destructive/10"
              >
                <TrashIcon className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div
              onMouseDown={handleResize}
              className="absolute inset-y-0 right-1 w-2 cursor-col-resize flex items-center justify-center"
            >
              <div className="h-12 w-1 rounded-full bg-muted-foreground"></div>
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}
