import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useExportToRag } from "@/hooks/use-rag-export";
import { RrRoot } from "@repo/shared/models";

export function useRrRootExport(rrRoot: RrRoot) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutateAsync: exportToRagAsync, isPending: isExporting } =
    useExportToRag();

  const handleExportToRag = useCallback(async () => {
    setIsDialogOpen(false);

    const toastId = toast.loading("正在导入知识库...", {
      position: "top-center",
      description: `正在将 "${rrRoot.title}" 导入知识库，请稍候`,
    });

    try {
      const result = await exportToRagAsync(rrRoot._id);

      toast.success("导入知识库成功", {
        id: toastId,
        position: "top-center",
        description: `成功将 "${rrRoot.title}" 导入知识库，共处理 ${result.totalDocuments} 个文档`,
      });
    } catch (err: unknown) {
      toast.error("导入知识库失败", {
        id: toastId,
        position: "top-center",
        description: JSON.stringify(err),
      });
    }
  }, [exportToRagAsync, rrRoot]);

  return {
    isDialogOpen,
    setIsDialogOpen,
    isExporting,
    handleExportToRag,
  };
}
