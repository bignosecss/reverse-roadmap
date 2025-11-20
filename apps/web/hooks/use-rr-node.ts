import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useUpdateRrNodeById = (nodeId: string, currentTreeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateRrNodeDto: UpdateRrNodeDto) =>
      updateRrNodeById(nodeId, updateRrNodeDto),
    // onMutate: async (updatedData: UpdateRrNodeDto) => {
    //   if (!currentTreeId) return;
    //   await queryClient.cancelQueries({ queryKey: ["rrTree", currentTreeId] });
    //   const previousNode = useFlowStore.getState().getNode(nodeId);
    //   useFlowStore.getState().updateNode(nodeId, updatedData);
    //   return { previousNode };
    // },
    // onError: (err, variables, context) => {
    //   if (context?.previousNode) {
    //     useFlowStore
    //       .getState()
    //       .updateNode(nodeId, context.previousNode.data.rrNode);
    //   }
    // },
    // onSuccess: (updatedNodeFromServer: RrNode) => {
    //   if (!currentTreeId) return;

    //   queryClient.setQueryData(
    //     ["rrTree", currentTreeId],
    //     (oldTreeData: RrNode | undefined) => {
    //       if (!oldTreeData) return undefined;

    //       const updateRrNodeInRrTree = (rrNode: RrNode): RrNode => {
    //         if (rrNode._id === updatedNodeFromServer._id) {
    //           return { ...rrNode, ...updatedNodeFromServer };
    //         }

    //         if (rrNode.children && rrNode.children.length > 0) {
    //           let hasChanged = false;
    //           const newChildren = rrNode.children.map((child) => {
    //             const newChild = updateRrNodeInRrTree(child);
    //             if (newChild !== child) {
    //               hasChanged = true;
    //             }
    //             return newChild;
    //           });

    //           if (hasChanged) {
    //             return { ...rrNode, children: newChildren };
    //           }
    //         }
    //         return rrNode;
    //       };
    //       return updateRrNodeInRrTree(oldTreeData);
    //     },
    //   );
    // },
    onSettled: () => {
      if (!currentTreeId) return;
      queryClient.invalidateQueries({ queryKey: ["rrTree", currentTreeId] });
    },
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
