import * as React from "react";
import type { Editor } from "@tiptap/react";
import type { Content, UseEditorOptions } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEditor, useEditorState } from "@tiptap/react";
import { Typography } from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import { Placeholder, Selection } from "@tiptap/extensions";
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
      openOnClick: false,
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

  const handleUpdate = React.useCallback(
    (editor: Editor) => throttledSetValue(getOutput(editor, output)),
    [output, throttledSetValue],
  );

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value);
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
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
    ...props,
  });

  /**
   * 在点击包含图片的节点后，React 会抛出 Console Error: flushSync ...
   * 若编辑器 JSON 内容中不包含图片，则不会抛出错误
   * 目前，通过 queueMicrotask 临时修复 React flushSync 报错，改修复也通过强制设置编辑器的内容
   * 临时解决了：canvas 打开状态下，点击缓存节点（打开过的节点），编辑器区域内容不更新的问题
   * 
   * 对于第二个问题，目前测试出来的表现：
   *   如果节点是第一次点击，那么 tiptap 会正确被重渲染，显示对应节点的内容。
   *   如果节点已经被打开过了，在打开过的节点之间切换，value 首先是上一个节点的内容
   * 然后 Tiptap.tsx useEffect 中的 setValue 执行之后，组件重渲染，打印出当前节点
   * 的内容 editor 的内容没有变化
   * 
   * 猜测可能是因为在已经打开过的节点之间切换，editor 的 onCreate & onUpdate 没有执行
   * onUpdate 是处理用户输入的，所以可以从 onCreate 下手去解决内容同步的问题。
   * 在 useMinimalTiptapEditor hook 中，需要一个机制来监听 value 的变化，并在必要时
   * 更新 editor 的内容，而且要避免在编辑时覆盖掉输入。
   * 
   * 但更重要的是搞清楚，为什么第一次点击节点，react-query发送请求；tiptap editor 会
   * 重新挂载，然后显示正确的内容。
   * 
   * ...two years later...
   * 
   * 因为第一次点击节点时：
   *   1. useGetRrNodeContent 发送网络请求，isLoading 为 true
   *   2. Canvas 组件中的条件渲染 {!isLoading && !!nodeContent && (...)} 不满足
   *   3. Tiptap 组件不会被渲染，编辑器不会被创建
   *   4. 网络请求完成，isLoading 变为 false，nodeContent 有值
   *   5. Tiptap 组件被渲染，编辑器被创建，显示正确内容

   * 切换回已访问节点时：
   *   1. useGetRrNodeContent 从缓存获取数据，isLoading 保持 false
   *   2. Tiptap 组件一直在渲染状态（没有被卸载）
   *   3. 编辑器实例被复用
   *   4. Tiptap 组件的 useEffect 执行，setValue 被调用
   *   5. 但编辑器内容没有更新，因为编辑器不知道 value 变化了
   */
  React.useEffect(() => {
    // 监听value变化，当value变化时更新编辑器内容
    if (editor && value) {
      // 检查当前编辑器内容是否与新值不同
      // 如果不同，则更新编辑器内容
      const currentJsonContent = getOutput(editor, "json");
      const currentStr = JSON.stringify(currentJsonContent);
      const valueStr = JSON.stringify(value);

      console.log("Comparing content:");
      console.log("currentContent:", currentJsonContent);
      console.log("value:", value);
      console.log("currentStr:", currentStr);
      console.log("valueStr:", valueStr);
      console.log("Are equal:", currentStr === valueStr);

      if (currentStr !== valueStr) {
        console.log("Content differs, setting content");
        editor.commands.setContent(value);
      } else {
        console.log("Content same, skipping");
      }
      if (JSON.stringify(currentJsonContent) !== JSON.stringify(value)) {
        console.log("执行了");
        // 使用queueMicrotask来避免flushSync警告
        queueMicrotask(() => {
          editor.commands.setContent(value);
        });
      }
    }
  }, [editor, value, output]);

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
