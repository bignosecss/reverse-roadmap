import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRrRoot,
  fetchAllRrRoots,
  fetchPublicRrRoots,
  fetchRrRootById,
  updateRrRoot,
  removeRrRootById,
} from "@/lib/service/rr-root";
import { CreateRrRootDto, UpdateRrRootDto } from "@repo/shared/dto";
import useAuthStore from "@/lib/stores/auth";

export const useCreateRrRoot = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (createRrRootDto: CreateRrRootDto) =>
      createRrRoot(createRrRootDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrRoots", !!user] });
    },
  });
};

export const useGetRrRoots = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ["rrRoots", !!user],
    queryFn: user ? fetchAllRrRoots : fetchPublicRrRoots,
  });
};

export const useGetRrRoot = (rootId: string) => {
  return useQuery({
    queryKey: ["rrRoot", rootId],
    queryFn: () => fetchRrRootById(rootId),
  });
};

export const useUpdateRrRoot = (rootId: string) => {
  return useMutation({
    mutationFn: (updateRrRootDto: UpdateRrRootDto) =>
      updateRrRoot(rootId, updateRrRootDto),
  });
};

export const useDeleteRrRoot = (rootId: string) => {
  return useMutation({
    mutationFn: () => removeRrRootById(rootId),
  });
};
