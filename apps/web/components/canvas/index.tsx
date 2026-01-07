import { useCallback } from "react";
import useFlowStore from "@/lib/stores/flow";
import { cn } from "@/lib/utils";
import useCanvasStore from "@/lib/stores/canvas";
import { Tabs } from "./tabs";
import { Header } from "./header";
import { useTabs } from "./hooks";
import Tiptap from "./tiptap";

export function Canvas() {
  const canvasOpen = useCanvasStore((state) => state.canvasOpen);
  const currentRrNode = useFlowStore((state) => state.currentRrNode);
  const { tabs, activeTabId, setActiveTabId, addTab, removeTab, renameTab } =
    useTabs(currentRrNode);

  // 渲染 Tab 内容（业务层自定义）
  const renderTabContent = useCallback(
    (tabId: string) => {
      const currentTab = tabs.find((tab) => tab.id === tabId);
      if (!currentTab)
        return <div className="text-muted-foreground">暂无内容</div>;

      return (
        <div className="flex flex-col items-center justify-center size-full">
          <p className="text-muted-foreground mb-4">
            {currentRrNode?.description}
          </p>
          <Tiptap tabId={tabId} />
        </div>
      );
    },
    [currentRrNode, tabs],
  );

  // transition 属性，只是将组件移动走了；但组件的宽度坑位还在
  // 并没有解决占位的问题
  // 为了保持打开动画，并减少关闭时不必要的请求、计算，暂时使用字符占位
  if (!canvasOpen) {
    return (
      <div
        className={cn(
          "overflow-hidden",
          "md:shadow-[0_0_18px_var(--border)]",
          "transition-all duration-300 ease-in-out",
          {
            "basis-2/3 translate-x-0 opacity-100": canvasOpen,
            "basis-0 translate-x-full opacity-0 pointer-events-none":
              !canvasOpen,
          },
        )}
      >
        temp solution
      </div>
    );
  }
  // TODO: 优化 canvas 关闭时候的处理

  return (
    <div
      className={cn(
        "overflow-hidden",
        "md:shadow-[0_0_18px_var(--border)]",
        "transition-all duration-300 ease-in-out",
        {
          "basis-2/3 translate-x-0 opacity-100": canvasOpen,
          "basis-0 translate-x-full opacity-0 pointer-events-none": !canvasOpen,
        },
      )}
    >
      <Header />
      <Tabs
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
        onTabAdd={addTab}
        onTabRemove={removeTab}
        onTabRename={renameTab}
        renderTabContent={renderTabContent}
        // 自定义样式（Tailwind）
        listClassName="pb-1"
        activeTabClassName="bg-background border-b-background shadow-sm"
      />
    </div>
  );
}
