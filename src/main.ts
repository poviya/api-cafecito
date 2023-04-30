import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { TelegramBotService } from './modules/notifications/telegram/telegramBot.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  //app.select(AppModule), { fallbackOnErrors: true };
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const telegramBotService = app.get(TelegramBotService);
  telegramBotService.getBot();
  const config = new DocumentBuilder()
    .setTitle('Api CAFECITO')
    .setDescription('Procedimientos para usar esta API')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
