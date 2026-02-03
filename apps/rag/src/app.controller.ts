import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type { SemanticDocumentUnion } from '@repo/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('add-native-documents')
  async addText(
    @Body('docs') semanticNativeDocuments: SemanticDocumentUnion[],
  ) {
    return await this.appService.addSemanticDocuments(semanticNativeDocuments);
  }

  @Post('query')
  async getTexts(@Body('query') query: string) {
    return await this.appService.getText(query);
  }
}
