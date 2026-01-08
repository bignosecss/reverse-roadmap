import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Editor } from "@tiptap/react";
import { ImageIcon } from "@radix-ui/react-icons";

export default function AddImageButton({ editor }: { editor: Editor }) {
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (editor && imageUrl) {
        editor.chain().focus().setImage({ src: imageUrl, alt: altText }).run();
        setImageUrl("");
        setAltText("");
        setOpen(false); // Close the dialog after successful submission
      }
    },
    [editor, imageUrl, altText],
  );

  const handleClear = useCallback(() => {
    setImageUrl("");
    setAltText("");
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) handleClear();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="iconsm" type="button">
          <ImageIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>添加图片</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="alt-text">替换文本</Label>
              <Input
                id="alt-text"
                name="alt-text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="图片的替换文本描述"
                className="col-span-3"
              />
            </div>
            <div className="flex gap-3">
              <Input
                id="image-url"
                name="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
                className="flex-1"
              />
              <Button type="submit">应用</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
