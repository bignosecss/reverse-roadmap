import { RrNode } from "@repo/shared/models";

/**
 * Convert RrNode to plain text for aroundInfo
 * This generates a text summary of the node including title, description, status, and content references
 */
export function rrNodeToText(node: RrNode): string {
  const lines: string[] = [];

  // Title
  lines.push(`节点标题: ${node.title}`);

  // Description
  if (node.description) {
    lines.push(`描述: ${node.description}`);
  }

  // Status
  if (node.status) {
    lines.push(`状态: ${node.status}`);
  }

  // Content tabs
  if (node.content && node.content.length > 0) {
    lines.push(`所包含标签页 (${node.content.length}):`);
    node.content.forEach((tab) => {
      lines.push(`  - ${tab.tabTitle}`);
    });
  }

  return lines.join("\n");
}
