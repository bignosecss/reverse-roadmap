import { NodeToolbar, Position } from "@xyflow/react";
import { AddNodeTrigger } from "./add-node-trigger";
import { EditNodeTrigger } from "./edit-node-trigger";
import { DeleteNodeTrigger } from "./delete-node-trigger";
import { RrNode } from "@repo/shared/models";

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
      <AddNodeTrigger currentNode={currentNode} />
      <EditNodeTrigger currentNode={currentNode} />
      {!isRootNode && <DeleteNodeTrigger currentNode={currentNode} />}
    </NodeToolbar>
  );
}
