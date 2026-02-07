import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import {
  RrNode as RrNodeModel,
  RrNodeDocument,
} from './schemas/rr-node.schema';
import {
  RrNodeStatus,
  FlowData,
  FlowNode,
  convertToFlow,
  convertToRr,
} from '@repo/shared';
import { RrNodeRepository } from './repositories/rr-node.repository';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';
import { RrContentService } from 'src/rr-content/rr-content.service';
import { CreateRrContentDto } from 'src/rr-content/dto/create-rr-content.dto';
import { UpdateRrContentTabDto } from 'src/rr-content/dto/update-rr-content-tab.dto';
import { UpdateRrContentDto } from 'src/rr-content/dto/update-rr-content.dto';

@Injectable()
export class RrNodeService {
  constructor(
    private readonly rrNodeRepository: RrNodeRepository,
    private readonly rrContentService: RrContentService,
  ) {}

  private readonly defaultRrContent: CreateRrContentDto = {
    tabTitle: 'newTab',
    type: 'doc',
    content: [{ type: 'paragraph' }],
  };

  async create(createRrNodeDto: CreateRrNodeDto) {
    const { parent: parentId, status, ...nodeData } = createRrNodeDto;

    let parentNode: RrNodeDocument | null = null;
    if (parentId) {
      parentNode = await this.rrNodeRepository.findById(parentId);
      if (!parentNode) {
        throw new NotFoundException(`ParentNode with ID ${parentId} not found`);
      }
    }

    // todo: 不允许手动创建根节点
    // 如果是创建 root 的过程中传递的 parent: null 即可接收
    // 如果是前端传递的 parent: null，抛出异常

    const rrNodeEntity: Partial<RrNodeModel> = {
      ...nodeData,
      status: status || RrNodeStatus.Active, // Default to 'active' if no status provided
      parent: parentNode ? parentNode._id : null,
    };

    const newRrNode = this.rrNodeRepository.create(rrNodeEntity);
    const newRrContent = await this.rrContentService.create({
      ...this.defaultRrContent,
      tabTitle: newRrNode.title,
    } as CreateRrContentDto);

    newRrNode.content.push({
      rrContent: newRrContent._id,
      tabTitle: newRrNode.title,
    });

    if (parentNode) {
      newRrNode.parent = parentNode._id;
      parentNode.children.push(newRrNode._id);
      await parentNode.save();
    }

    return await this.rrNodeRepository.save(newRrNode);
  }

  async createRrContentForNode(id: string) {
    const targetRrNode = await this.findNode(id);
    if (!targetRrNode) {
      throw new NotFoundException(
        `Node with ID: ${id} not found when trying to create a rr content for it`,
      );
    }

    const newRrContent = await this.rrContentService.create(
      this.defaultRrContent,
    );

    targetRrNode.content.push({
      rrContent: newRrContent._id,
      tabTitle: newRrContent.tabTitle,
    });

    return { node: await targetRrNode.save(), content: newRrContent };
  }

  findNode(id: string) {
    return this.rrNodeRepository.findById(id);
  }

  async findFlowData(rootRrNodeId: string): Promise<FlowData> {
    const flatNodes = await this.rrNodeRepository.findFlatRrNodes(rootRrNodeId);
    if (!flatNodes || flatNodes.length === 0) {
      throw new NotFoundException(`RootNode with ID ${rootRrNodeId} not found`);
    }

    // Convert flat rr-nodes to flow data
    return convertToFlow(flatNodes);
  }

  update(id: string, updateRrNodeDto: UpdateRrNodeDto) {
    const { ...updateData } = updateRrNodeDto;

    if (updateData && updateData.description === undefined) {
      updateData.description = '';
    }

    return this.rrNodeRepository.update(id, updateData);
  }

  async updateRrContentOrder(
    nodeId: string,
    orderedContent: Array<{ _id: string; rrContent: string; tabTitle: string }>,
  ) {
    const targetRrNode = await this.rrNodeRepository.findById(nodeId);
    if (!targetRrNode) {
      throw new NotFoundException(`Node with ID ${nodeId} not found`);
    }

    // 根据传入的顺序重新排列 content
    // 使用 rrContent 作为 key，因为它是唯一且总是存在的
    const contentMap = new Map(
      targetRrNode.content.map((c) => [c.rrContent.toString(), c]),
    );
    const reorderedContent = orderedContent
      .map((item) => contentMap.get(item.rrContent))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    if (reorderedContent.length !== targetRrNode.content.length) {
      throw new Error(
        'Content count mismatch: some content items may be missing or duplicated',
      );
    }

    targetRrNode.content = reorderedContent;
    return await targetRrNode.save();
  }

