import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { RrRootService } from './rr-root.service';
import { RrRoot } from 'src/schemas/rr-root.schema';

@Controller('rr-root')
export class RrRootController {
  constructor(private readonly rrRootService: RrRootService) {}

  @Get()
  async findAll(): Promise<RrRoot[]> {
    try {
      const roots = await this.rrRootService.findAll();
      return roots;
    } catch (error) {
      throw new HttpException(
        {
          code: 'FETCH_ROOT_FAILED',
          message: '获取根节点列表失败',
          details: error instanceof Error ? error.message : error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
