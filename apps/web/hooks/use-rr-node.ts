import { useMutation, useQuery } from "@tanstack/react-query";
import {
  create,
  fetchRrNodeById,
  fetchRrTreeById,
  updateRrNodeById,
  removeRrNodeById,
  createRrContentForNode,
  removeRrContentForNode,
  updateRrContentForNode,
} from "@/lib/service/rr-node";
import {
  CreateRrNodeDto,
  UpdateRrContentTabDto,
  UpdateRrNodeDto,
} from "@/lib/types/apiRequests";

export const useCreate = () => {
  return useMutation({
    mutationFn: (createRrNodeDto: CreateRrNodeDto) => create(createRrNodeDto),
  });
};

export const useCreateRrContentForNode = () => {
  return useMutation({
    mutationFn: (id: string) => createRrContentForNode(id),
  });
};

export const useGetRrNodeById = (id: string) => {
  return useQuery({
    queryKey: ["rrNode", id],
    queryFn: () => fetchRrNodeById(id),
  });
};

export const useGetRrTreeById = (id: string) => {
  return useQuery({
    queryKey: ["rrTree", id],
    queryFn: () => fetchRrTreeById(id),
  });
};

export const useUpdateRrNodeById = (nodeId: string) => {
  return useMutation({
    mutationFn: (updateRrNodeDto: UpdateRrNodeDto) =>
      updateRrNodeById(nodeId, updateRrNodeDto),
  });
};

export const useUpdateRrContentForNode = (nodeId: string) => {
  return useMutation({
    mutationFn: (updateRrContentTabDto: UpdateRrContentTabDto) =>
      updateRrContentForNode(nodeId, updateRrContentTabDto),
  });
};

export const useRemoveRrNodeById = (id: string) => {
  return useMutation({
    mutationFn: () => removeRrNodeById(id),
  });
};

export const useRemoveRrContentForNode = () => {
  return useMutation({
    mutationFn: ({
      nodeId,
      contentId,
    }: {
      nodeId: string;
      contentId: string;
    }) => removeRrContentForNode(nodeId, contentId),
  });
};
