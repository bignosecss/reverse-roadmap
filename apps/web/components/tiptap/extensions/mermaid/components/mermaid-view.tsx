import { useCallback, useEffect, useRef, useState } from "react";
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
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import panzoom from "panzoom";

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

  const code = node.attrs.code || "";
  const panzoomRef = useRef<ReturnType<typeof panzoom> | null>(null);

  const initializePanzoom = useCallback((svgElement: SVGElement) => {
    if (panzoomRef.current) {
      panzoomRef.current.dispose();
    }

    const pz = panzoom(svgElement, {
      maxZoom: 5,
      minZoom: 0.2,
      zoomSpeed: 0.6,
      smoothScroll: true,
      filterKey: () => {
        // Prevent default browser zoom with Ctrl/Cmd keys
        return true;
      },
      autocenter: true,
    });

    panzoomRef.current = pz;
  }, []);

  const previewRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && svg) {
        node.innerHTML = svg;
        const svgElement = node.querySelector("svg");
        if (svgElement) {
          svgElement.style.display = "block";
          initializePanzoom(svgElement);
        }
      }
    },
    [svg, initializePanzoom],
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

  useEffect(() => {
    return () => {
      if (panzoomRef.current) {
        panzoomRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    // Center chart when fullscreen state changes
    if (!showCode && panzoomRef.current && svg) {
      const previewContainer = document.querySelector(".mermaid-svg-container");
      const svgElement = previewContainer?.querySelector("svg");

      if (previewContainer && svgElement) {
        const containerWidth = previewContainer.clientWidth;
        const containerHeight = previewContainer.clientHeight;
        const svgWidth = svgElement.clientWidth || 800;
        const svgHeight = svgElement.clientHeight || 600;

        const x = (containerWidth - svgWidth) / 2;
        const y = (containerHeight - svgHeight) / 2;

        panzoomRef.current.moveTo(x, y);
        panzoomRef.current.zoomAbs(x, y, 1);
      }
    }
  }, [isFullscreen, showCode, svg]);

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

  const handleFullscreenToggle = () => {
    if (isFullscreen) {
      setIsFullscreen(false);
    } else {
      setIsFullscreen(true);
    }
  };

  const handleZoomIn = () => {
    if (panzoomRef.current) {
      const transform = panzoomRef.current.getTransform();
      const newScale = Math.min(transform.scale * 1.2, 5);

      // Get SVG element and calculate its center
      const previewContainer = document.querySelector(".mermaid-svg-container");
      const svgElement = previewContainer?.querySelector("svg");

      if (svgElement) {
        const svgWidth = svgElement.clientWidth || 800;
        const svgHeight = svgElement.clientHeight || 600;

        // Calculate SVG center in screen coordinates
        const svgCenterX = (svgWidth / 2) * transform.scale + transform.x;
        const svgCenterY = (svgHeight / 2) * transform.scale + transform.y;

        panzoomRef.current.zoomAbs(svgCenterX, svgCenterY, newScale);
      } else {
        panzoomRef.current.zoomAbs(transform.x, transform.y, newScale);
      }
    }
  };

  const handleZoomOut = () => {
    if (panzoomRef.current) {
      const transform = panzoomRef.current.getTransform();
      const newScale = Math.max(transform.scale * 0.8, 0.2);

      // Get SVG element and calculate its center
      const previewContainer = document.querySelector(".mermaid-svg-container");
      const svgElement = previewContainer?.querySelector("svg");

      if (svgElement) {
        const svgWidth = svgElement.clientWidth || 800;
        const svgHeight = svgElement.clientHeight || 600;

        // Calculate SVG center in screen coordinates
        const svgCenterX = (svgWidth / 2) * transform.scale + transform.x;
        const svgCenterY = (svgHeight / 2) * transform.scale + transform.y;

        panzoomRef.current.zoomAbs(svgCenterX, svgCenterY, newScale);
      } else {
        panzoomRef.current.zoomAbs(transform.x, transform.y, newScale);
      }
    }
  };

  const handleResetView = () => {
    if (panzoomRef.current) {
      // Get the SVG element to center it
      const previewContainer = document.querySelector(".mermaid-svg-container");
      const svgElement = previewContainer?.querySelector("svg");

      if (previewContainer && svgElement) {
        const containerWidth = previewContainer.clientWidth;
        const containerHeight = previewContainer.clientHeight;
        const svgWidth = svgElement.clientWidth || 800;
        const svgHeight = svgElement.clientHeight || 600;

        const x = (containerWidth - svgWidth) / 2;
        const y = (containerHeight - svgHeight) / 2;

        panzoomRef.current.moveTo(x, y);
        panzoomRef.current.zoomAbs(x, y, 1);
      } else {
        panzoomRef.current.moveTo(0, 0);
        panzoomRef.current.zoomAbs(0, 0, 1);
      }
    }
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
            <button
              onClick={handleZoomOut}
              className="toolbar-btn"
              title="Zoom out"
              disabled={!svg || showCode}
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className="toolbar-btn"
              title="Zoom in"
              disabled={!svg || showCode}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleResetView}
              className="toolbar-btn"
              title="Reset view"
              disabled={!svg || showCode}
            >
              <RotateCcw className="h-4 w-4" />
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
              disabled={!svg}
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={handleFullscreenToggle}
              className="toolbar-btn"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
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
              <div ref={previewRef} className="mermaid-svg-container" />
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
