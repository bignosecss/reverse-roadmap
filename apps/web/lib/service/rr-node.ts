import { apiClient } from "./client";
import { RrNode } from "../types/models";
import { CreateRrNodeDto, UpdateRrNodeDto } from "../types/apiRequests";

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

export const fetchRrNodeById = async (id: string) => {
  const result = await apiClient<RrNode>(`rr-node/${id}}`);
  const node = result.data;
  return node;
};

export const fetchRrTreeById = async (id: string) => {
  const result = await apiClient<RrNode>(`rr-node/tree/${id}`);
  const rrTree = result.data;
  return rrTree;
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

export const removeRrNodeById = async (id: string) => {
  const result = await apiClient<RrNode>(`rr-node/${id}`, {
    method: "DELETE",
  });
  const removedRrNode = result.data;
  return removedRrNode;
};
