import { useCallback, useRef } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { fileToBase64 } from "@/components/tiptap/utils";

interface ImageUploadTabProps {
  editor: Editor;
  altText: string;
  setAltText: (altText: string) => void;
  setOpen: (open: boolean) => void;
}

export default function ImageUploadTab({
  editor,
  altText,
  setAltText,
  setOpen,
}: ImageUploadTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const selectedFile = files[0]!;
        /**
         * 临时使用 base64 编码处理图片文件上传
         *
         * 优点：
         *  1. 临时快速处理
         *  2. 省去了前后端协作的工作量
         *
         * 缺点：
         *  1. 体积暴涨 30%+
         *  2. 文档变得又臭又长
         *
         * 不需要考虑文档大小限制，需求较为简单（远达不到16MB大小）
         */
        const imageSrc = await fileToBase64(selectedFile);

        editor.chain().focus().setImage({ src: imageSrc, alt: altText }).run();
        setOpen(false);
        setAltText("");

        // TODO: Implement file upload logic here
      }
    },
    [altText, editor, setAltText, setOpen],
  );

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button className="w-full" onClick={handleButtonClick}>
        上传
      </Button>
    </div>
  );
}