  async updateRrContentForNode(
    nodeId: string,
    updateRrContentTabDto: UpdateRrContentTabDto,
  ) {
    const targetRrNode = await this.rrNodeRepository.findById(nodeId);
    if (!targetRrNode) {
      throw new NotFoundException(`Node with ID ${nodeId} not found`);
    }

    const contentIndex = targetRrNode.content.findIndex(
      (c) => c.rrContent.toString() === updateRrContentTabDto.rrContent,
    );
    if (contentIndex === -1) {
      throw new NotFoundException(
        `Content with ID ${updateRrContentTabDto.rrContent} not associated with node ${nodeId}`,
      );
    }

    const updatedContent = await this.rrContentService.update(
      updateRrContentTabDto.rrContent,
      {
        tabTitle: updateRrContentTabDto.tabTitle,
      } as unknown as UpdateRrContentDto,
    );

    targetRrNode.content[contentIndex]!.tabTitle =
      updateRrContentTabDto.tabTitle;

    return { node: await targetRrNode.save(), content: updatedContent };
  }

  async remove(id: string) {
    const nodeToRemove = await this.rrNodeRepository.findById(id);
    if (!nodeToRemove) {
      throw new NotFoundException(`RrNode with ID ${id} not found`);
    }

    // Remove from parent's children array
    if (nodeToRemove.parent) {
      await this.rrNodeRepository.update(nodeToRemove.parent.toString(), {
        $pull: { children: nodeToRemove._id },
      });
    }

    const descendantIds = await this.rrNodeRepository.findDescendantIds(id);
    const allNodeIds = [id, ...descendantIds];

    const nodesToDelete = await this.rrNodeRepository.findByIds(allNodeIds);
    const contentIds = nodesToDelete.flatMap((node) =>
      node.content.map((c) => c.rrContent.toString()),
    );

    if (contentIds.length > 0) {
      await this.rrContentService.removeMany(contentIds);
    }

    await this.rrNodeRepository.removeMany(allNodeIds);

    return nodeToRemove;
  }

  async removeNodeContent(nodeId: string, contentId: string) {
    const contentToRemove = await this.rrContentService.findOne(contentId);
    if (!contentToRemove) {
      throw new NotFoundException(`Content with ID ${contentId} not found.`);
    }

    const updatedNode = await this.rrNodeRepository.update(nodeId, {
      $pull: { content: { rrContent: contentToRemove._id } },
    });

    if (!updatedNode) {
      throw new NotFoundException(
        `Node with ID ${nodeId} not found or content not associated with it.`,
      );
    }

    const removedContent = await this.rrContentService.remove(contentId);

    return {
      node: await this.findNode(nodeId),
      content: removedContent,
    };
  }

  async getAllNodesInTree(rootRrNodeId: string) {
    return await this.rrNodeRepository.findFlatRrNodes(rootRrNodeId);
  }

  async updateConnection(flowNodes: FlowNode[]) {
    // Convert flow nodes to RrNode entities
    const rrNodes = convertToRr(flowNodes);

    // Get all existing nodes from DB to compare with new values
    const nodeIds = rrNodes.map((node) => node._id);
    const existingNodes = await this.rrNodeRepository.findByIds(nodeIds);
    const existingNodeMap = new Map(
      existingNodes.map((node) => [node._id.toString(), node]),
    );

    // Update only the nodes that have connection changes (parent/children)
    const nodesToUpdate = rrNodes.filter((node) => {
      const existingNode = existingNodeMap.get(node._id);
      if (!existingNode) {
        // If node doesn't exist in DB, it shouldn't happen but we'll skip
        return false;
      }

      // Check if parent or children have changed
      const hasParentChanged = existingNode.parent?.toString() !== node.parent;
      const existingChildrenSet = new Set(
        existingNode.children.map((child) => child.toString()),
      );
      const newChildrenSet = new Set(node.children);
      const hasChildrenChanged =
        existingNode.children.length !== node.children.length ||
        ![...existingChildrenSet].every((childId) =>
          newChildrenSet.has(childId),
        ) ||
        ![...newChildrenSet].every((childId) =>
          existingChildrenSet.has(childId),
        );

      return hasParentChanged || hasChildrenChanged;
    });

    // Update the nodes that have connection changes
    const updatePromises = nodesToUpdate.map(async (node) => {
      await this.rrNodeRepository.update(node._id, {
        parent: node.parent,
        children: node.children,
        updatedAt: node.updatedAt,
      });
    });

    await Promise.all(updatePromises);

    return {
      message: `Successfully processed ${rrNodes.length} nodes, updated ${nodesToUpdate.length} nodes with connection changes`,
      totalProcessed: rrNodes.length,
      totalUpdated: nodesToUpdate.length,
    };
  }
}
