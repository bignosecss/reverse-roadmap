import { Module } from '@nestjs/common';
import { RrNodeService } from './rr-node.service';
import { RrNodeController } from './rr-node.controller';
import { ErrorHandlerService } from 'src/common/error-handler/error-handler.service';
import { RrTreeModule } from 'src/rr-tree/rr-tree.module';

@Module({
  imports: [RrTreeModule],
  controllers: [RrNodeController],
  providers: [RrNodeService, ErrorHandlerService],
})
export class RrNodeModule {}
