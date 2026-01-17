import { ExportResult } from "@repo/shared";
import { apiClient } from "./client";

export const exportToRag = async (id: string): Promise<ExportResult> => {
  const result = await apiClient<ExportResult>(`rag-export/${id}/export`, {
    method: "POST",
  });
  return result.data;
};

export const reexportToRag = async (id: string): Promise<ExportResult> => {
  const result = await apiClient<ExportResult>(`rag-export/${id}/reexport`, {
    method: "POST",
  });
  return result.data;
};
