import { useGetPublicRrRoots, useGetRrRoots } from "@/hooks/use-rr-root";
import useSidebarStore from "@/lib/stores/sidebar";
import { RrRootStatus } from "@/lib/types/models";

export function useRrRootsList() {
  const mode = useSidebarStore((state) => state.mode);

  const publicRootsQuery = useGetPublicRrRoots();
  const allRootsQuery = useGetRrRoots();

  if (mode === RrRootStatus.public) {
    return {
      rrRoots: publicRootsQuery.data ?? [],
      isLoading: publicRootsQuery.isLoading,
      isError: publicRootsQuery.isError,
    };
  }

  return {
    rrRoots: allRootsQuery.data ?? [],
    isLoading: allRootsQuery.isLoading,
    isError: allRootsQuery.isError,
  };
}
