import {
  Eye,
  Code2,
  Download,
  Copy,
  Check,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface MermaidToolbarProps {
  showCode: boolean;
  copied: boolean;
  hasSvg: boolean;
  isFullscreen: boolean;
  onToggleCode: () => void;
  onTogglePreview: () => void;
  onCopyCode: () => void;
  onDownloadSvg: () => void;
  onToggleFullscreen: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export default function MermaidToolbar({
  showCode,
  copied,
  hasSvg,
  isFullscreen,
  onToggleCode,
  onTogglePreview,
  onCopyCode,
  onDownloadSvg,
  onToggleFullscreen,
  onZoomIn,
  onZoomOut,
  onResetView,
}: MermaidToolbarProps) {
  const isPreviewMode = !showCode;

  return (
    <div className="mermaid-toolbar">
      <div className="toolbar-left">
        <button
          onClick={onToggleCode}
          className={`toolbar-btn ${showCode ? "active" : ""}`}
          title="编辑代码"
        >
          <Code2 className="h-4 w-4" />
        </button>
        <button
          onClick={onTogglePreview}
          className={`toolbar-btn ${isPreviewMode ? "active" : ""}`}
          title="预览"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="toolbar-btn"
          title="缩小"
          disabled={!hasSvg || showCode}
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={onZoomIn}
          className="toolbar-btn"
          title="放大"
          disabled={!hasSvg || showCode}
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={onResetView}
          className="toolbar-btn"
          title="重置视图"
          disabled={!hasSvg || showCode}
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
      <div className="toolbar-right">
        <button onClick={onCopyCode} className="toolbar-btn" title="复制代码">
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={onDownloadSvg}
          className="toolbar-btn"
          title="下载 SVG"
          disabled={!hasSvg}
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          onClick={onToggleFullscreen}
          className="toolbar-btn"
          title={isFullscreen ? "退出全屏" : "全屏"}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
