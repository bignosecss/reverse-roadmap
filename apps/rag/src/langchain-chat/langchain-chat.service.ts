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
import { DocumentDto } from './dto/document.dto';
import { PDF_BASE_PATH } from 'src/utils/constants/common.constants';

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
      const humanMessages = contextAwareMessagesDto.messages.map(
        (query) => new HumanMessage(query),
      );
      const messages = [systemMsg, ...humanMessages];

      const response = await model.invoke(messages as BaseLanguageModelInput);

      return this.successResponse(response);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async documentChat(basicMessageDto: BasicMessageDto) {
    try {
      // 真烦人这ESLint规则
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const documentContext = await this.vectorStoreService.similaritySearch(
        basicMessageDto.user_query,
        3,
      );

      const model = new ChatDeepSeek({
        temperature: +deepseekAI.BASIC_CHAT_DEEPSEEK_TEMPERATURE,
        model: deepseekAI.DEEPSEEK_CHAT.toString(),
      });

      const messages = [
        new SystemMessage(
          `${TEMPLATES.BASIC_SYSTEM_MESSAGE}${documentContext}`,
        ),
        new HumanMessage(basicMessageDto.user_query),
      ];

      const response = await model.invoke(messages as BaseLanguageModelInput);

      return this.successResponse(response);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async uploadPDF(documentDto: DocumentDto) {
    try {
      // Load the file
      const file = `${PDF_BASE_PATH}/${documentDto.file}`;
      const resolvedPath = path.resolve(file);
      // Check if the file exists
      if (!existsSync(resolvedPath)) {
        throw new BadRequestException('File does not exist.');
      }

      // Load the PDF using PDFLoader
      const pdfLoader = new PDFLoader(resolvedPath);
      const pdf = await pdfLoader.load();

      // Split the PDF into texts using RecursiveCharacterTextSplitter
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 50,
      });
      const texts = await textSplitter.splitDocuments(pdf);
      let embeddings: Document[] = [];

      for (let index = 0; index < texts.length; index++) {
        const page = texts[index];
        const splitTexts = await textSplitter.splitText(page!.pageContent);
        const pageEmbeddings = splitTexts.map((text) => ({
          pageContent: text,
          metadata: {
            pageNumber: index,
          },
        }));
        embeddings = embeddings.concat(pageEmbeddings);
      }
      await this.vectorStoreService.addDocuments(embeddings);
      return customMessage(HttpStatus.OK, MESSAGES.SUCCESS);
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
