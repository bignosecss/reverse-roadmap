import { Injectable } from '@nestjs/common';
import { LoaderService } from './loaders/loader.service';
import { SemanticDocumentUnion } from '@repo/shared';

@Injectable()
export class AppService {
  constructor(private readonly loader: LoaderService) {}

  addSemanticDocuments(docs: SemanticDocumentUnion[]) {
    console.log('Received docs: ', docs);
  }

  async getText(query: string) {
    console.log('Received query: ', query);
  }
}
