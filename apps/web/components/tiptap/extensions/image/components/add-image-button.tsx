import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Editor } from "@tiptap/react";
import { ImageIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageLinkTab from "./image-link-tab";
import ImageUploadTab from "./image-upload-tab";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AddImageButton({ editor }: { editor: Editor }) {
  const [altText, setAltText] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="iconsm" type="button">
          <ImageIcon />
        </Button>
      </DialogTrigger>
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
              <ImageUploadTab />
            </TabsContent>
            <TabsContent value="link" className="space-y-4">
              <ImageLinkTab
                editor={editor}
                altText={altText}
                setAltText={setAltText}
                setOpen={setOpen}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
