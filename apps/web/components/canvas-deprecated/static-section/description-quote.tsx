import useFlowStore from "@/lib/stores/flow";

export function DescriptionQuote() {
  const currentRrNode = useFlowStore((state) => state.currentRrNode);

  if (!currentRrNode || !currentRrNode.description) {
    return null;
  }

  return (
    <section className="w-full flex flex-row justify-center">
      <div className="w-full h-fit flex flex-row justify-center py-8 px-4">
        <div className="min-w-1/3 max-w-4/5 h-fit">
          <blockquote className="border-l-2 pl-6 italic max-h-fit">
            {currentRrNode.description}
          </blockquote>
        </div>
      </div>
    </section>
  );
}
