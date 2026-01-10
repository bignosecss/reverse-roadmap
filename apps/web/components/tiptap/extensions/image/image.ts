import { ImageOptions, Image as TiptapImage } from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageView from "./components/image-view";

export interface SetImageOptions {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  align?: "left" | "center" | "right";
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    imageUpload: {
      /**
       * Add an image
       * @param options The image attributes
       * @example
       * editor
       *   .commands
       *   .setImage({ src: 'https://tiptap.dev/logo.png', alt: 'tiptap', title: 'tiptap logo' })
       */
      setImage: (options: SetImageOptions) => ReturnType;
      /**
       * Set image alignment
       */
      setImageAlign: (align: "left" | "center" | "right") => ReturnType;
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEFAULT_OPTIONS: any = {
  acceptMimes: ["image/jpeg", "image/gif", "image/png", "image/jpg"],
  maxSize: 1024 * 1024 * 5, // 5MB
};

export interface CustomImageOptions extends ImageOptions {
  /** Function for uploading files */
  upload?: (file: File) => Promise<string>;

  acceptMimes?: string[];
  maxSize?: number;
}

export const Image = TiptapImage.extend<CustomImageOptions>({
  atom: true,
  selectable: true,

  addOptions() {
    return {
      ...DEFAULT_OPTIONS,
      ...this.parent?.(),
      upload: () => Promise.reject("请传入自定义的图片上传函数 upload"),
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
        // 兼容 img.align 属性 + style 样式两种写法，解析更健壮
        parseHTML: (element) => {
          return (
            element.getAttribute("align") || element.style.textAlign || "center"
          );
        },
        renderHTML: (attributes) => {
          const { align } = attributes;
          return align !== "center"
            ? {
                style: {
                  marginLeft: "auto",
                  marginRight: "auto",
                  textAlign: align,
                },
              }
            : { style: { marginLeft: "auto", marginRight: "auto" } };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImageAlign:
        (align) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, { align }),
    };
  },

  /**
   * 使用 ReactNodeViewRenderer 会将节点的渲染工作委托给 React。
   * 这引入了一个抽象层，可能干扰 ProseMirror 默认的内部拖拽检测机制。
   * 通常，ProseMirror 无法区分这种情况下是内部移动还是外部拖放，
   * 因此为了安全，默认行为会变成“复制”而不是“移动”。
   * 
   * 通过设置 draggable: true 属性
   * 并在对应的 DOM 元素中添加 data-drag-handle
   * 就可以让图片正常的拖动了
   */
  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});
