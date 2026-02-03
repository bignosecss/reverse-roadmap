import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('add-text')
  async addText(@Body('text') text: string) {
    console.log('laile', text);
    return await this.appService.addText(text);
  }

  @Post('query')
  async getTexts(@Body('query') query: string) {
    return await this.appService.getText(query);
  }
}
