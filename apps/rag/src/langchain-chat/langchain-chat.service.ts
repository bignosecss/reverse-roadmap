import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChatDeepSeek } from '@langchain/deepseek';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from '@langchain/classic/output_parsers';
import { BasicMessageDto } from './dto/basic-message.dto';
import { deepseekAI } from 'src/utils/constants/deepseek.constants';
import { TEMPLATES } from 'src/utils/constants/templates.constants';
import customMessage from 'src/utils/responses/customMessage.response';
import { MESSAGES } from 'src/utils/constants/messages.constants';

@Injectable()
export class LangchainChatService {
  async chat(basicMessageDto: BasicMessageDto) {
    try {
      const prompt = ChatPromptTemplate.fromTemplate(
        TEMPLATES.BASIC_CHAT_TEMPLATE,
      );

      const model = new ChatDeepSeek({
        temperature: +deepseekAI.BASIC_CHAT_DEEPSEEK_TEMPERATURE,
        model: deepseekAI.DEEPSEEK_CHAT.toString(),
      });

      const outputParser = new HttpResponseOutputParser();
      const chain = prompt.pipe(model).pipe(outputParser);
      const response = await chain.invoke({
        input: basicMessageDto.user_query,
      });
      // just for clarify the type
      Object.values(response).forEach((code) => {
        console.log('type of response value: ', typeof code);
        console.log('content of response value:', code);
      });

      return customMessage(
        HttpStatus.OK,
        MESSAGES.SUCCESS,
        Object.values(response)
          .map((code: number) => String.fromCharCode(code))
          .join(''),
      );
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
