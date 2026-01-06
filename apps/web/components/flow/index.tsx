import { ReactFlowProvider } from "@xyflow/react";
import { FlowHeader } from "./flow-header";
import FlowContent from "./flow-content";

export default function Flow({ treeId }: { treeId: string }) {
  return (
    <div className="w-full flex flex-col h-full">
      <FlowHeader />

      <div className="flex-1">
        <ReactFlowProvider>
          <FlowContent treeId={treeId} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
