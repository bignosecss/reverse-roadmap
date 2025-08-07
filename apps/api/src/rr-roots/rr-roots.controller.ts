import { Controller, Get } from '@nestjs/common';
import { RrRootsService } from './rr-roots.service';
import { RrRoots } from 'src/schemas/rr-roots.schema';

@Controller('rr-roots')
export class RrRootsController {
  constructor(private readonly rrRootsService: RrRootsService) {}

  @Get()
  async findAll(): Promise<RrRoots[]> {
    return this.rrRootsService.findAll();
  }
}
