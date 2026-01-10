import { Extension, ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import { PluginKey } from "@tiptap/pm/state";
import { commands } from "./commands";
import { SlashCommnandsNodeView } from "./components/SlashCommandsNodeView";
import { updatePosition } from "../../utils";

export const SlashCommands = Extension.create({
  name: "slashCommands",

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        pluginKey: new PluginKey("slashCommands"),
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
        items: ({ query }) => {
          return commands
            .filter(
              (item) =>
                item.title.toLowerCase().startsWith(query.toLowerCase()) ||
                item.subtitle.toLowerCase().includes(query.toLowerCase()),
            )
            .slice(0, 10);
        },
        render: () => {
          let component: ReactRenderer;

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashCommnandsNodeView, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) return;

              component.element.style.position = "absolute";

              document.body.appendChild(component.element);

              updatePosition(props.editor, component.element);
            },

            onUpdate(props) {
              component.updateProps(props);

              if (!props.clientRect) return;

              updatePosition(props.editor, component.element);
            },

            onKeyDown(props) {
              if (props.event.key === "Escape") {
                component.destroy();
                component.element.remove();

                return true;
              }

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return (component.ref as any)?.onKeyDown(props);
            },

            onExit() {
              component.destroy();
              component.element.remove();
            },
          };
        },
      }),
    ];
  },
});
