import { useCallback } from "react";
import { EMPTY_PREVIEW_TEXT } from "./constants";

interface MermaidPreviewProps {
  svg: string;
  error: string;
  initializePanzoom: (svgElement: SVGElement) => void;
}

export default function MermaidPreview({
  svg,
  error,
  initializePanzoom,
}: MermaidPreviewProps) {
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

  if (error) {
    return (
      <div className="mermaid-preview">
        <div className="error-message">
          <p className="error-title">Mermaid Error:</p>
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (svg) {
    return (
      <div className="mermaid-preview">
        <div ref={previewRef} className="mermaid-svg-container" />
      </div>
    );
  }

  return (
    <div className="mermaid-preview">
      <p className="empty-state">{EMPTY_PREVIEW_TEXT}</p>
    </div>
  );
}
