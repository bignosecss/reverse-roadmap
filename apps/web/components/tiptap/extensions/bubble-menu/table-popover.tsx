import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { TableIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TablePopoverProps {
  editor: Editor;
}

export default function TablePopover({ editor }: TablePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="iconsm" type="button">
          <TableIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-1 max-h-[300px] overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex flex-col">
          <Button
            variant="ghost"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            className="w-full justify-start"
            type="button"
          >
            Insert table
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().addColumnBefore()}
          >
            Add column before
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().addColumnAfter()}
          >
            Add column after
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().deleteColumn()}
          >
            Delete column
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().addRowBefore()}
          >
            Add row before
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().addRowAfter()}
          >
            Add row after
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().deleteRow()}
          >
            Delete row
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().deleteTable()}
          >
            Delete table
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().mergeCells().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().mergeCells()}
          >
            Merge cells
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().splitCell().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().splitCell()}
          >
            Split cell
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().toggleHeaderColumn()}
          >
            Toggle header column
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().toggleHeaderRow()}
          >
            Toggle header row
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleHeaderCell().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().toggleHeaderCell()}
          >
            Toggle header cell
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().mergeOrSplit().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().mergeOrSplit()}
          >
            Merge or split
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              editor.chain().focus().setCellAttribute("colspan", 2).run()
            }
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().setCellAttribute("colspan", 2)}
          >
            Set cell attribute
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().fixTables().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().fixTables()}
          >
            Fix tables
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().goToNextCell().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().goToNextCell()}
          >
            Go to next cell
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().goToPreviousCell().run()}
            className="w-full justify-start"
            type="button"
            disabled={!editor.can().goToPreviousCell()}
          >
            Go to previous cell
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
