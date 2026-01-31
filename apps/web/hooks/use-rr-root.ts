import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRrRoot,
  fetchAllRrRoots,
  fetchRrRootById,
  updateRrRoot,
  removeRrRootById,
} from "@/lib/service/rr-root";
import { CreateRrRootDto, UpdateRrRootDto } from "@repo/shared/dto";
import { RootsQueryKey } from "@repo/shared/models";

export const useCreateRrRoot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createRrRootDto: CreateRrRootDto) =>
      createRrRoot(createRrRootDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RootsQueryKey.private] });
    },
  });
};

export const useGetRrRoots = () => {
  return useQuery({
    queryKey: [RootsQueryKey.private],
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
