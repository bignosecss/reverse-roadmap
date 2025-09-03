import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRrNode,
  createRrTree,
  fetchAllRrNodes,
  fetchRrNodeById,
  fetchRrTreeById,
  removeRrNode,
  removeRrTree,
  updateRrNode,
} from "@/lib/service/rr-node";
import {
  CreateRrNodeDto,
  RemoveRrNodeDto,
  UpdateRrNodeDto,
} from "@/lib/types/apiRequests";

export const useCreateRrTree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createRrNodeDto: CreateRrNodeDto) =>
      createRrTree(createRrNodeDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrRoots"] });
    },
  });
};

export const useCreateRrNode = (treeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createRrNodeDto: CreateRrNodeDto) =>
      createRrNode(treeId, createRrNodeDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
    },
  });
};

export const useGetRrNodes = () => {
  return useQuery({
    queryKey: ["rrNodes"],
    queryFn: fetchAllRrNodes,
  });
};

export const useGetRrTree = (treeId: string) => {
  return useQuery({
    queryKey: ["rrTree", treeId],
    queryFn: () => fetchRrTreeById(treeId),
  });
};

export const useGetRrNode = (treeId: string, nodeId: string) => {
  return useQuery({
    queryKey: ["rrNode", treeId, nodeId],
    queryFn: () => fetchRrNodeById(treeId, nodeId),
  });
};

export const useUpdateRrNode = (treeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateRrNodeDto: UpdateRrNodeDto) =>
      updateRrNode(treeId, updateRrNodeDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrNode", treeId] });
    },
  });
};

export const useRemoveRrTree = (treeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeRrTree(treeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
      queryClient.invalidateQueries({ queryKey: ["rrRoots"] });
    },
  });
};

export const useRemoveRrNode = (treeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (removeRrNodeDto: RemoveRrNodeDto) =>
      removeRrNode(treeId, removeRrNodeDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
    },
  });
};
