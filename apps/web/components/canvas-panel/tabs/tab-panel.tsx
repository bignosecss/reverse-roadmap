import { TabPanelProps } from "./props";

export default function TabPanel({
  activeTabId,
  renderTabContent,
  panelClassName = "",
}: TabPanelProps) {
  return (
    <div
      className={`w-full min-h-[400px] border border-t-0 bg-background p-4 ${panelClassName}`}
    >
      {/* 动态渲染当前激活 Tab 的内容 */}
      {renderTabContent(activeTabId)}
    </div>
  );
}
