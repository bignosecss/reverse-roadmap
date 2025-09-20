import { apiClient } from "./client";
import { RrNodeContent } from "../types/models";
import { Content } from "@tiptap/react";

/**
 * 现阶段，前端不需要手动创建 tiptap content
 */
// export const createRrNodeContent = async (
//   createRrNodeContentDto: Content,
//   nodeId?: string,
// ) => {
//   const params = new URLSearchParams();
//   if (nodeId) {
//     params.append("nodeId", nodeId);
//   }

//   const result = await apiClient<RrNodeContent>(
//     `rr-node-content${params.toString() ? `?${params.toString()}` : ""}`,
//     {
//       method: "POST",
//       body: JSON.stringify(createRrNodeContentDto),
//     },
//   );
//   const newContent = result.data;

//   return newContent;
// };

// export const createRrNodeContentForNode = async (
//   nodeId: string,
//   createRrNodeContentDto: Content,
// ) => {
//   const result = await apiClient<RrNodeContent>(
//     `rr-node-content/for-node/${nodeId}`,
//     {
//       method: "POST",
//       body: JSON.stringify(createRrNodeContentDto),
//     },
//   );
//   const newContent = result.data;

//   return newContent;
// };

export const fetchAllRrNodeContents = async () => {
  const result = await apiClient<RrNodeContent[]>("rr-node-content");
  const allContents = result.data;

  return allContents;
};

export const fetchRrNodeContentById = async (id: string) => {
  const result = await apiClient<RrNodeContent>(`rr-node-content/${id}`);
  const content = result.data;

  return content;
};

export const updateRrNodeContent = async (
  id: string,
  updateRrNodeContentDto: Content,
) => {
  const result = await apiClient<RrNodeContent>(`rr-node-content/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updateRrNodeContentDto),
  });
  const updatedContent = result.data;

  return updatedContent;
};

export const removeRrNodeContent = async (id: string) => {
  const result = await apiClient<RrNodeContent>(`rr-node-content/${id}`, {
    method: "DELETE",
  });
  const deletedContent = result.data;

  return deletedContent;
};
