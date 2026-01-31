import { SidebarMenu } from "@/components/ui/sidebar";
import { RrRootItem } from "./rr-root-item";
import { Spinner } from "@/components/ui/spinner";
import { RrRoot } from "@repo/shared/models";
import { useTreeId } from "@/hooks/use-tree-id";
import { useGetRrRoots } from "@/hooks/use-rr-root";

export function RrRootsList() {
  const currentTreeId = useTreeId();
  const { data: rrRoots, isLoading, isError } = useGetRrRoots();

  if (isLoading) {
    return <Spinner className="size-8 w-full flex justify-center mt-8" />;
  }

  if (isError) {
    return <div className="text-destructive">Error Loading Roots</div>;
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
