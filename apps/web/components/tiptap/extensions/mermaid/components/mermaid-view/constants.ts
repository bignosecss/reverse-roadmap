export const MERMAID_CONFIG = {
  startOnLoad: false,
  securityLevel: "loose" as const,
  darkTheme: "dark",
  lightTheme: "default",
} as const;

export const PAN_ZOOM_CONFIG = {
  maxZoom: 5,
  minZoom: 0.2,
  zoomSpeed: 0.6,
  smoothScroll: true,
  defaultScale: 1,
  zoomStep: 1.2, // 每次缩放倍数
} as const;

export const TOAST_TIMER = 2000; // 提示框展示时长
export const DOWNLOAD_FILE_NAME = "diagram.svg"; // 默认下载文件名
export const EMPTY_CODE_PLACEHOLDER = "Enter mermaid code here...";
export const EMPTY_PREVIEW_TEXT = "Add mermaid code to generate diagram";
export const MERMAID_ID_PREFIX = "mermaid-";
