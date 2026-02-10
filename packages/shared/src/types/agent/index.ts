import { RrNodeStatus } from "../models";

/**
 * Agent 生成的内容对象
 */
export interface AgentRrContentDto {
  tabTitle: string;
  type: "doc";
  // TipTap 文档 JSON (editor.getJSON())
  content: unknown[];
}

/**
 * Agent 生成的节点对象
 */
export interface AgentRrNodeDto {
  title: string;
  description?: string;
  parent: string | null; // 父节点 ID，根节点为 null
  content: AgentRrContentDto[];
  children: AgentRrNodeDto[];
  status?: RrNodeStatus;
  excludeFromRAG?: boolean;
}

/**
 * Agent 生成的根对象
 */
export interface AgentRrRootDto {
  title: string;
  rootRrNode: AgentRrNodeDto;
  status: "active" | "archived";
  isPublic?: boolean;
}

/**
 * 生成 reverse roadmap 的输入参数
 */
export interface GenerateReverseRoadmapInput {
  /** 目标或要解决的问题 */
  goal: string;
  /** 目标描述（可选） */
  description?: string;
  /** 要生成的子节点数量（默认 3-5） */
  childCount?: number;
  /** 根节点 ID（可选，用于关联现有节点） */
  parentId?: string | null;
}

/**
 * 保存 reverse roadmap 的输入参数
 */
export interface SaveReverseRoadmapInput {
  /** 要保存的节点树结构 */
  node: AgentRrNodeDto;
  /** 父节点 ID（如果作为子节点添加到现有节点） */
  parentId?: string | null;
}
