import { Tabs } from "./tabs";
import useFlowStore from "@/lib/stores/flow";
import { cn } from "@/lib/utils";
import useCanvasStore from "@/lib/stores/canvas";
import { Header } from "./header";
import { useTabs } from "./hooks";

export function Canvas() {
  const canvasOpen = useCanvasStore((state) => state.canvasOpen);
  const currentRrNode = useFlowStore((state) => state.currentRrNode);
  const { tabs, activeTabId, setActiveTabId, addTab, removeTab, renameTab } =
    useTabs(currentRrNode);

  // 渲染 Tab 内容（业务层自定义）
  const renderTabContent = (tabId: number | string) => {
    const currentTab = tabs.find((tab) => tab.id === tabId);
    if (!currentTab) return <div className="text-gray-500">暂无内容</div>;

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">{currentTab.label}</h2>
        <p className="text-gray-600">{currentTab.desc}</p>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "container mx-auto px-4 py-8",
        "md:shadow-[0_0_18px_var(--border)]",
        {
          block: canvasOpen,
          hidden: !canvasOpen,
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
        panelClassName="shadow-inner"
      />
    </div>
  );
}
