import { useState, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/react";
import { useTheme } from "next-themes";
import { TOAST_TIMER } from "./constants";
import { copyToClipboard, downloadSvgFile } from "../utils";
import { useMermaidRenderer } from "../hooks/use-mermaid-renderer";
import { usePanZoomController } from "../hooks/use-panzoom-controller";
import MermaidToolbar from "./mermaid-toolbar";
import MermaidCodeEditor from "./mermaid-code-editor";
import MermaidPreview from "./mermaid-preview";

export default function MermaidView({ node, updateAttributes }: NodeViewProps) {
  const { resolvedTheme } = useTheme();
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const code = node.attrs.code || "";

  const { svg, error } = useMermaidRenderer({
    code,
    theme: resolvedTheme || "default",
  });

  const { initializePanzoom, zoomIn, zoomOut, resetView, centerSvg } =
    usePanZoomController({
      svg,
      isPreviewMode: !showCode,
    });

  useEffect(() => {
    centerSvg();
  }, [isFullscreen, showCode, centerSvg]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    updateAttributes({ code: e.target.value });

  const handleCopyCode = async () => {
    if (await copyToClipboard(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), TOAST_TIMER);
    }
  };

  const handleDownloadSvg = () => downloadSvgFile(svg);
  const handleFullscreenToggle = () => setIsFullscreen((prev) => !prev);

  return (
    <NodeViewWrapper className="mermaid-node">
      <div className={`mermaid-container ${isFullscreen ? "fullscreen" : ""}`}>
        <MermaidToolbar
          showCode={showCode}
          copied={copied}
          hasSvg={!!svg}
          isFullscreen={isFullscreen}
          onToggleCode={() => setShowCode(true)}
          onTogglePreview={() => setShowCode(false)}
          onCopyCode={handleCopyCode}
          onDownloadSvg={handleDownloadSvg}
          onToggleFullscreen={handleFullscreenToggle}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetView={resetView}
        />

        {showCode ? (
          <MermaidCodeEditor code={code} onChange={handleCodeChange} />
        ) : (
          <MermaidPreview
            svg={svg}
            error={error}
            initializePanzoom={initializePanzoom}
          />
        )}
      </div>
    </NodeViewWrapper>
  );
}
