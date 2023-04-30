import { Injectable } from '@nestjs/common';
import { TelegramBotService } from './telegramBot.service';

@Injectable()
export class MyMenuService {
  constructor(private readonly telegramBotService: TelegramBotService) {}

  async setMyCommands() {
    const commands = [
      { command: '/start', description: 'Iniciar' },
      { command: '/help', description: 'Ayuda' },
      { command: '/contact', description: 'Contacto' },
    ];

    const bot = await this.telegramBotService.getBot();

    await bot.telegram.setMyCommands(commands);
  }
}
