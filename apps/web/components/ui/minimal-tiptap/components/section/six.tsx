import * as React from "react";
import type { Editor } from "@tiptap/react";
import type { FormatAction } from "../../types";
import type { toggleVariants } from "@/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import {
  CaretDownIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@radix-ui/react-icons";
import { ToolbarSection } from "../toolbar-section";

type TextAlignAction = "textAlignLeft" | "textAlignCenter" | "textAlignRight";
interface TextAlign extends FormatAction {
  value: TextAlignAction;
}

const formatActions: TextAlign[] = [
  {
    value: "textAlignLeft",
    label: "Left",
    icon: <TextAlignLeftIcon className="size-5" />,
    isActive: (editor) => editor.isActive({ textAlign: "left" }),
    action: (editor) => editor.commands.toggleTextAlign("left"),
    canExecute: (editor) => editor.can().chain().toggleTextAlign("left").run(),
    shortcuts: ["mod", "shift", "L"],
  },
  {
    value: "textAlignCenter",
    label: "Center",
    icon: <TextAlignCenterIcon className="size-5" />,
    isActive: (editor) => editor.isActive({ textAlign: "center" }),
    action: (editor) => editor.commands.toggleTextAlign("center"),
    canExecute: (editor) =>
      editor.can().chain().toggleTextAlign("center").run(),
    shortcuts: ["mod", "shift", "E"],
  },
  {
    value: "textAlignRight",
    label: "Right",
    icon: <TextAlignRightIcon className="size-5" />,
    isActive: (editor) => editor.isActive({ textAlign: "right" }),
    action: (editor) => editor.commands.toggleTextAlign("right"),
    canExecute: (editor) => editor.can().chain().toggleTextAlign("right").run(),
    shortcuts: ["mod", "shift", "R"],
  },
];

interface SectionSixProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
  activeActions?: TextAlignAction[];
  mainActionCount?: number;
}

export const SectionSix: React.FC<SectionSixProps> = ({
  editor,
  activeActions = formatActions.map((action) => action.value),
  mainActionCount = 0,
  size,
  variant,
}) => {
  const getCurrentAlignIcon = React.useCallback(() => {
    if (editor.isActive({ textAlign: "left" }))
      return <TextAlignLeftIcon className="size-5" />;
    if (editor.isActive({ textAlign: "center" }))
      return <TextAlignCenterIcon className="size-5" />;
    if (editor.isActive({ textAlign: "right" }))
      return <TextAlignRightIcon className="size-5" />;
    return <TextAlignLeftIcon className="size-5" />;
  }, [editor]);

  return (
    <ToolbarSection
      editor={editor}
      actions={formatActions}
      activeActions={activeActions}
      mainActionCount={mainActionCount}
      dropdownIcon={
        <>
          {getCurrentAlignIcon()}
          <CaretDownIcon className="size-5" />
        </>
      }
      dropdownTooltip="Text Align"
      size={size}
      variant={variant}
    />
  );
};

SectionSix.displayName = "SectionSix";

export default SectionSix;
