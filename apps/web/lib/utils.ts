import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RrNode } from "./types/models";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 在 RrNode 树中查找节点（深度优先搜索）
 * @param root 根节点
 * @param predicate 查找条件函数，返回 true 表示找到目标节点
 * @returns 找到的节点，未找到返回 undefined
 */
export function findRrNode(
  root: RrNode,
  predicate: (node: RrNode) => boolean,
): RrNode | undefined {
  // 检查当前节点是否满足条件
  if (predicate(root)) {
    return root;
  }

  // 递归检查所有子节点
  for (const child of root.children) {
    const found = findRrNode(child, predicate);
    if (found) {
      return found;
    }
  }

  return undefined;
}
