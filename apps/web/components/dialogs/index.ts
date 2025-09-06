/**
 * Dialog组件统一导出
 *
 * 这个架构遵循了"一个组件只做一件事"的原则：
 * - BaseDialog: 只负责UI展示和基本交互
 * - CreateRootDialog: 专门处理创建根节点
 * - NodeDialog: 专门处理节点的增删改
 * - ConfirmDialog: 处理简单的确认操作
 */

export { BaseDialog } from "../ui/base-dialog";
export { CreateRootDialog } from "./create-root-dialog";
export { NodeDialog, type NodeOperation } from "./node-dialog";
export { ConfirmDialog } from "./confirm-dialog";
