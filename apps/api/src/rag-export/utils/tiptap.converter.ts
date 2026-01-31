import { ConversionResult } from '../types';
interface TipTapNode {
  type: string;
  content?: TipTapNode[];
  attrs?: Record<string, unknown>;
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

interface TipTapDocument {
  type: 'doc';
  content: TipTapNode[];
}

export class TipTapConverter {
  toMarkdown(tiptapContent: TipTapNode[]): string {
    if (!tiptapContent || !Array.isArray(tiptapContent)) {
      return '';
    }

    const markdownLines: string[] = [];

    for (const node of tiptapContent) {
      const markdown = this.convertNode(node);
      if (markdown) {
        markdownLines.push(markdown);
      }
    }

    return markdownLines.join('\n\n').trim();
  }

  convertNode(node: TipTapNode): string {
    // Ignore complex nodes that would pollute the vector database
    const ignoredTypes = [
      'image',
      'codeBlock',
      'mermaid',
      'mathBlock',
      'inlineMath',
    ];
    if (ignoredTypes.includes(node.type)) {
      return '';
    }

    switch (node.type) {
      case 'paragraph':
        return this.convertParagraph(node);
      case 'heading':
        return this.convertHeading(node);
      case 'bulletList':
      case 'orderedList':
        return this.convertList(node);
      case 'listItem':
        return this.convertListItem(node);
      case 'blockquote':
        return this.convertBlockquote(node);
      case 'horizontalRule':
        return '---';
      case 'table':
        return this.convertTable(node);
      case 'text':
        return this.convertText(node);
      case 'hardBreak':
        return '\n';
      default:
        return '';
    }
  }

  private convertParagraph(node: TipTapNode): string {
    if (!node.content) return '';
    return node.content.map((child) => this.convertNode(child)).join('');
  }

  private convertHeading(node: TipTapNode): string {
    const level = typeof node.attrs?.level === 'number' ? node.attrs.level : 1;
    const prefix = '#'.repeat(level);
    const content =
      node.content?.map((child) => this.convertNode(child)).join('') || '';
    return `${prefix} ${content}`;
  }

  private convertList(node: TipTapNode): string {
    if (!node.content) return '';
    return node.content.map((child) => this.convertNode(child)).join('\n');
  }

  private convertListItem(node: TipTapNode): string {
    const content =
      node.content?.map((child) => this.convertNode(child)).join('') || '';
    const prefix = node.type === 'orderedList' ? '1. ' : '- ';
    return `${prefix}${content}`;
  }

  private convertBlockquote(node: TipTapNode): string {
    const content =
      node.content?.map((child) => this.convertNode(child)).join('') || '';
    return `> ${content}`;
  }

  private convertTable(node: TipTapNode): string {
    if (!node.content) return '';

    // 解析表格所有行
    const tableRows =
      node.content.filter((item) => item.type === 'tableRow') || [];
    const tableContent = tableRows
      .map((row) => {
        // 解析每行的单元格
        const cells =
          row.content?.filter((item) => item.type === 'tableCell') || [];
        const cellText = cells
          .map((cell) =>
            (
              cell.content?.map((c) => this.convertNode(c)).join('') || ''
            ).trim(),
          )
          .filter(Boolean);
        return cellText.length ? cellText.join('，') : '';
      })
      .filter(Boolean);

    // 表格转语义文本：每行内容用分号分隔，加前缀标识，保留核心信息
    return `表格内容：${tableContent.join('；')}`;
  }

  private convertText(node: TipTapNode): string {
    let text = node.text || '';

    if (node.marks) {
      for (const mark of node.marks) {
        text = this.applyMark(text, mark);
      }
    }

    return text;
  }

  private applyMark(
    text: string,
    mark: { type: string; attrs?: Record<string, unknown> },
  ): string {
    switch (mark.type) {
      case 'bold':
        return `**${text}**`;
      case 'italic':
        return `*${text}*`;
      case 'strike':
        return `~~${text}~~`;
      case 'code':
        return `\`${text}\``;
      case 'link':
        return `[${text}](${typeof mark.attrs?.href === 'string' ? mark.attrs.href : ''})`;
      default:
        return text;
    }
  }

  convertFull(tiptapDocument: TipTapDocument): ConversionResult {
    const markdown = this.toMarkdown(tiptapDocument.content);
    const contentLength = markdown.length;
    return {
      markdown,
      contentLength,
    };
  }
}
