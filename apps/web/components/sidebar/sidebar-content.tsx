"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { RrRootStatus, type RrRoot } from "@/lib/types/models";
import SidebarTreeItem from "./sidebar-content-item";
import { useGetPublicRrRoots, useGetRrRoots } from "@/hooks/use-rr-root";
import { Spinner } from "../ui/spinner";
import useSidebarStore from "@/lib/stores/sidebar";

export function SidebarCustomContent() {
  const pathname = usePathname();

  const currentTreeId = pathname.startsWith("/g/")
    ? pathname.split("/g/")[1]
    : null;

  const mode = useSidebarStore((state) => state.mode);

  const publicRootsQuery = useGetPublicRrRoots();
  const allRootsQuery = useGetRrRoots();

  let rrRoots: RrRoot[] = [];
  let isLoading = false;
  let isError = false;

  if (mode === RrRootStatus.public) {
    rrRoots = publicRootsQuery.data ?? [];
    isLoading = publicRootsQuery.isLoading;
    isError = publicRootsQuery.isError;
  } else {
    rrRoots = allRootsQuery.data ?? [];
    isLoading = allRootsQuery.isLoading;
    isError = allRootsQuery.isError;
  }

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
            {!!rrRoots &&
              rrRoots.length > 0 &&
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
