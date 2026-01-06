import { ReactFlowProvider } from "@xyflow/react";
import { FlowHeader } from "./flow-header";
import FlowContent from "./flow-content";

export default function Flow({ treeId }: { treeId: string }) {
  return (
    <div className="flex-1 flex flex-col ">
      <FlowHeader />

      <div className="flex-1">
        <ReactFlowProvider>
          <FlowContent treeId={treeId} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
