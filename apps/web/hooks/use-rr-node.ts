import { useMutation, useQuery } from "@tanstack/react-query";
import {
  create,
  fetchRrNodeById,
  fetchFlowDataById,
  updateRrNodeById,
  removeRrNodeById,
  createRrContentForNode,
  removeRrContentForNode,
  updateRrContentForNode,
  updateConnection,
} from "@/lib/service/rr-node";
import {
  CreateRrNodeDto,
  UpdateConnectionDto,
  UpdateRrContentTabDto,
  UpdateRrNodeDto,
} from "@repo/shared/dto";

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

export const useGetFlowDataById = (id: string) => {
  return useQuery({
    queryKey: ["rrTree", id],
    queryFn: () => fetchFlowDataById(id),
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

export const useUpdateConnection = () => {
  return useMutation({
    mutationFn: (updateConnectionDto: UpdateConnectionDto) =>
      updateConnection(updateConnectionDto),
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
