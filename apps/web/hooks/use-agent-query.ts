import { useMutation } from "@tanstack/react-query";
import { agentQuery } from "@/lib/service/agent-query";
import type { AgentQueryRequest } from "@repo/shared";

export const useAgentQuery = () => {
  return useMutation({
    mutationFn: (request: AgentQueryRequest) => agentQuery(request),
  });
};
