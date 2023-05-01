import { Module, forwardRef } from '@nestjs/common';
import { TelegramBotService } from './telegram/telegramBot.service';
import { PostModule } from '../posts/post/post.module';
import { TelegramBotController } from './telegram/telegramBot.controller';
import { HttpModule } from '@nestjs/axios';
import { PostService } from '../posts/post/post.service';
//import { MyMenuService } from './telegram/myMenuService';

@Module({
  imports: [HttpModule, forwardRef(() => PostModule)],
  controllers: [TelegramBotController],
  providers: [TelegramBotService],
  exports: [TelegramBotService],
})
export class NotificationModule {}
