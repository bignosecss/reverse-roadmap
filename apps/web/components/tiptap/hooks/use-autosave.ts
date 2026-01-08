import { useCallback, useEffect, useRef } from "react";
import { useUpdateRrContentById } from "@/hooks/use-rr-content";
import { Content } from "@tiptap/react";
import { UpdateRrContentDto } from "@repo/shared";
import { toast } from "sonner";

export default function useAutoSave(docId: string) {
  const debounceTimer = useRef<NodeJS.Timeout>(null);
  const lastSavedContent = useRef("");
  const { mutateAsync: updateRrContent } = useUpdateRrContentById(docId);

  const saveContent = useCallback(
    async (content: Content) => {
      // 内容没变化则跳过
      const contentStr = JSON.stringify(content);
      if (contentStr === lastSavedContent.current) return;

      try {
        // 1. 先存本地缓存（LocalStorage/IndexedDB，这里用 LocalStorage 简化）
        // localStorage.setItem(`auto-save-${docId}`, contentStr);
        // console.log("✅ 本地缓存已更新");

        // 2. 调用后端接口保存
        const res = await updateRrContent(content as UpdateRrContentDto);
        if (res) {
          lastSavedContent.current = contentStr;
          toast.success("保存成功", { position: "top-right" });
        } else {
          toast.error("保存出错（网络/接口问题）", { position: "top-right" });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(`保存失败: ${err?.message || "未知错误"}`, {
          position: "top-right",
        });
      }
    },
    [updateRrContent],
  );

  const handleContentChange = useCallback(
    (content: Content) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      // 800ms 防抖：用户停止输入 800ms 后才保存
      debounceTimer.current = setTimeout(() => {
        saveContent(content);
      }, 800);
    },
    [saveContent],
  );

  useEffect(() => {
    const timer = setInterval(
      () => {
        if (lastSavedContent.current) {
          saveContent(JSON.parse(lastSavedContent.current));
          toast.info("定时兜底保存执行 ⏰", { position: "top-right" });
        }
      },
      5 * 60 * 1000,
    ); // 5分钟

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current!);
      clearInterval(timer);
      console.log("清理定时器 🧹");
    };
  }, [saveContent]);

  // 初始化：从本地缓存恢复上次未同步的内容
  const initContent = useCallback(() => {
    const cached = localStorage.getItem(`auto-save-${docId}`);
    return cached
      ? JSON.parse(cached)
      : [{ type: "paragraph", children: [{ text: "请输入内容..." }] }];
  }, [docId]);

  // 返回对外暴露的方法：内容变更处理函数 + 初始化内容函数
  return { handleContentChange, initContent };
}
