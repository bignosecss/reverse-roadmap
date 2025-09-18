import { apiClient } from "./client";
import { RrNodeContent } from "../types/models";
import {
  CreateRrNodeContentDto,
  UpdateRrNodeContentDto,
} from "../types/apiRequests";

export const createRrNodeContent = async (
  createRrNodeContentDto: CreateRrNodeContentDto,
  nodeId?: string,
) => {
  const params = new URLSearchParams();
  if (nodeId) {
    params.append("nodeId", nodeId);
  }

  const result = await apiClient<RrNodeContent>(
    `rr-node-content${params.toString() ? `?${params.toString()}` : ""}`,
    {
      method: "POST",
      body: JSON.stringify(createRrNodeContentDto),
    },
  );
  const newContent = result.data;

  return newContent;
};

export const createRrNodeContentForNode = async (
  nodeId: string,
  createRrNodeContentDto: CreateRrNodeContentDto,
) => {
  const result = await apiClient<RrNodeContent>(
    `rr-node-content/for-node/${nodeId}`,
    {
      method: "POST",
      body: JSON.stringify(createRrNodeContentDto),
    },
  );
  const newContent = result.data;

  return newContent;
};

export const fetchAllRrNodeContents = async () => {
  const result = await apiClient<RrNodeContent[]>("rr-node-content");
  const allContents = result.data;

  return allContents;
};

export const fetchRrNodeContentById = async (id: string) => {
  const result = await apiClient<RrNodeContent>(`rr-node-content/${id}`);
  const content = result.data;

  return content;
};

export const updateRrNodeContent = async (
  id: string,
  updateRrNodeContentDto: UpdateRrNodeContentDto,
) => {
  const result = await apiClient<RrNodeContent>(`rr-node-content/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updateRrNodeContentDto),
  });
  const updatedContent = result.data;

  return updatedContent;
};

export const removeRrNodeContent = async (id: string) => {
  const result = await apiClient<RrNodeContent>(`rr-node-content/${id}`, {
    method: "DELETE",
  });
  const deletedContent = result.data;

  return deletedContent;
};
