import { apiClient } from "./client";
import { RrContent } from "../types/models";
import { CreateRrContentDto, UpdateRrContentDto } from "../types/apiRequests";

export const createRrContent = async (
  createRrContentDto: CreateRrContentDto,
) => {
  const result = await apiClient<RrContent>("rr-content", {
    method: "POST",
    body: JSON.stringify(createRrContentDto),
  });
  const newRrContent = result.data;
  return newRrContent;
};

export const fetchRrContentById = async (id: string) => {
  const result = await apiClient<RrContent>(`rr-content/${id}`);
  const rrContent = result.data;
  return rrContent;
};

export const fetchRrContents = async (ids: string[]) => {
  const result = await apiClient<RrContent[]>(`rr-content/batch`, {
    method: "POST",
    body: JSON.stringify(ids),
  });
  const rrContents = result.data;
  return rrContents;
};

export const updateRrContentById = async (
  id: string,
  updateRrContentDto: UpdateRrContentDto,
) => {
  const result = await apiClient<RrContent>(`rr-content/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updateRrContentDto),
  });
  const updatedRrContent = result.data;
  return updatedRrContent;
};

export const removeRrContentById = async (id: string) => {
  const result = await apiClient<RrContent>(`rr-content/${id}`, {
    method: "DELETE",
  });
  const removedRrContent = result.data;
  return removedRrContent;
};
