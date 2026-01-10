import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Editor } from "@tiptap/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ImageLinkTab from "./image-link-tab";
import ImageUploadTab from "./image-upload-tab";
import useImageDialogStore from "@/lib/stores/tiptap";

export default function ImageDialog({ editor }: { editor: Editor }) {
  const { isOpen, close } = useImageDialogStore();
  const [altText, setAltText] = useState("");

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        close();
        setAltText(""); // Reset alt text when closing
      }
    },
    [close],
  );

  // This function will be passed to the tabs to close the dialog
  const closeDialog = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加图片</DialogTitle>
        </DialogHeader>
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">上传</TabsTrigger>
              <TabsTrigger value="link">链接</TabsTrigger>
            </TabsList>
            <div className="space-y-2">
              <Label htmlFor="altText">替代文本</Label>
              <Input
                id="altText"
                placeholder="描述图片内容（可选）"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
            </div>
            <TabsContent value="upload" className="space-y-4">
              <ImageUploadTab
                editor={editor}
                altText={altText}
                setAltText={setAltText}
                setOpen={closeDialog}
              />
            </TabsContent>
            <TabsContent value="link" className="space-y-4">
              <ImageLinkTab
                editor={editor}
                altText={altText}
                setAltText={setAltText}
                setOpen={closeDialog}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
