import { TabPanelProps } from "./props";

export default function TabPanel({
  activeTabId,
  renderTabContent,
  panelClassName = "",
}: TabPanelProps) {
  return (
    // TODO: 打开动画细节
    // 打开 Canvas 后，tiptap content 内容出现过程会出现文字挤压问题
    <div
      className={`w-full flex-1 border bg-background p-4 overflow-y-auto overflow-x-hidden ${panelClassName}`}
      style={{ maxHeight: "calc(100vh - 120px)", scrollbarWidth: "none" }}
    >
      {/* 动态渲染当前激活 Tab 的内容 */}
      <div className="h-full w-full">{renderTabContent(activeTabId)}</div>
    </div>
  );
}
