"use client";

import { useParams } from "next/navigation";
import { Canvas } from "@/components/canvas";
import Flow from "@/components/flow";
import DraggableChatBox from "@/components/chat";

export default function GoalPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <>
      <Flow treeId={id} />
      <Canvas />
      <DraggableChatBox>
        <h2 className="text-lg font-semibold mb-2">Draggable Box</h2>
        <p className="text-sm text-muted-foreground">
          This box can be dragged anywhere on the page
        </p>
      </DraggableChatBox>
    </>
  );
}
