import type { RrRootMetadata } from "./rr-root.metadata";
import type { RrNodeMetadata } from "./rr-node.metadata";
import type { RrContentMetadata } from "./rr-content.metadata";

/**
 * 语义化文档基础结构
 * 用于将 RAG 数据转换为更易理解的文本格式，适合 LLM 处理和用户阅读
 */
export interface SemanticDocument<TMetadata = Record<string, unknown>> {
  id: string;
  content: string;
  metadata: TMetadata;
}

/**
 * 根目标语义化文档
 * 将 RrRootDocument 转换为结构化的文本描述
 */
export interface SemanticRootDocument extends SemanticDocument<RrRootMetadata> {
  type: "root";
}

/**
 * 节点语义化文档
 * 将 RrNodeDocument 转换为结构化的文本描述
 */
export interface SemanticNodeDocument extends SemanticDocument<RrNodeMetadata> {
  type: "node";
}

/**
 * 内容语义化文档
 * 将 RrContentDocument 转换为结构化的文本描述
 */
export interface SemanticContentDocument extends SemanticDocument<RrContentMetadata> {
  type: "content";
}

/**
 * 语义化文档联合类型
 */
export type SemanticDocumentUnion =
  | SemanticRootDocument
  | SemanticNodeDocument
  | SemanticContentDocument;
