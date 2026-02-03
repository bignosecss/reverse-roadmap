import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

@Injectable()
export class LoaderService {
  async rawTextLoader(nativeRawTextDocument: string): Promise<string[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1800,
      chunkOverlap: 200,
      separators: ['\n\n'],
    });
    const textChunks = await splitter.splitText(nativeRawTextDocument);

    return textChunks.map((chunk) => this.cleanString(chunk));
  }

  private cleanString(text: string) {
    text = text.replace(/\\/g, '');
    text = text.replace(/#/g, ' ');
    text = text.replace(/\. \./g, '.');
    text = text.replace(/\s\s+/g, ' ');
    text = text.replace(/(\r\n|\n|\r)/gm, ' ');

    return text.trim();
  }
}
