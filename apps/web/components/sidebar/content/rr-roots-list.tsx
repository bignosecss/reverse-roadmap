import { SidebarMenu } from "@/components/ui/sidebar";
import { RrRoot, RrRootStatus } from "@/lib/types/models";
import { usePathname } from "next/navigation";
import useSidebarStore from "@/lib/stores/sidebar";
import { useGetPublicRrRoots, useGetRrRoots } from "@/hooks/use-rr-root";
import { RrRootItem } from "./rr-root-item";
import { Spinner } from "@/components/ui/spinner";

export function RrRootsList() {
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
    return <Spinner className="size-8 w-full flex justify-center mt-8" />;
  }

  if (isError) {
    return (
      <div className="text-[var(--destructive))]">Error Loading Roots</div>
    );
  }

  return (
    <SidebarMenu>
      {!!rrRoots &&
        rrRoots.length > 0 &&
        rrRoots.map((rrRoot: RrRoot) => (
          <RrRootItem
            key={rrRoot._id}
            rrRoot={rrRoot}
            isActive={currentTreeId === rrRoot.rootRrNode}
          />
        ))}
    </SidebarMenu>
  );
}
