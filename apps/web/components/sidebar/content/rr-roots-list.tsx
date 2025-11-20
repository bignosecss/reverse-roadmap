import { SidebarMenu } from "@/components/ui/sidebar";
import { RrRoot } from "@/lib/types/models";
import { usePathname } from "next/navigation";
import { RrRootItem } from "./rr-root-item";
import { Spinner } from "@/components/ui/spinner";
import { useRrRootsList } from "../hooks/use-rr-roots-list";

export function RrRootsList() {
  const pathname = usePathname();
  const currentTreeId = pathname.startsWith("/g/")
    ? pathname.split("/g/")[1]
    : null;

  const { rrRoots, isLoading, isError } = useRrRootsList();

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
