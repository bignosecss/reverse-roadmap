import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { RrRootsService } from './rr-roots.service';
import { RrRoots } from 'src/schemas/rr-roots.schema';

@Controller('rr-roots')
export class RrRootsController {
  constructor(private readonly rrRootsService: RrRootsService) {}

  @Get()
  async findAll(): Promise<RrRoots[]> {
    try {
      const roots = await this.rrRootsService.findAll();
      return roots;
    } catch (error) {
      throw new HttpException(
        {
          code: 'FETCH_ROOTS_FAILED',
          message: '获取根节点列表失败',
          details: error instanceof Error ? error.message : error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
