import { DOWNLOAD_FILE_NAME } from "./constants";
import { toast } from "sonner";

/**
 * 复制文本到剪贴板
 * @param text 待复制文本
 * @returns Promise<boolean> 是否复制成功
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
    return true;
  } catch {
    toast.error("Failed to copy");
    return false;
  }
};

/**
 * 下载SVG文件到本地
 * @param svgContent SVG的字符串内容
 */
export const downloadSvgFile = (svgContent: string) => {
  if (!svgContent) return;

  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = DOWNLOAD_FILE_NAME;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("SVG downloaded");
};

/**
 * 获取SVG容器/元素的DOM节点（封装重复的DOM查询逻辑）
 */
export const getSvgElements = () => {
  const previewContainer = document.querySelector(
    ".mermaid-svg-container",
  ) as HTMLElement | null;
  const svgElement = previewContainer?.querySelector("svg");
  return { previewContainer, svgElement };
};

/**
 * 计算元素居中坐标
 */
export const calculateCenterPosition = (
  container: HTMLElement,
  element: Element,
) => {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const svgWidth = (element as HTMLElement).clientWidth || 800;
  const svgHeight = (element as HTMLElement).clientHeight || 600;

  return {
    x: (containerWidth - svgWidth) / 2,
    y: (containerHeight - svgHeight) / 2,
  };
};
