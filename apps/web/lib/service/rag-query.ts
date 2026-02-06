import { apiClient } from "./client";
import type { RAGQueryRequest } from "@repo/shared";

export const ragQuery = async (request: RAGQueryRequest): Promise<string> => {
  const result = await apiClient<string>(
    "query",
    {
      method: "POST",
      body: JSON.stringify(request),
    },
    "rag",
  );
  return result.data;
};
