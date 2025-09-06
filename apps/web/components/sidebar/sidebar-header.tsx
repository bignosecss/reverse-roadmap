import { useState } from "react";
import Link from "next/link";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { HEAD_MENU_ITEMS } from "./constants";
import { CreateRootDialog } from "../dialogs/create-root-dialog";
import { CreateRrRootDto } from "@/lib/types/apiRequests";
import { useCreateRrRoot } from "@/hooks/use-rr-root";
import { RrRoot } from "@/lib/types/models";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SidebarHeaderComponent() {
  const [isCreateRootDialogOpen, setIsCreateRootDialogOpen] = useState(false);

  const { mutate: createRrRoot } = useCreateRrRoot();
  const router = useRouter();
  const handleCreateRoot = (data: CreateRrRootDto) => {
    createRrRoot(data, {
      onSuccess: (newRoot: RrRoot) => {
        toast.success("创建新目标成功", {
          description: `新目标 "${newRoot.title}" 已创建`,
        });
        router.push(`/g/${newRoot.treeRootNodeId}`);
      },
      onError: (err) => {
        toast.error("创建新目标失败", {
          description: `${err}`,
        });
      },
    });
  };

  return (
    <SidebarHeader className="relative">
      <SidebarMenu>
        <SidebarMenuItem>
          {/* 展开状态：显示logo和文本，SidebarTrigger在右侧 */}
          <div className="group-data-[collapsible=icon]:hidden">
            <Link
              href="/"
              className="flex items-center gap-2 px-2 py-1.5 relative overflow-hidden"
            >
              <span className="relative whitespace-nowrap transition-all duration-200 ease-linear group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-[-10px]">
                Reverse Roadmap
                {/* 渐变遮罩层，在收缩时创建淡出效果 */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background opacity-0 group-data-[collapsible=icon]:opacity-100 transition-opacity duration-200 ease-linear" />
              </span>
            </Link>
            <SidebarTrigger className="absolute right-2 top-1/2 -translate-y-1/2" />
          </div>

          {/* 折叠状态：在logo位置显示SidebarTrigger */}
          <div className="group-data-[collapsible=icon]:block hidden">
            <SidebarTrigger className="flex items-center justify-center w-full px-2 py-1.5" />
          </div>
        </SidebarMenuItem>
        {HEAD_MENU_ITEMS.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              onClick={() => {
                if (item.operation === "add") {
                  setIsCreateRootDialogOpen(true);
                }
              }}
            >
              <div>
                <item.icon className="h-4 w-4" />
                <span className="relative whitespace-nowrap transition-all duration-200 ease-linear group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-[-8px] overflow-hidden">
                  {item.title}
                  {/* 文字渐变消失效果 */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background opacity-0 group-data-[collapsible=icon]:opacity-100 transition-opacity duration-200 ease-linear" />
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <CreateRootDialog
        open={isCreateRootDialogOpen}
        onOpenChange={setIsCreateRootDialogOpen}
        onConfirm={handleCreateRoot}
      />
    </SidebarHeader>
  );
}
