import { useCallback, useEffect, useRef } from "react";
import panzoom from "panzoom";
import { PAN_ZOOM_CONFIG } from "../mermaid-view/constants";
import { calculateCenterPosition, getSvgElements } from "../mermaid-view/utils";

interface UsePanZoomControllerProps {
  svg: string;
  isPreviewMode: boolean;
}

export const usePanZoomController = ({
  svg,
  isPreviewMode,
}: UsePanZoomControllerProps) => {
  const panzoomRef = useRef<ReturnType<typeof panzoom> | null>(null);

  const initializePanzoom = useCallback((svgElement: SVGElement) => {
    if (panzoomRef.current) panzoomRef.current.dispose();

    const pz = panzoom(svgElement, {
      ...PAN_ZOOM_CONFIG,
      filterKey: () => true,
      autocenter: true,
    });
    panzoomRef.current = pz;
  }, []);

  const zoomIn = useCallback(() => {
    if (!panzoomRef.current) return;
    const { scale } = panzoomRef.current.getTransform();
    const newScale = Math.min(
      scale * PAN_ZOOM_CONFIG.zoomStep,
      PAN_ZOOM_CONFIG.maxZoom,
    );
    const { svgElement } = getSvgElements();

    if (svgElement) {
      const center = calculateCenterPosition(
        svgElement.parentElement!,
        svgElement,
      );
      panzoomRef.current.zoomAbs(center.x, center.y, newScale);
    }
  }, []);

  const zoomOut = useCallback(() => {
    if (!panzoomRef.current) return;
    const { scale } = panzoomRef.current.getTransform();
    const newScale = Math.max(
      scale / PAN_ZOOM_CONFIG.zoomStep,
      PAN_ZOOM_CONFIG.minZoom,
    );
    const { svgElement } = getSvgElements();

    if (svgElement) {
      const center = calculateCenterPosition(
        svgElement.parentElement!,
        svgElement,
      );
      panzoomRef.current.zoomAbs(center.x, center.y, newScale);
    }
  }, []);

  const resetView = useCallback(() => {
    if (!panzoomRef.current) return;
    const { previewContainer, svgElement } = getSvgElements();

    if (previewContainer && svgElement) {
      const { x, y } = calculateCenterPosition(previewContainer, svgElement);
      panzoomRef.current.moveTo(x, y);
      panzoomRef.current.zoomAbs(x, y, PAN_ZOOM_CONFIG.defaultScale);
    }
  }, []);

  const centerSvg = useCallback(() => {
    if (!isPreviewMode || !svg || !panzoomRef.current) return;
    resetView();
  }, [isPreviewMode, svg, resetView]);

  useEffect(() => {
    return () => panzoomRef.current?.dispose();
  }, []);

  return {
    initializePanzoom,
    zoomIn,
    zoomOut,
    resetView,
    centerSvg,
    panzoomRef,
  };
};
