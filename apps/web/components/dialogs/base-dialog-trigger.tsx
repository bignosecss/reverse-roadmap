import { DialogTrigger } from "@/components/ui/dialog";
import { SidebarMenuButton } from "../ui/sidebar";

export function BaseDialogTrigger({
  title,
  Icon,
}: {
  title: string;
  Icon: React.ElementType;
}) {
  return (
    <SidebarMenuButton asChild>
      <DialogTrigger className="w-full p-2 flex items-center gap-2">
        <Icon className="size-4" />
        <span className="relative whitespace-nowrap transition-all duration-200 ease-linear group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:-translate-x-2 overflow-hidden">
          {title}
          {/* 文字渐变消失效果 */}
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-background opacity-0 group-data-[collapsible=icon]:opacity-100 transition-opacity duration-200 ease-linear" />
        </span>
      </DialogTrigger>
    </SidebarMenuButton>
  );
}
