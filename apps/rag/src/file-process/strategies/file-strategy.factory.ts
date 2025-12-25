import { Injectable } from '@nestjs/common';
import { FileProcessStrategy } from './file-process-strategy.interface';
import { PDFProcessStrategy } from './implementations/pdf-process.strategy';
import { JSONProcessStrategy } from './implementations/json-process.strategy';

@Injectable()
export class FileStrategyFactory {
  private strategyMap: Map<string, FileProcessStrategy>;

  constructor(
    private pdfStrategy: PDFProcessStrategy,
    private jsonStrategy: JSONProcessStrategy,
  ) {
    this.strategyMap = new Map([
      ['pdf', this.pdfStrategy],
      ['json', this.jsonStrategy],
    ]);
  }

  /**
   * Get the appropriate strategy for the given file type
   * @param fileType The file type (extension or MIME type)
   * @returns The strategy that supports the given file type, or undefined if none found
   */
  getStrategy(fileType: string): FileProcessStrategy | undefined {
    const strategy = this.strategyMap.get(fileType.toLowerCase());
    if (!strategy) {
      throw new Error(`No strategy found for file type: ${fileType}`);
    }
    return strategy;
  }

  /**
   * Get all available strategies
   */
  getAllStrategies(): FileProcessStrategy[] {
    return Array.from(this.strategyMap.values());
  }
}
