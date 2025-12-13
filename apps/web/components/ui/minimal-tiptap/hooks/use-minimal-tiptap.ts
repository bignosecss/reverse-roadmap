import * as React from "react";
import type { Editor } from "@tiptap/react";
import type { Content, UseEditorOptions } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEditor, useEditorState } from "@tiptap/react";
import { Typography } from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import { Placeholder, Selection } from "@tiptap/extensions";
import { TextAlign } from "@tiptap/extension-text-align";
import {
  Image,
  HorizontalRule,
  CodeBlockLowlight,
  Color,
  UnsetAllMarks,
  ResetMarksOnEnter,
  FileHandler,
} from "../extensions";
import { cn } from "@/lib/utils";
import { fileToBase64, getOutput, randomId } from "../utils";
import { useThrottle } from "../hooks/use-throttle";
import { toast } from "sonner";

export interface UseMinimalTiptapEditorProps extends UseEditorOptions {
  value?: Content;
  output?: "html" | "json" | "text";
  placeholder?: string;
  editorClassName?: string;
  throttleDelay?: number;
  onUpdate?: (content: Content) => void;
  onBlur?: (content: Content) => void;
  uploader?: (file: File) => Promise<string>;
}

async function fakeuploader(file: File): Promise<string> {
  // NOTE: This is a fake upload function. Replace this with your own upload logic.
  // This function should return the uploaded image URL.

  // wait 3s to simulate upload
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const src = await fileToBase64(file);

  return src;
}

const createExtensions = ({
  placeholder,
  uploader,
}: {
  placeholder: string;
  uploader?: (file: File) => Promise<string>;
}) => [
  StarterKit.configure({
    blockquote: { HTMLAttributes: { class: "block-node" } },
    // bold
    bulletList: { HTMLAttributes: { class: "list-node" } },
    code: { HTMLAttributes: { class: "inline", spellcheck: "false" } },
    codeBlock: false,
    // document
    dropcursor: { width: 2, class: "ProseMirror-dropcursor border" },
    // gapcursor
    // hardBreak
    heading: { HTMLAttributes: { class: "heading-node" } },
    // undoRedo
    horizontalRule: false,
    // italic
    // listItem
    // listKeymap
    link: {
      enableClickSelection: true,
      openOnClick: true,
      HTMLAttributes: {
        class: "link",
      },
    },
    orderedList: { HTMLAttributes: { class: "list-node" } },
    paragraph: { HTMLAttributes: { class: "text-node" } },
    // strike
    // text
    // underline
    // trailingNode
  }),
  Image.configure({
    allowedMimeTypes: ["image/*"],
    maxFileSize: 5 * 1024 * 1024,
    allowBase64: true,
    uploadFn: async (file) => {
      return uploader ? await uploader(file) : await fakeuploader(file);
    },
    onToggle(editor, files, pos) {
      editor.commands.insertContentAt(
        pos,
        files.map((image) => {
          const blobUrl = URL.createObjectURL(image);
          const id = randomId();

          return {
            type: "image",
            attrs: {
              id,
              src: blobUrl,
              alt: image.name,
              title: image.name,
              fileName: image.name,
            },
          };
        }),
      );
    },
    onImageRemoved({ id, src }) {
      console.log("Image removed", { id, src });
    },
    onValidationError(errors) {
      errors.forEach((error) => {
        toast.error("Image validation error", {
          position: "bottom-right",
          description: error.reason,
        });
      });
    },
    onActionSuccess({ action }) {
      const mapping = {
        copyImage: "Copy Image",
        copyLink: "Copy Link",
        download: "Download",
      };
      toast.success(mapping[action], {
        position: "bottom-right",
        description: "Image action success",
      });
    },
    onActionError(error, { action }) {
      const mapping = {
        copyImage: "Copy Image",
        copyLink: "Copy Link",
        download: "Download",
      };
      toast.error(`Failed to ${mapping[action]}`, {
        position: "bottom-right",
        description: error.message,
      });
    },
  }),
  FileHandler.configure({
    allowBase64: true,
    allowedMimeTypes: ["image/*"],
    maxFileSize: 5 * 1024 * 1024,
    onDrop: (editor, files, pos) => {
      files.forEach(async (file) => {
        const src = await fileToBase64(file);
        editor.commands.insertContentAt(pos, {
          type: "image",
          attrs: { src },
        });
      });
    },
    onPaste: (editor, files) => {
      files.forEach(async (file) => {
        const src = await fileToBase64(file);
        editor.commands.insertContent({
          type: "image",
          attrs: { src },
        });
      });
    },
    onValidationError: (errors) => {
      errors.forEach((error) => {
        toast.error("Image validation error", {
          position: "bottom-right",
          description: error.reason,
        });
      });
    },
  }),
  Color,
  TextStyle,
  TextAlign.configure({
    types: ["heading", "paragraph", "codeBlock"],
    alignments: ["left", "center", "right"],
  }),
  Selection,
  Typography,
  UnsetAllMarks,
  HorizontalRule,
  ResetMarksOnEnter,
  CodeBlockLowlight,
  Placeholder.configure({ placeholder: () => placeholder }),
];

