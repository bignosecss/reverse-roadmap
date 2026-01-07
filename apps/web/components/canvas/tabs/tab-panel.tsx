import { TabPanelProps } from "./props";

export default function TabPanel({
  activeTabId,
  renderTabContent,
  panelClassName = "",
}: TabPanelProps) {
  return (
    <div
      className={`w-full flex-1 border bg-background p-4 overflow-y-auto overflow-x-hidden ${panelClassName}`}
      style={{ maxHeight: "calc(100vh - 120px)", scrollbarWidth: "none" }}
    >
      {/* 动态渲染当前激活 Tab 的内容 */}
      <div className="h-full w-full">{renderTabContent(activeTabId)}</div>
    </div>
  );
}
