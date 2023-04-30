import { Body, Controller, Get, Post } from '@nestjs/common';
import { TelegramBotService } from './telegramBot.service';

@Controller('telegramBot')
export class TelegramBotController {
  constructor(private readonly telegramBotService: TelegramBotService) {}

  @Get('dos')
  async sendMessage2() {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const message = 'Hola, soy un mensaje enviado desde NestJS';
    await this.telegramBotService.sendMessage(chatId, message);
    return 'Mensaje enviado';
  }

  @Get()
  async sendMessage() {
    const chatId = 123456789; // Aquí se debe reemplazar con el chatId del destinatario
    const message =
      'Hola, este es un mensaje enviado desde mi aplicación de NestJS';
    await this.telegramBotService.send();
  }
}
