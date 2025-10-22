"use client";

import * as React from "react";
import { Smile } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { FlowNode } from "@/lib/types/models";
import { ViewportHelperFunctionOptions } from "@xyflow/react";

interface SearchNodeProps {
  nodes: FlowNode[];
  setCenter: (
    x: number,
    y: number,
    options?: ViewportHelperFunctionOptions & { zoom?: number },
  ) => Promise<boolean>;
}

export function SearchNode({ nodes, setCenter }: SearchNodeProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <p className="text-muted-foreground text-sm">
        Press{" "}
        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">⌘</span>K
        </kbd>{" "}
        to search a node
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {!!nodes &&
              nodes.length > 0 &&
              nodes.map((node) => (
                <CommandItem
                  key={node.data.rrNode._id}
                  onSelect={() => {
                    // Use node dimensions if available, otherwise use default values
                    const width = node.width || node.measured?.width || 105;
                    const height = node.height || node.measured?.height || 62.5;

                    setCenter(
                      node.position.x + width / 2,
                      node.position.y + height / 2,
                      {
                        zoom: 1.5,
                        duration: 600,
                      },
                    );
                    setOpen(false);
                  }}
                >
                  <Smile />
                  <span>{node.data.rrNode.title}</span>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
