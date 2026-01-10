import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

interface Item {
  title: string;
}

interface SlashCommandsNodeViewProps {
  items: Item[];
  command: (item: Item) => void;
}

export const SlashCommnandsNodeView = forwardRef(
  (props: SlashCommandsNodeViewProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command(item);
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length,
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <div className="relative overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
        {props.items.length ? (
          props.items.map((item, index) => (
            <button
              key={index}
              className={`flex w-full items-center space-x-2 rounded-sm p-2 text-left text-sm transition-colors
              ${
                index === selectedIndex
                  ? "bg-accent text-accent-foreground"
                  : "bg-transparent"
              }
              hover:bg-accent hover:text-accent-foreground
            `}
              onClick={() => selectItem(index)}
            >
              {item.title}
            </button>
          ))
        ) : (
          <div className="p-2 text-sm text-muted-foreground">No result</div>
        )}
      </div>
    );
  },
);

SlashCommnandsNodeView.displayName = "SlashCommnandsNodeView";
