import { apiClient } from "./client";
import { RrRoot } from "../types/models";
import { CreateRrRootDto, UpdateRrRootDto } from "../types/apiRequests";

export const createRrRoot = async (createRrRootDto: CreateRrRootDto) => {
  const result = await apiClient<RrRoot>("rr-root", {
    method: "POST",
    body: JSON.stringify(createRrRootDto),
  });
  const newRoot = result.data;

  return newRoot;
};

export const fetchAllRrRoots = async () => {
  const result = await apiClient<RrRoot[]>("rr-root");
  const allRoots = result.data;

  console.log("fetchAllRoots result", allRoots);

  return allRoots;
};

export const fetchRrRootById = async (rootId: string) => {
  const result = await apiClient<RrRoot>(`rr-root/${rootId}`);
  const root = result.data;

  return root;
};

export const updateRrRoot = async (
  id: string,
  updateRrRootDto: UpdateRrRootDto,
) => {
  const result = await apiClient<RrRoot>(`rr-root/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updateRrRootDto),
  });
  const updatedRoot = result.data;

  return updatedRoot;
};

export const removeRrRoot = async (id: string) => {
  const result = await apiClient<RrRoot>(`rr-root/${id}`, {
    method: "DELETE",
  });
  const removedRoot = result.data;

  return removedRoot;
};
