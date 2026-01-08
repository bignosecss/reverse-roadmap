import { useRef } from "react";
import { Button } from "@/components/ui/button";

export default function ImageUploadTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      console.log("Selected file:", selectedFile?.name);
      // TODO: Implement file upload logic here
    }
  };

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
