import {
  CreateRrNodeDto,
  UpdateRrContentTabDto,
  UpdateRrNodeDto,
} from "@repo/shared/dto";
import { apiClient } from "./client";
import { RrContent, RrNode } from "@repo/shared/models";
import { FlowEdge, FlowNode } from "@repo/shared/flow";

/**
 * Create rr node if the parent attribute in `CreateRrNodeDto` is not null
 * else create rr root node
 * @param createRrNodeDto
 * @returns
 */
export const create = async (createRrNodeDto: CreateRrNodeDto) => {
  const result = await apiClient<RrNode>("rr-node", {
    method: "POST",
    body: JSON.stringify(createRrNodeDto),
  });
  const newRrNode = result.data;
  return newRrNode;
};

export const createRrContentForNode = async (id: string) => {
  const result = await apiClient<{ node: RrNode; content: RrContent }>(
    `rr-node/${id}/contents`,
    {
      method: "POST",
    },
  );
  const rrNodeAndContent = result.data;
  return rrNodeAndContent;
};

export const fetchRrNodeById = async (id: string) => {
  const result = await apiClient<RrNode>(`rr-node/${id}}`);
  const node = result.data;
  return node;
};

export const fetchFlowDataById = async (id: string) => {
  const result = await apiClient<{ nodes: FlowNode[]; edges: FlowEdge[] }>(
    `rr-node/flow-data/${id}`,
  );
  const flowData = result.data;
  return flowData;
};

export const updateRrNodeById = async (
  id: string,
  updateRrNodeDto: UpdateRrNodeDto,
) => {
  const result = await apiClient<RrNode>(`rr-node/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updateRrNodeDto),
  });
  const updatedRrNode = result.data;
  return updatedRrNode;
};

export const updateRrContentForNode = async (
  nodeId: string,
  updateRrContentTabDto: UpdateRrContentTabDto,
) => {
  const result = await apiClient<{ node: RrNode; content: RrContent }>(
    `rr-node/nodes/${nodeId}/contents`,
    {
      method: "PATCH",
      body: JSON.stringify(updateRrContentTabDto),
    },
  );
  const rrNodeAndContent = result.data;
  return rrNodeAndContent;
};

export const removeRrNodeById = async (id: string) => {
  const result = await apiClient<RrNode>(`rr-node/${id}`, {
    method: "DELETE",
  });
  const removedRrNode = result.data;
  return removedRrNode;
};

export const removeRrContentForNode = async (
  nodeId: string,
  contentId: string,
) => {
  const result = await apiClient<{ node: RrNode; content: RrContent }>(
    `rr-node/nodes/${nodeId}/contents/${contentId}`,
    {
      method: "DELETE",
    },
  );
  const rrNodeAndContent = result.data;
  return rrNodeAndContent;
};
