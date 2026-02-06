import { useMutation } from "@tanstack/react-query";
import { ragQuery } from "@/lib/service/rag-query";
import type { RAGQueryRequest } from "@repo/shared";

export const useRagQuery = () => {
  return useMutation({
    mutationFn: (request: RAGQueryRequest) => ragQuery(request),
  });
};
