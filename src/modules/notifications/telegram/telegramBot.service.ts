import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { Posts } from 'src/modules/posts/post/entities/post.entity';
import { PaymentOrder } from 'src/modules/transactions/payment-order/entities/payment-order.entity';
import { PostService } from 'src/modules/posts/post/post.service';
import { Course } from 'src/modules/courses/course/entities/course.entity';
import { CourseService } from 'src/modules/courses/course/course.service';

@Injectable()
export class TelegramBotService {
  bot: Telegraf;

  constructor(
    private readonly httpService: HttpService,
    private readonly postService: PostService,
    private readonly courseService: CourseService,
  ) {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

    // const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN); // <-- place your bot token in this string
    // bot.api.setMyCommands([
    //   { command: 'inicio', description: 'Initio' },
    //   { command: 'productos', description: 'Productos' },
    //   { command: 'cursos', description: 'Cursos y Talleres' },
    //   { command: 'nosotros', description: 'Nosotros' },
    // ]);

    // Agregar comandos al menú
    this.bot.telegram.setMyCommands([
      { command: 'inicio', description: 'Inicio' },
      { command: 'productos', description: 'Productos' },
      { command: 'cursos', description: 'Cursos y Talleres' },
      { command: 'nosotros', description: 'Nosotros' },
    ]);

    // // bot.start();
    // // Manejador de comandos
    // this.bot.command('hola', (ctx) => {
    //   ctx.reply('Hola, soy un bot de Celccar en que te puedo ayudar?');
    // });

    // this.bot.command('inicio', (ctx) => {
    //   ctx.reply('Hola, Bienbenido a Celccar');
    // });

    // // // Manejador de mensajes
    // // this.bot.on('message', (ctx) => {
    // //   ctx.reply('Has enviado un mensaje');
    // // });

    // // Inicialización del bot
    // this.bot.launch();
    // console.log('Telegram bot started');
  }

  async start() {
    await this.bot.launch();
    console.log('Telegram bot started');
  }

  async stop() {
    await this.bot.stop();
    console.log('Telegram bot stopped');
  }

  getBot() {
    return this.bot;
  }

  async sendMessage(chatId: string, message: string) {
    try {
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}`;
      const url = `${telegramApiUrl}/sendMessage`;
      const params = {
        chat_id: chatId,
        text: message,
      };
      await this.httpService
        .post(url, params)
        .pipe(map((response) => response.data))
        .toPromise();
    } catch (error) {}
  }

  async newSaleProduct(post: Posts, paymentOrder: PaymentOrder) {
    const resPost = await this.postService.findById(post._id);
    console.log('postMedia', resPost);
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const text = `Gracias por su compra ${paymentOrder.Customer.name} ${paymentOrder.Customer.lastname}`;
    //const filePath = 'https://onlypu.com/assets/logo/logo.png';
    const filePath = `${resPost.PostMedia[0].url}`;
    //const link = `https://celccar.com`;
    const link = `https://celccar.com/product/${post.slug}`;
    this.bot.telegram.sendPhoto(chatId, filePath, {
      caption: text + ' ' + link,
    });
    //this.bot.telegram.sendMessage(chatId, text);
  }

  async newSaleCourse(course: Course, paymentOrder: PaymentOrder) {
    const resPost = await this.courseService.findById(course._id);
    console.log('postMedia', resPost);
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const text = `Gracias por su compra ${paymentOrder.Customer.name} ${paymentOrder.Customer.lastname}`;
    //const filePath = 'https://onlypu.com/assets/logo/logo.png';
    const filePath = `${resPost.PostMedia[0].url}`;
    //const link = `https://celccar.com`;
    const link = `https://celccar.com/course/${course.slug}`;
    this.bot.telegram.sendPhoto(chatId, filePath, {
      caption: text + ' ' + link,
    });
    //this.bot.telegram.sendMessage(chatId, text);
  }
}
