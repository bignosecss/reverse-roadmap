import { Document } from 'langchain';

// 所有文件类型的处理策略都实现这个接口，保证接口统一
export interface FileProcessStrategy {
  // 文件解析器
  parse(filePath: string): Promise<Document<Record<string, any>>[]>;

  // 分块（可复用通用逻辑，也可子类自定义）
  chunk(
    texts: Document<Record<string, any>>[],
  ): Promise<Document<Record<string, any>>[]>;
}
