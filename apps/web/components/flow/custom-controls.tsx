import { ControlButton, Controls, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

// 自定义控制组件，必须在 ReactFlow 内部使用
export function CustomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const handleFitView = useCallback(() => {
    fitView({
      padding: 0.1,
      includeHiddenNodes: false,
      minZoom: 0.1,
      maxZoom: 1.5,
      duration: 300, // 添加平滑过渡效果
    });
  }, [fitView]);

  return (
    <Controls
      showZoom={false}
      showFitView={false}
      showInteractive={false}
      className="!absolute !bottom-6 !z-50"
    >
      {/* 自定义 Zoom In 按钮 */}
      <ControlButton onClick={() => zoomIn({ duration: 180 })} title="放大">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </ControlButton>

      {/* 自定义 Zoom Out 按钮 */}
      <ControlButton onClick={() => zoomOut({ duration: 180 })} title="缩小">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </ControlButton>

      {/* 自定义 Fit View 按钮，带平滑过渡效果 */}
      <ControlButton onClick={handleFitView} title="适应视图">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
      </ControlButton>
    </Controls>
  );
}