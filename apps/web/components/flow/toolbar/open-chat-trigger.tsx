import { Button } from "@/components/ui/button";
import { ChatState } from "@/lib/types/models";
import { QuoteIcon } from "lucide-react";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/lib/stores/chat";

const chatStoreSelector = (state: ChatState) => ({
  chatOpen: state.chatOpen,
  toggleChat: state.toggleChat,
});

export function OpenChatTrigger() {
  const { chatOpen, toggleChat } = useChatStore(useShallow(chatStoreSelector));

  const handleClick = useCallback(() => {
    toggleChat(true);
  }, [toggleChat]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="h-7 w-7 p-0"
      disabled={chatOpen}
      title="打开Chat"
    >
      <QuoteIcon />
    </Button>
  );
}
