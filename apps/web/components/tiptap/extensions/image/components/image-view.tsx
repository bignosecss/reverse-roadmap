import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { cn } from "@/lib/utils";

export default function ImageView(props: NodeViewProps) {
  const { node, selected } = props;
  const { src, alt, title, width, height, align } = node.attrs;

  return (
    <NodeViewWrapper
      className={cn("flex py-2", {
        "justify-start": align === "left",
        "justify-center": align === "center",
        "justify-end": align === "right",
      })}
    >
      <div className="relative inline-block">
        <img
          src={src}
          alt={alt}
          title={title}
          width={width}
          height={height}
          className={cn("rounded-sm", {
            "ring-2 ring-blue-500 ring-offset-2": selected,
          })}
        />
      </div>
    </NodeViewWrapper>
  );
}
