import { BaseDialog } from "@/components/dialogs";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { HeadMenuItem } from "./constants";
import { CreateRrRootDto } from "@/lib/types/apiRequests";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useState } from "react";
import { useCreateRrRoot } from "@/hooks/use-rr-root";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RrRoot } from "@/lib/types/models";
import { BaseDialogTrigger } from "@/components/dialogs/base-dialog-trigger";

interface SidebarHeaderItemProps {
  item: HeadMenuItem;
}

export function SidebarHeaderItem({ item }: SidebarHeaderItemProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setTitle("");
    setDescription("");
  }, []);

  const { mutate: createRrRoot, isPending } = useCreateRrRoot();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleCreateRoot = useCallback(
    (data: CreateRrRootDto) => {
      createRrRoot(data, {
        onSuccess: (newRrRoot: RrRoot) => {
          setIsDialogOpen(false); // Close the dialog
          setTitle(""); // Reset form fields
          setDescription(""); // Reset form fields
          queryClient.invalidateQueries({ queryKey: ["publicRrRoots"] });
          queryClient.invalidateQueries({ queryKey: ["rrRoots"] });
          toast.success("创建新目标成功", {
            description: `新目标 "${newRrRoot.title}" 已创建`,
          });
          router.push(`/g/${newRrRoot.rootRrNode}`);
        },
        onError: (err) => {
          toast.error("创建新目标失败", {
            description: `${err}`,
          });
        },
      });
    },
    [createRrRoot, queryClient, router],
  );

  const handleConfirm = useCallback(() => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      alert("请输入目标标题");
      return;
    }

    const data: CreateRrRootDto = {
      title: trimmedTitle,
      description: trimmedDescription || undefined,
    };

    handleCreateRoot(data);
  }, [description, handleCreateRoot, title]);

  const isFormValid = title.trim().length > 0;

  return (
    <SidebarMenuItem>
      <BaseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        trigger={<BaseDialogTrigger title={item.title} Icon={item.icon} />}
        title="创建新目标"
        description="创建一个新的目标树"
        confirmText="创建"
        onConfirm={handleConfirm}
        disabled={!isFormValid || isPending}
      >
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="root-title">目标标题 *</Label>
            <Input
              id="root-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入目标标题"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="root-description">目标描述</Label>
            <Textarea
              id="root-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
              placeholder="请输入目标描述（可选）"
            />
          </div>
        </div>
      </BaseDialog>
    </SidebarMenuItem>
  );
}
