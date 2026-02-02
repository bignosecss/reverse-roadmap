"use client";

import { useParams } from "next/navigation";
import { Canvas } from "@/components/canvas";
import Flow from "@/components/flow";

export default function GoalPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <>
      <Flow treeId={id} />
      <Canvas />
    </>
  );
}