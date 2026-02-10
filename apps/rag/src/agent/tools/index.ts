import { ApiNodeClient } from '../client/api-node.client';
import { generateReverseRoadmapTool } from './generate-reverse-roadmap';
import { saveReverseRoadmapTool } from './save-reverse-roadmap';

/**
 * 获取所有可用的 agent 工具
 * @param apiClient - API 客户端，用于调用后端 API
 * @param rrRootId - 当前节点的 Root ID，用于上下文关联
 */
export function getTools(apiClient: ApiNodeClient, rrRootId?: string) {
  return [
    generateReverseRoadmapTool(rrRootId),
    saveReverseRoadmapTool(apiClient),
  ];
}
