import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HumanMessage, SystemMessage } from 'langchain';
import { ChatDeepSeek } from '@langchain/deepseek';
import { BasicMessageDto } from './dto/basic-message.dto';
import { deepseekAI } from 'src/utils/constants/deepseek.constants';
import { TEMPLATES } from 'src/utils/constants/templates.constants';
import customMessage from 'src/utils/responses/customMessage.response';
import { MESSAGES } from 'src/utils/constants/messages.constants';

@Injectable()
export class LangchainChatService {
  async chat(basicMessageDto: BasicMessageDto) {
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

      return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, response);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      throw new HttpException(
        customMessage(
          HttpStatus.INTERNAL_SERVER_ERROR,
          MESSAGES.EXTERNAL_SERVER_ERROR,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
