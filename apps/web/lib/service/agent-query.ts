import { apiClient } from "./client";
import type { AgentQueryRequest, AgentResponse } from "@repo/shared";

export const agentQuery = async (
  request: AgentQueryRequest,
): Promise<AgentResponse> => {
  const result = await apiClient<AgentResponse>(
    "agent",
    {
      method: "POST",
      body: JSON.stringify(request),
    },
    "rag",
  );
  return result.data;
};
