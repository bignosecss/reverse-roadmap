"use client";

import { useMemo } from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { RrRootsList } from "./rr-roots-list";
import { useGetRrRoots } from "@/hooks/use-rr-root";
import { RrRootStatus } from "@repo/shared";
import useAuthStore from "@/lib/stores/auth";

export function SidebarContentComponent() {
  const user = useAuthStore((state) => state.user);
  const { data: rrRoots, isLoading, isError } = useGetRrRoots();

  const allRrRoots = useMemo(
    () => (user ? rrRoots : rrRoots?.filter((root) => root.isPublic)),
    [rrRoots, user],
  );

  const activeRoots = useMemo(
    () => allRrRoots?.filter((root) => root.status === RrRootStatus.active),
    [allRrRoots],
  );

  const archivedRoots = useMemo(
    () => allRrRoots?.filter((root) => root.status === RrRootStatus.archived),
    [allRrRoots],
  );

  return (
    <SidebarContent className="group-data-[collapsible=icon]:hidden">
      <SidebarGroup>
        <SidebarGroupLabel className="text-muted-foreground group-data-[collapsible=icon]:hidden">
          目标
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <RrRootsList
            rrRoots={activeRoots}
            isLoading={isLoading}
            isError={isError}
          />
        </SidebarGroupContent>
      </SidebarGroup>
      {archivedRoots && archivedRoots.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground group-data-[collapsible=icon]:hidden">
            已归档
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <RrRootsList
              rrRoots={archivedRoots}
              isLoading={isLoading}
              isError={isError}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </SidebarContent>
  );
}
