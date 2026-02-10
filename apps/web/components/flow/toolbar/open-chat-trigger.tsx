import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { ChatState } from "@/lib/types/models";
import { QuoteIcon } from "lucide-react";
import { useChatStore } from "@/lib/stores/chat";
import { RrNode } from "@repo/shared/models";
import { rrNodeToText } from "@/lib/utils/node";

const chatStoreSelector = (state: ChatState) => ({
  chatOpen: state.chatOpen,
  toggleChat: state.toggleChat,
});

interface OpenChatTriggerProps {
  currentNode: RrNode;
}

export function OpenChatTrigger({ currentNode }: OpenChatTriggerProps) {
  const { chatOpen, toggleChat } = useChatStore(useShallow(chatStoreSelector));

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const { clientX, clientY } = event;
      const aroundInfo = rrNodeToText(currentNode);
      toggleChat(true, { x: clientX, y: clientY }, aroundInfo);
    },
    [toggleChat, currentNode],
  );

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="h-7 w-7 p-0"
      disabled={chatOpen}
      title="聊聊～"
    >
      <QuoteIcon />
    </Button>
  );
}