export const useMinimalTiptapEditor = ({
  value,
  output = "html",
  placeholder = "",
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  uploader,
  ...props
}: UseMinimalTiptapEditorProps) => {
  const throttledSetValue = useThrottle(
    (value: Content) => onUpdate?.(value),
    throttleDelay,
  );

  const isComposing = React.useRef(false);

  const handleUpdate = React.useCallback(
    (editor: Editor) => {
      // Skip update if we're in the middle of a composition event (e.g. IME input)
      if (isComposing.current) return;
      throttledSetValue(getOutput(editor, output));
    },
    [output, throttledSetValue],
  );

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        /**
         * emitUpdate is default to true, which will trigger onUpdate callback
         * at the first time when editor is created and content is set
         * By setting it to false, we prevent accidentally saving unmatched content
         * to current selected node when handling the content update logic
         */
        editor.commands.setContent(value, { emitUpdate: false }); // prevent onUpdate trigger
      }
    },
    [value],
  );

  const handleBlur = React.useCallback(
    (editor: Editor) => onBlur?.(getOutput(editor, output)),
    [output, onBlur],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: createExtensions({ placeholder, uploader }),
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: cn("focus:outline-hidden", editorClassName),
      },
      // Handle composition events for IME input (e.g. Chinese input)
      handleDOMEvents: {
        compositionstart: () => {
          isComposing.current = true;
          return false;
        },
        compositionend: () => {
          isComposing.current = false;
          return false;
        },
      },
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
    ...props,
  });

  // Add composition event listeners after editor is created
  React.useEffect(() => {
    if (!editor) return;

    const element = editor.view.dom;

    const handleCompositionStart = () => {
      isComposing.current = true;
    };

    const handleCompositionEnd = () => {
      isComposing.current = false;
      // Trigger an update after composition ends to ensure final content is saved
      if (editor && !editor.isDestroyed) {
        throttledSetValue(getOutput(editor, output));
      }
    };

    element.addEventListener("compositionstart", handleCompositionStart);
    element.addEventListener("compositionend", handleCompositionEnd);

    return () => {
      element.removeEventListener("compositionstart", handleCompositionStart);
      element.removeEventListener("compositionend", handleCompositionEnd);
    };
  }, [editor, output, throttledSetValue]);

  const { editor: mainEditor } = useEditorState({
    editor,
    selector(context) {
      if (!context.editor) {
        return {
          editor: null,
          editorState: undefined,
          canCommand: undefined,
        };
      }

      return {
        editor: context.editor,
        editorState: context.editor.state,
        canCommand: context.editor.can,
      };
    },
  });

  return mainEditor;
};

export default useMinimalTiptapEditor;
