import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type { SemanticDocumentUnion, RAGQueryRequest } from '@repo/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('add-native-documents')
  async addDocuments(
    @Body('docs') semanticNativeDocuments: SemanticDocumentUnion[],
  ) {
    return await this.appService.addSemanticDocuments(semanticNativeDocuments);
  }

  @Post('query')
  async chat(@Body() request: RAGQueryRequest) {
    return await this.appService.AugmentedReply(request);
  }
}
