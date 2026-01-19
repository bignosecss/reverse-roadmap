import type { ConversionResult, ContentType } from '../types';

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

  extractTags(tiptapContent: TipTapNode[]): string[] {
    const tags = new Set<string>();
    const text = this.toMarkdown(tiptapContent).toLowerCase();

    // Extract keywords and phrases
    const keywordPatterns = [
      /\b(gols?|目标|终极目标)\b/g,
      /\b(task|todo|任务|要做|待办)\b/g,
      /\b(note|笔记|记录|备注)\b/g,
      /\b(code|代码|编程|实现)\b/g,
      /\b(bug|错误|问题|修复)\b/g,
      /\b(feature|功能|特性)\b/g,
      /\b(improvement|改进|优化)\b/g,
      /\b(deploy|部署|发布)\b/g,
      /\b(test|测试|单元测试)\b/g,
    ];

    for (const pattern of keywordPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          tags.add(match.toLowerCase());
        }
      }
    }

    // Extract headings as tags
    const headings = this.extractHeadings(tiptapContent);
    for (const heading of headings) {
      tags.add(heading.toLowerCase());
    }

    return Array.from(tags).slice(0, 20); // Limit to 20 tags
  }

  getContentType(tiptapContent: TipTapNode[]): ContentType {
    const text = this.toMarkdown(tiptapContent).toLowerCase();
    const codeBlocks = this.extractCodeBlocks(tiptapContent);

    // Check for code content
    if (codeBlocks.length > 0) {
      const totalLength = text.length;
      const codeLength = codeBlocks.join('').length;
      if (totalLength > 0 && codeLength / totalLength > 0.3) {
        return 'code';
      }
    }

    // Check for goal content
    if (/\b(gols?|目标|终极目标|vision|愿景)\b/.test(text)) {
      return 'goal';
    }

    // Check for task content
    if (/\b(task|todo|任务|要做|待办|deadline|截止)\b/.test(text)) {
      return 'task';
    }

    // Default to note
    return 'note';
  }

  convertNode(node: TipTapNode): string {
    switch (node.type) {
      case 'paragraph':
        return this.convertParagraph(node);
      case 'heading':
        return this.convertHeading(node);
      case 'codeBlock':
        return this.convertCodeBlock(node);
      case 'bulletList':
      case 'orderedList':
        return this.convertList(node);
      case 'listItem':
        return this.convertListItem(node);
      case 'blockquote':
        return this.convertBlockquote(node);
      case 'horizontalRule':
        return '---';
      case 'image':
        return this.convertImage(node);
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

  private convertCodeBlock(node: TipTapNode): string {
    const language =
      typeof node.attrs?.language === 'string' ? node.attrs.language : '';
    const content =
      node.content?.map((child) => this.convertNode(child)).join('') || '';
    return `\`\`\`${language}\n${content}\n\`\`\``;
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

  private convertImage(node: TipTapNode): string {
    const src = typeof node.attrs?.src === 'string' ? node.attrs.src : '';
    const alt = typeof node.attrs?.alt === 'string' ? node.attrs.alt : '';
    return `![${alt}](${src})`;
  }

  private convertTable(node: TipTapNode): string {
    if (!node.content) return '';

    const rows: string[] = [];

    node.content.forEach((rowNode, index) => {
      if (rowNode.type !== 'tableRow' || !rowNode.content) return;

      const cells = rowNode.content
        .map((cellNode) => {
          if (cellNode.type !== 'tableCell' || !cellNode.content) return '';
          return cellNode.content.map((c) => this.convertNode(c)).join('');
        })
        .join(' | ');

      rows.push(`| ${cells} |`);

      if (index === 0) {
        const separatorRow = rowNode.content.map(() => '---').join(' | ');
        rows.push(`| ${separatorRow} |`);
      }
    });

    return rows.join('\n');
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

  private extractHeadings(tiptapContent: TipTapNode[]): string[] {
    const headings: string[] = [];

    for (const node of tiptapContent) {
      if (node.type === 'heading' && node.content) {
        const text = node.content
          .map((child) => this.convertNode(child))
          .join('');
        if (text) {
          headings.push(text);
        }
      }
      if (node.content) {
        headings.push(...this.extractHeadings(node.content));
      }
    }

    return headings;
  }

  private extractCodeBlocks(tiptapContent: TipTapNode[]): string[] {
    const codeBlocks: string[] = [];

    for (const node of tiptapContent) {
      if (node.type === 'codeBlock' && node.content) {
        const code = node.content
          .map((child) => this.convertNode(child))
          .join('');
        if (code) {
          codeBlocks.push(code);
        }
      }
      if (node.content) {
        codeBlocks.push(...this.extractCodeBlocks(node.content));
      }
    }

    return codeBlocks;
  }

  convertFull(tiptapDocument: TipTapDocument): ConversionResult {
    const markdown = this.toMarkdown(tiptapDocument.content);
    const tags = this.extractTags(tiptapDocument.content);
    const contentType = this.getContentType(tiptapDocument.content);
    const contentLength = markdown.length;

    return {
      markdown,
      tags,
      contentType,
      contentLength,
    };
  }
}
