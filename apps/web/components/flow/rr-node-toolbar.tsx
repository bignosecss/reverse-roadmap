import { NodeToolbar, Position } from "@xyflow/react";

import { RrNode } from "@/lib/types/models";

import { AddNodeTrigger } from "./toolbar/add-node-trigger";
import { EditNodeTrigger } from "./toolbar/edit-node-trigger";
import { DeleteNodeTrigger } from "./toolbar/delete-node-trigger";

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
