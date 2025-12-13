import { RrRoot } from "@repo/shared/models";
import { CreateRrRootDto, UpdateRrRootDto } from "@repo/shared/dto";
import { apiClient } from "./client";

export const createRrRoot = async (createRrRootDto: CreateRrRootDto) => {
  const result = await apiClient<RrRoot>("rr-root", {
    method: "POST",
    body: JSON.stringify(createRrRootDto),
  });
  const newRrRoot = result.data;
  return newRrRoot;
};

export const fetchAllPublicRrRoots = async () => {
  const result = await apiClient<RrRoot[]>("rr-root/public");
  const allPublicRrRoots = result.data;
  return allPublicRrRoots;
};

export const fetchAllRrRoots = async () => {
  const result = await apiClient<RrRoot[]>("rr-root");
  const allRrRoots = result.data;
  return allRrRoots;
};

export const fetchRrRootById = async (id: string) => {
  const result = await apiClient<RrRoot>(`rr-root/${id}`);
  const rrRoot = result.data;
  return rrRoot;
};

export const updateRrRoot = async (
  id: string,
  updateRrRootDto: UpdateRrRootDto,
) => {
  const result = await apiClient<RrRoot>(`rr-root/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updateRrRootDto),
  });
  const updatedRrRoot = result.data;
  return updatedRrRoot;
};

export const removeRrRootById = async (id: string) => {
  const result = await apiClient<RrRoot>(`rr-root/${id}`, {
    method: "DELETE",
  });
  const removedRrRoot = result.data;
  return removedRrRoot;
};
