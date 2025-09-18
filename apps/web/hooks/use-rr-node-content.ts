import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRrNodeContent,
  createRrNodeContentForNode,
  fetchAllRrNodeContents,
  fetchRrNodeContentById,
  removeRrNodeContent,
  updateRrNodeContent,
} from "@/lib/service/rr-node-content";
import {
  CreateRrNodeContentDto,
  UpdateRrNodeContentDto,
} from "@/lib/types/apiRequests";

export const useCreateRrNodeContent = (nodeId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createRrNodeContentDto: CreateRrNodeContentDto) =>
      createRrNodeContent(createRrNodeContentDto, nodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrNodeContents"] });
    },
  });
};

export const useCreateRrNodeContentForNode = (nodeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createRrNodeContentDto: CreateRrNodeContentDto) =>
      createRrNodeContentForNode(nodeId, createRrNodeContentDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrNodeContents"] });
      queryClient.invalidateQueries({ queryKey: ["rrNodeContent", nodeId] });
    },
  });
};

export const useGetRrNodeContents = () => {
  return useQuery({
    queryKey: ["rrNodeContents"],
    queryFn: fetchAllRrNodeContents,
  });
};

export const useGetRrNodeContent = (id: string) => {
  return useQuery({
    queryKey: ["rrNodeContent", id],
    queryFn: () => fetchRrNodeContentById(id),
    enabled: !!id,
  });
};

export const useUpdateRrNodeContent = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateRrNodeContentDto: UpdateRrNodeContentDto) =>
      updateRrNodeContent(id, updateRrNodeContentDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrNodeContents"] });
      queryClient.invalidateQueries({ queryKey: ["rrNodeContent", id] });
      // 如果内容关联了节点，也需要更新相关节点的缓存
      // 这里可以根据实际需求添加更多缓存更新逻辑
    },
  });
};

export const useRemoveRrNodeContent = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeRrNodeContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrNodeContents"] });
      queryClient.invalidateQueries({ queryKey: ["rrNodeContent", id] });
    },
  });
};
