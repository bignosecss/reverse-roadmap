import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRrContent,
  fetchRrContentById,
  updateRrContentById,
  removeRrContentById,
  fetchRrContents,
} from "@/lib/service/rr-content";
import {
  CreateRrContentDto,
  UpdateRrContentDto,
} from "@/lib/types/apiRequests";

export const useCreateRrContent = () => {
  return useMutation({
    mutationFn: (createRrContentDto: CreateRrContentDto) =>
      createRrContent(createRrContentDto),
  });
};

export const useGetRrContentById = (id: string) => {
  return useQuery({
    queryKey: ["rrContent", id],
    queryFn: () => fetchRrContentById(id),
    enabled: !!id,
  });
};

export const useGetRrContents = (ids: string[]) => {
  return useQuery({
    queryKey: ["rrContents", JSON.stringify(ids)],
    queryFn: () => fetchRrContents(ids),
    enabled: ids.length > 0,
  });
};

export const useUpdateRrContentById = (id: string) => {
  return useMutation({
    mutationFn: (updateRrContentDto: UpdateRrContentDto) =>
      updateRrContentById(id, updateRrContentDto),
  });
};

export const useRemoveRrContentById = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeRrContentById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rrContent", id] });
    },
  });
};
