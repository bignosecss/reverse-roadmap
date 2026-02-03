import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

@Injectable()
export class LoaderService {
  async rawTextLoader(text: string) {
    const chunker = new RecursiveCharacterTextSplitter({
      chunkSize: 1800,
      chunkOverlap: 200,
      separators: ['\n\n'],
    });

    const chunks = await chunker.splitText(text);

    return chunks.map((chunk) => this.cleanString(chunk));
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
