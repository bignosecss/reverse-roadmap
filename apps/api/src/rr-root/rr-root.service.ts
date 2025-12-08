import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRrRootDto } from './dto/create-rr-root.dto';
import { UpdateRrRootDto } from './dto/update-rr-root.dto';
import { RrNodeService } from 'src/rr-node/rr-node.service';
import { RrRootRepository } from './repositories/rr-root.repository';
import { RrRoot } from './schemas/rr-root.schema';
import { RrNodeStatus } from 'src/rr-node/schemas/rr-node.schema';

@Injectable()
export class RrRootService {
  constructor(
    private readonly rrRootRepository: RrRootRepository,
    private readonly rrNodeService: RrNodeService,
  ) {}

  async create(createRrRootDto: CreateRrRootDto) {
    // 1. Create the associated root node for the tree first.
    // Extract the root status and map it to node status, or default to active
    const { status: rootStatus, ...nodeData } = createRrRootDto;
    const newRootRrNode = await this.rrNodeService.create({
      ...nodeData,
      parent: null,
      status: RrNodeStatus.Active, // Root nodes should start as active
    });

    // 2. Map DTO to a new RrRoot entity.
    const newRrRootEntity: Partial<RrRoot> = {
      title: createRrRootDto.title,
      rootRrNode: newRootRrNode._id,
      status: createRrRootDto.status,
    };

    // 3. Call repository to save the entity.
    const newRrRoot = this.rrRootRepository.create(newRrRootEntity);
    return await this.rrRootRepository.save(newRrRoot);
  }

  findAllPublic() {
    return this.rrRootRepository.findAll({ status: 'active' });
  }

  findAll() {
    return this.rrRootRepository.findAll();
  }

  async findOne(id: string) {
    const root = await this.rrRootRepository.findById(id);
    if (!root) {
      throw new NotFoundException(`RrRoot with ID ${id} not found`);
    }
    return root;
  }

  update(id: string, updateRrRootDto: UpdateRrRootDto) {
    // The DTO can be passed directly to Mongoose's update query.
    return this.rrRootRepository.update(id, updateRrRootDto);
  }

  async remove(id: string) {
    const removedRrRoot = await this.rrRootRepository.remove(id);

    // Also try to remove the associated tree.
    try {
      await this.rrNodeService.remove(removedRrRoot.rootRrNode.toString());
    } catch (error: unknown) {
      // Log a warning if the associated node can't be removed,
      // but don't block the operation.
      console.warn(
        `Failed to remove associated root node
        ${removedRrRoot.rootRrNode.toString()} when removing root ${id}:`,
        error,
      );
    }

    return removedRrRoot;
  }
}
