import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AIMessage, HumanMessage, SystemMessage, Document } from 'langchain';
import { ChatDeepSeek } from '@langchain/deepseek';
import { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import { BasicMessageDto } from './dto/basic-message.dto';
import { deepseekAI } from 'src/utils/constants/deepseek.constants';
import { TEMPLATES } from 'src/utils/constants/templates.constants';
import customMessage from 'src/utils/responses/customMessage.response';
import { MESSAGES } from 'src/utils/constants/messages.constants';
import { ContextAwareMessagesDto } from './dto/context-aware-messages.dto';
import path from 'path';
import { existsSync } from 'fs';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { VectorStoreService } from 'src/services/vector-store.service';

@Injectable()
export class LangchainChatService {
  private readonly logger = new Logger(LangchainChatService.name);
  constructor(private readonly vectorStoreService: VectorStoreService) {}

  async basicChat(basicMessageDto: BasicMessageDto) {
    try {
      const model = new ChatDeepSeek({
        temperature: +deepseekAI.BASIC_CHAT_DEEPSEEK_TEMPERATURE,
        model: deepseekAI.DEEPSEEK_CHAT.toString(),
      });

      const messages = [
        new SystemMessage(TEMPLATES.BASIC_SYSTEM_MESSAGE.toString()),
        new HumanMessage(basicMessageDto.user_query),
      ];

      const response = await model.invoke(messages);

      return this.successResponse(response);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async contextAwareChat(contextAwareMessagesDto: ContextAwareMessagesDto) {
    try {
      const model = new ChatDeepSeek({
        temperature: +deepseekAI.BASIC_CHAT_DEEPSEEK_TEMPERATURE,
        model: deepseekAI.DEEPSEEK_CHAT.toString(),
      });

      const systemMsg = new SystemMessage(
        TEMPLATES.BASIC_SYSTEM_MESSAGE.toString(),
      );
      const messages = [systemMsg, ...contextAwareMessagesDto.messages];

      const response = await model.invoke(messages as BaseLanguageModelInput);

      return this.successResponse(response);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async loadPDF() {
    try {
      const file = './src/pdfs/2312.pdf';
      const resolvePath = path.resolve(file);
      // Check if the file exists
      if (!existsSync(resolvePath)) {
        throw new BadRequestException('File does not exist');
      }

      // Load the PDF using PDFLoader
      const pdfLoader = new PDFLoader(resolvePath);
      const pdf = await pdfLoader.load();

      // Split the PDF into texts using RecursiveCharacterTextSplitter
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 50,
      });
      const texts = await textSplitter.splitDocuments(pdf);
      let embeddings: Document[] = [];

      for (let i = 0; i < texts.length; i++) {
        const page = texts[i];
        const splitTexts = await textSplitter.splitText(page!.pageContent);
        const pageEmbeddings = splitTexts.map((text) => ({
          pageContent: text,
          metadata: {
            pageNumber: i,
          },
        }));
        embeddings = embeddings.concat(pageEmbeddings);
      }
      await this.vectorStoreService.addDocuments(embeddings);

      return await this.vectorStoreService.similaritySearch('naive rag', 3);
    } catch (e: unknown) {
      this.logger.error(e);
      this.exceptionHandling(e);
    }
  }

  private successResponse = (response: AIMessage) =>
    customMessage(HttpStatus.OK, MESSAGES.SUCCESS, response);

  private exceptionHandling = (e: unknown) => {
    Logger.error(e);
    throw new HttpException(
      customMessage(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MESSAGES.EXTERNAL_SERVER_ERROR,
      ),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  };
}
