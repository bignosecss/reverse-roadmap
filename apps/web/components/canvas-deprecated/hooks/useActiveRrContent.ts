import {
  useGetRrContentById,
  useUpdateRrContentById,
} from "@/hooks/use-rr-content";

export function useActiveRrContent(rrContentId: string | null) {
  const {
    data: rrContent,
    isPending,
    isRefetching,
  } = useGetRrContentById(rrContentId || "");

  const { mutate: saveRrNodeContent } = useUpdateRrContentById(
    rrContentId || "",
  );

  return {
    rrContent,
    isPending: isPending || isRefetching,
    saveRrNodeContent,
  };
}
