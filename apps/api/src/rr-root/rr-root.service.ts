import { Injectable } from '@nestjs/common';
import { CreateRrRootDto } from './dto/create-rr-root.dto';
import { UpdateRrRootDto } from './dto/update-rr-root.dto';
import { RrRootMapper } from './mapper/rr-root.mapper';
import { RrNodeService } from 'src/rr-node/rr-node.service';
import { RrNodeContentService } from 'src/rr-node-content/rr-node-content.service';
import { RrNode } from 'src/schemas/rr-node.schema';

@Injectable()
export class RrRootService {
  constructor(
    private readonly rrRootMapper: RrRootMapper,
    private readonly rrNodeService: RrNodeService,
    private readonly rrNodeContentService: RrNodeContentService,
  ) {}

  async create(createRrRootDto: CreateRrRootDto) {
    const newRoot = await this.rrRootMapper.create(createRrRootDto);

    // 创建根节点
    const newRootNode = await this.rrNodeService.createRootNode({
      title: createRrRootDto.title,
      description: createRrRootDto.description,
    });
    if (!newRootNode) {
      throw new Error(
        'Fail to create node when trying to create the root node after new root is created',
      );
    }

    newRoot.treeRootNodeId = newRootNode._id;

    return await newRoot.save();
  }

  findAll() {
    return this.rrRootMapper.findAll();
  }

  findOne(id: string) {
    return this.rrRootMapper.findOne(id);
  }

  update(id: string, updateRrRootDto: UpdateRrRootDto) {
    return this.rrRootMapper.update(id, updateRrRootDto);
  }

  async remove(id: string) {
    const removedRoot = await this.rrRootMapper.remove(id);
    const removedRootNode = await this.rrNodeService.removeRootNode(
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      removedRoot.treeRootNodeId.toString(),
    );
    if (!removedRootNode) {
      throw new Error('Fail to remove root node when trying to remove a root');
    }

    const removeTiptapContent = async (rootNode: RrNode) => {
      while (rootNode.children.length > 0) {
        if (rootNode.content) {
          await this.rrNodeContentService.remove(rootNode.content.toString());
        }

        for (const child of rootNode.children) {
          await removeTiptapContent(child);
        }
      }
    };

    await removeTiptapContent(removedRootNode);

    return removedRoot;
  }
}
