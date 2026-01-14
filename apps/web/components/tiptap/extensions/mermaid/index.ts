import { Node, mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import MermaidView from "./components/mermaid-view";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    mermaid: {
      /**
       * Insert a mermaid diagram
       */
      insertMermaid: (code?: string) => ReturnType;
    };
  }
}

export interface MermaidOptions {
  theme?: "light" | "dark" | "auto";
}

export const Mermaid = Node.create<MermaidOptions>({
  name: "mermaid",

  group: "block",

  atom: true,

  addOptions() {
    return {
      theme: "auto",
    };
  },

  addAttributes() {
    return {
      code: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='mermaid']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "mermaid" })];
  },

  addCommands() {
    return {
      insertMermaid:
        (code = "") =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { code },
          }),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(MermaidView);
  },
});
