import { useCallback, useEffect, useRef } from "react";

export function useScrollToBottom(dependencies: unknown[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToBottom, ...dependencies]);

  return messagesEndRef;
}
