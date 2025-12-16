import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AIMessage, HumanMessage, SystemMessage } from 'langchain';
import { ChatDeepSeek } from '@langchain/deepseek';
import { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import { BasicMessageDto } from './dto/basic-message.dto';
import { deepseekAI } from 'src/utils/constants/deepseek.constants';
import { TEMPLATES } from 'src/utils/constants/templates.constants';
import customMessage from 'src/utils/responses/customMessage.response';
import { MESSAGES } from 'src/utils/constants/messages.constants';
import { ContextAwareMessagesDto } from './dto/context-aware-messages.dto';

@Injectable()
export class LangchainChatService {
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
