import { useMutation } from "@tanstack/react-query";
import { exportToRag, reexportToRag } from "@/lib/service/rag-export";

export const useExportToRag = () => {
  return useMutation({
    mutationFn: (id: string) => exportToRag(id),
  });
};

export const useReexportToRag = () => {
  return useMutation({
    mutationFn: (id: string) => reexportToRag(id),
  });
};
