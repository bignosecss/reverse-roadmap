import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRrRoot,
  removeRrRoot,
  fetchAllRrRoots,
  fetchRrRootById,
  updateRrRoot,
} from "@/lib/service/rr-root";
import { CreateRrRootDto, UpdateRrRootDto } from "@/lib/types/apiRequests";

export const useCreateRrRoot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createRrRootDto: CreateRrRootDto) =>
      createRrRoot(createRrRootDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrRoots"] });
    },
  });
};

export const useGetRrRoots = () => {
  return useQuery({
    queryKey: ["rrRoots"],
    queryFn: fetchAllRrRoots,
  });
};

export const useGetRrRoot = (rootId: string) => {
  return useQuery({
    queryKey: ["rrRoot", rootId],
    queryFn: () => fetchRrRootById(rootId),
  });
};

export const useUpdateRrRoot = (rootId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateRrRootDto: UpdateRrRootDto) =>
      updateRrRoot(rootId, updateRrRootDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrRoot", rootId] });
      queryClient.invalidateQueries({ queryKey: ["rrRoots"] });
    },
  });
};

export const useDeleteRrRoot = (rootId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeRrRoot(rootId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrRoots"] });
    },
  });
};
