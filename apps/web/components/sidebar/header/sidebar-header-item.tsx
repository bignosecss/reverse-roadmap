import { BaseDialog } from "@/components/dialogs";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { HeadMenuItem } from "./constants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BaseDialogTrigger } from "@/components/dialogs";
import { useCreateRootDialog } from "../hooks/use-create-root-dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RrRootStatus } from "@repo/shared/models";

interface SidebarHeaderItemProps {
  item: HeadMenuItem;
}

export function SidebarHeaderItem({ item }: SidebarHeaderItemProps) {
  const {
    isDialogOpen,
    handleOpenChange,
    title,
    setTitle,
    description,
    setDescription,
    status,
    setStatus,
    handleConfirm,
    isFormValid,
    isPending,
  } = useCreateRootDialog();

  return (
    <SidebarMenuItem>
      <BaseDialog
        open={isDialogOpen}
        onOpenChange={handleOpenChange}
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
          <div className="grid gap-3">
            <Label>模式</Label>
            <ToggleGroup
              type="single"
              value={status}
              onValueChange={(value) => {
                if (value) setStatus(value as RrRootStatus);
              }}
              className="justify-start"
            >
              <ToggleGroupItem
                value={RrRootStatus.private}
                aria-label="Private"
              >
                私有
              </ToggleGroupItem>
              <ToggleGroupItem value={RrRootStatus.public} aria-label="Public">
                公开
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </BaseDialog>
    </SidebarMenuItem>
  );
}
