import { apiClient } from "./client";
import { RrNode } from "../types/models";
import { CreateRrNodeDto, UpdateRrNodeDto } from "../types/apiRequests";

export const createRrTree = async (createRrNodeDto: CreateRrNodeDto) => {
  const result = await apiClient<RrNode>("rr-node/root", {
    method: "POST",
    body: JSON.stringify(createRrNodeDto),
  });
  const newNode = result.data;

  return newNode;
};

export const createRrNode = async (
  treeId: string,
  parentNodeId: string,
  createRrNodeDto: CreateRrNodeDto,
) => {
  const queryParams = new URLSearchParams({
    treeId,
    parentNodeId,
  }).toString();

  const result = await apiClient<RrNode>(`rr-node/child?${queryParams}`, {
    method: "POST",
    body: JSON.stringify(createRrNodeDto),
  });
  const newNode = result.data;

  return newNode;
};

export const fetchAllRrNodes = async () => {
  const result = await apiClient<RrNode[]>("rr-node");
  const allNodes = result.data;

  return allNodes;
};

export const fetchRrTreeById = async (treeId: string) => {
  const params = new URLSearchParams({
    treeId,
  });

  const result = await apiClient<RrNode>(`rr-node/findRoot?${params.toString()}`);
  const tree = result.data;

  return tree;
};

export const fetchRrNodeById = async (treeId: string, nodeId: string) => {
  const params = new URLSearchParams({
    treeId,
    nodeId,
  });

  const result = await apiClient<RrNode>(`rr-node/findChild?${params.toString()}`);
  const node = result.data;

  return node;
};

export const updateRrNode = async (
  treeId: string,
  nodeId: string,
  updateRrNodeDto: UpdateRrNodeDto,
) => {
  const queryParams = new URLSearchParams({
    treeId,
    nodeId,
  }).toString();

  const result = await apiClient<RrNode>(`rr-node?${queryParams}`, {
    method: "PATCH",
    body: JSON.stringify(updateRrNodeDto),
  });
  const updatedNode = result.data;

  return updatedNode;
};

export const removeRrTree = async (treeId: string) => {
  const queryParams = new URLSearchParams({
    treeId,
  }).toString();

  const result = await apiClient<RrNode>(`rr-node/root?${queryParams}`, {
    method: "DELETE",
  });
  const deletedTree = result.data;

  return deletedTree;
};

export const removeRrNode = async (treeId: string, nodeId: string) => {
  const queryParams = new URLSearchParams({
    treeId,
    nodeId,
  }).toString();

  const result = await apiClient<RrNode>(`rr-node/child/${queryParams}`, {
    method: "DELETE",
  });
  const deletedNode = result.data;

  return deletedNode;
};
