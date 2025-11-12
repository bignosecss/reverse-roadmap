"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import type { RrRoot } from "@/lib/types/models";
import SidebarTreeItem from "./sidebar-content-item";
import { useGetRrRoots } from "@/hooks/use-rr-root";
import { Spinner } from "../ui/spinner";

export function SidebarCustomContent() {
  const pathname = usePathname();

  // 直接从URL派生当前选中的树ID，消除冗余状态
  const currentTreeId = pathname.startsWith("/g/")
    ? pathname.split("/g/")[1]
    : null;

  const { data: rrRoots, isLoading, isError } = useGetRrRoots();

  if (isLoading) {
    return (
      <div className="w-full h-1/4 p-4 flex justify-center items-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-4 text-[var(--destructive)]">Error: No data</div>
    );
  }

  return (
    <SidebarContent className="group-data-[collapsible=icon]:hidden">
      <SidebarGroup>
        <SidebarGroupLabel className="text-muted-foreground group-data-[collapsible=icon]:hidden">
          目标
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {rrRoots &&
              rrRoots.map((rrRoot: RrRoot) => (
                <SidebarTreeItem
                  key={rrRoot._id}
                  rrRoot={rrRoot}
                  isActive={currentTreeId === rrRoot.rootRrNode}
                />
              ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
