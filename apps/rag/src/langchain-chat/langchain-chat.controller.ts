import { Body, Controller, Post } from '@nestjs/common';
import { LangchainChatService } from './langchain-chat.service';
import { BasicMessageDto } from './dto/basic-message.dto';
import { ContextAwareMessagesDto } from './dto/context-aware-messages.dto';

@Controller('langchain-chat')
export class LangchainChatController {
  constructor(private readonly langchainChatService: LangchainChatService) {}

  @Post('basic-chat')
  async chat(@Body() messagesDto: BasicMessageDto) {
    return await this.langchainChatService.basicChat(messagesDto);
  }

  @Post('context-aware-chat')
  async contextAwareChat(
    @Body() contextAwareMessagesDto: ContextAwareMessagesDto,
  ) {
    return await this.langchainChatService.contextAwareChat(
      contextAwareMessagesDto,
    );
  }
}
