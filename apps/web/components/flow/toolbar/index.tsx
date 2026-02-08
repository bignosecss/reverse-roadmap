import { NodeToolbar, Position } from "@xyflow/react";
import { AddNodeTrigger } from "./add-node-trigger";
import { EditNodeTrigger } from "./edit-node-trigger";
import { DeleteNodeTrigger } from "./delete-node-trigger";
import { OpenCanvasTrigger } from "./open-canvas-trigger";
import { RrNode } from "@repo/shared/models";
import { OpenChatTrigger } from "./open-chat-trigger";

function ToolbarDivider() {
  return <div className="w-px h-6 bg-border mx-1 self-center" />;
}

interface RrNodeToolbarProps {
  isVisible: boolean;
  currentNode: RrNode;
  isRootNode: boolean;
}

export default function RrNodeToolbar({
  isVisible,
  currentNode,
  isRootNode,
}: RrNodeToolbarProps) {
  return (
    <NodeToolbar
      isVisible={isVisible}
      position={Position.Top}
      className="flex gap-1 p-1 bg-background border rounded-md shadow-lg"
    >
      <OpenChatTrigger currentNode={currentNode} />
      <ToolbarDivider />
      <AddNodeTrigger currentNode={currentNode} />
      <EditNodeTrigger currentNode={currentNode} />
      {!isRootNode && <DeleteNodeTrigger currentNode={currentNode} />}
      <ToolbarDivider />
      <OpenCanvasTrigger currentNode={currentNode} />
    </NodeToolbar>
  );
}
