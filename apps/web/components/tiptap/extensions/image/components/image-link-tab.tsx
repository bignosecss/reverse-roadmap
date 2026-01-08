import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Editor } from "@tiptap/react";
import { useCallback, useState } from "react";

export default function ImageLinkTab({
  editor,
  altText,
  setAltText,
  setOpen,
}: {
  editor: Editor;
  altText: string;
  setAltText: (altText: string) => void;
  setOpen: (open: boolean) => void;
}) {
  const [imageUrl, setImageUrl] = useState("");

  const handleApply = useCallback(() => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: altText }).run();
      setOpen(false); // Close dialog on success
      setAltText("");
    }
  }, [altText, editor, imageUrl, setAltText, setOpen]);

  return (
    <div className="flex gap-1.5">
      <Input
        id="image-url"
        name="image-url"
        placeholder="https://example.com/image.jpg"
        required
        className="flex-1"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleApply();
          }
        }}
      />
      <Button type="button" onClick={handleApply}>
        应用
      </Button>
    </div>
  );
}
