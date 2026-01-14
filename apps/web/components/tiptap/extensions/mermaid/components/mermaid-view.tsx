import { useCallback, useEffect, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import {
  Eye,
  Code2,
  Download,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Maximize,
} from "lucide-react";
import { toast } from "sonner";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

export default function MermaidView({ node, updateAttributes }: NodeViewProps) {
  const { resolvedTheme } = useTheme();
  const [showCode, setShowCode] = useState(true);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const code = node.attrs.code || "";
  const previewRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && svg) {
        node.innerHTML = svg;
      }
    },
    [svg],
  );

  const renderMermaid = useCallback(async () => {
    if (!code.trim()) {
      setSvg("");
      setError("");
      return;
    }

    try {
      const id = `mermaid-${Date.now()}`;
      const theme = resolvedTheme === "dark" ? "dark" : "default";

      mermaid.initialize({
        startOnLoad: false,
        theme,
        securityLevel: "loose",
      });
      const { svg } = await mermaid.render(id, code);

      setSvg(svg);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid mermaid syntax");
      setSvg("");
    }
  }, [code, resolvedTheme]);

  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateAttributes({ code: e.target.value });
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownloadSvg = () => {
    if (!svg) return;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("SVG downloaded");
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.3));
  };

  const handleFitView = () => {
    setZoom(1);
    toast.success("Fit to view");
  };

  return (
    <NodeViewWrapper className="mermaid-node">
      <div className={`mermaid-container ${isFullscreen ? "fullscreen" : ""}`}>
        <div className="mermaid-toolbar">
          <div className="toolbar-left">
            <button
              onClick={() => setShowCode(true)}
              className={`toolbar-btn ${showCode ? "active" : ""}`}
              title="Edit code"
            >
              <Code2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowCode(false)}
              className={`toolbar-btn ${!showCode ? "active" : ""}`}
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
          <div className="toolbar-right">
            <button
              onClick={handleCopyCode}
              className="toolbar-btn"
              title="Copy code"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleDownloadSvg}
              className="toolbar-btn"
              title="Download SVG"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="toolbar-btn"
              title="Zoom out"
              disabled={zoom <= 0.3}
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="toolbar-btn"
              title="Zoom in"
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleFitView}
              className="toolbar-btn"
              title="Fit to view"
            >
              <Maximize className="h-4 w-4" />
            </button>
            <button
              onClick={handleToggleFullscreen}
              className="toolbar-btn"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {showCode ? (
          <div className="code-editor">
            <textarea
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter mermaid code here..."
              className="mermaid-textarea"
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="mermaid-preview">
            {error ? (
              <div className="error-message">
                <p className="error-title">Mermaid Error:</p>
                <p className="error-text">{error}</p>
              </div>
            ) : svg ? (
              <div
                ref={previewRef}
                className="mermaid-svg-container"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                }}
              />
            ) : (
              <p className="empty-state">
                Add mermaid code to generate diagram
              </p>
            )}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
