import {
  Action,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';

import { Telegraf } from 'telegraf';
import { Context } from './context.interface';
import { actionButtons } from './telegraf.button';
import { showList } from './utils';

const todos = [
  /*{
    id: 1,
    name: 'Sandra',
    isComplete: true,
    link: 'https://onlypu.com/',
  },
  {
    id: 2,
    name: 'Banessa',
    isComplete: false,
    link: 'https://onlypu.com/',
  },*/
  {
    id: 3,
    name: 'Jovencitas buscando sexo...!!',
    isComplete: true,
    link: 'https://onlypu.com/bolivia',
  },
];
@Update()
export class TelegrafUpdate {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply(
      'Hola aqui encontraras pareja para hacer el delicioso 🤤😋',
    );
    await ctx.reply('Ver chicas 👉🏻', actionButtons());
  }

  @Hears(['bo'])
  async bo(ctx: Context) {
    await ctx.reply('Bolivia');
  }

  // @Hears(['La Paz'])
  // async optionLaPaz(: Conctxtext) {
  //   const data = {
  //     Country: '62f64915c8b3b7529a9d9f93',
  //     StateCity: '6339ba3b563066871f0ce252',
  //   };
  //   const res = await this.print(data);
  //   await ctx.reply(res.info);
  //   if (res.photo) {
  //     await ctx.replyWithPhoto(res.photo);
  //   }
  //   //await ctx.replyWithContact('hola', 'https://onlypu.com/bolivia/');
  //   //ctx.session.type = 'done';
  // }

  @Hears(['El Alto'])
  async optionElAlto(ctx: Context) {
    const data = {
      Country: '62f64915c8b3b7529a9d9f93',
      StateCity: '6339b98e609b2a85006ba811',
    };
    const res = await this.print(data);
    await ctx.reply(res.info);
    if (res.photo) {
      await ctx.replyWithPhoto(res.photo);
    }
  }

  @Hears(['Cochabamba'])
  async optionCochabamba(ctx: Context) {
    const data = {
      Country: '62f64915c8b3b7529a9d9f93',
      StateCity: '6339c666563066871f0ce27f',
    };
    const res = await this.print(data);
    await ctx.reply(res.info);
    if (res.photo) {
      await ctx.replyWithPhoto(res.photo);
    }
  }

  @Hears(['Santa Cruz'])
  async optionSantaCruz(ctx: Context) {
    const data = {
      Country: '62f64915c8b3b7529a9d9f93',
      StateCity: '6339c632563066871f0ce273',
    };
    const res = await this.print(data);
    await ctx.reply(res.info);
    if (res.photo) {
      await ctx.replyWithPhoto(res.photo);
    }
  }

  @Hears(['Sucre'])
  async optionSucre(ctx: Context) {
    const data = {
      Country: '62f64915c8b3b7529a9d9f93',
      StateCity: '6339c5e5563066871f0ce263',
    };
    const res = await this.print(data);
    await ctx.reply(res.info);
    if (res.photo) {
      await ctx.replyWithPhoto(res.photo);
    }
  }

  @Hears(['Oruro'])
  async optionOruro(ctx: Context) {
    const data = {
      Country: '62f64915c8b3b7529a9d9f93',
      StateCity: '6339ba56563066871f0ce257',
    };
    const res = await this.print(data);
    await ctx.reply(res.info);
    if (res.photo) {
      await ctx.replyWithPhoto(res.photo);
    }
  }

  @Hears('Potosi')
  async optionPotosi(ctx: Context) {
    const data = {
      Country: '62f64915c8b3b7529a9d9f93',
      StateCity: '6339ba69563066871f0ce25b',
    };
    const res = await this.print(data);
    await ctx.reply(res.info);
    if (res.photo) {
      await ctx.replyWithPhoto(res.photo);
    }
  }

  @Hears(['Tarija'])
  async optionTarija(ctx: Context) {
    const data = {
      Country: '62f64915c8b3b7529a9d9f93',
      StateCity: '6339c5ba563066871f0ce25f',
    };
    const res = await this.print(data);
    await ctx.reply(res.info);
    if (res.photo) {
      await ctx.replyWithPhoto(res.photo);
    }
  }

  @Hears(['Nuevitas 18+ La Paz'])
  async optionNewLaPaz(ctx: Context) {
    const data = {
      Country: '62f64915c8b3b7529a9d9f93',
      StateCity: '6339ba3b563066871f0ce252',
      search: 'nuev',
    };

    await ctx.reply(await this.printSearch(data));
    await ctx.replyWithPhoto(
      'https://poviyabucket.s3.amazonaws.com/onlypu/z/z66hsqC5z7ayhVu.20',
    );
    //ctx.session.type = 'done';
  }

  @Hears(['Nuevitas 18+ El Alto'])
  async optionNewElAlto(ctx: Context) {
    const data = {
      Country: '62f64915c8b3b7529a9d9f93',
      StateCity: '6339b98e609b2a85006ba811',
      search: 'nuev',
    };

    await ctx.reply(await this.printSearch(data));

    //ctx.session.type = 'done';
  }

  /*
  @Action(['List'])
  async getAll() {
    return 'list all';
  }

  @Hears('Done')
  async hears(ctx: Context) {
    await ctx.reply('Hola soy done');
    //ctx.session.type = 'done';
  }

  @Hears('List')
  async listTask(ctx: Context) {
    await ctx.reply(
      `Aqui la lista: \n\n${todos
        .map(
          (todo) =>
            (todo.isComplete ? 'yes' : 'no') +
            ' ' +
            todo.name +
            '\n' +
            todo.link +
            '\n\n',
        )
        .join('')}`,
    );
  }
  */
  @On('sticker')
  async onSticker(ctx: Context) {
    await ctx.reply('👉🏻🫶🏻');
  }

  /*
  @On('text')
  async getMessage(@Message('text') message: string, ctx: Context) {
    if (!ctx.session.type) return;
    if (ctx.session.type === 'done') {
      const todo = todos.find((t) => t.id === Number(message));
      if (!todo) {
        ctx.editMessageText('hola aqui editando');
      }
      showList(todos);
    }
  }*/

  async print(data: any) {
    // let image;
    // const object = await this.postAdService.latestPost(data);
    // if (object) {
    //   if (object.PostMedia.length > 0) {
    //     image = object.PostMedia[0].url;
    //   }
    //   /*return {
    //     info: `${object.title} \n
    //     Edad: ${object.age} \n
    //     ${object.description} \n
    //     WhatsApp: ${object.phonePrefix} ${object.phone} \n
    //     Telefono: ${object.phone} \n
    //     Telegram: ${object.telegram} \n
    //     https://onlypu.com/pu/${object.slug}`,
    //     photo: image,
    //   };*/
    //   return {
    //     info: `${object.title} \n
    //     Edad: ${object.age} \n
    //     ${object.description} \n
    //     Contacto 👇: \n
    //     https://cafecito.com/post/${object.slug}`,
    //     photo: image,
    //   };
    // } else {
    //   return {
    //     info: 'no hay \n 😕',
    //   };
    // }
    return null;
  }

  async printSearch(data: any) {
    // const object = await this.postAdService.searchPost(data);
    // if (object) {
    //   return `${object.title} \n
    //   Edad: ${object.age} \n
    //   ${object.description} \n
    //   WhatsApp: ${object.phonePrefix} ${object.phone} \n
    //   Telefono: ${object.phone} \n
    //   Telegram: ${object.telegram} \n
    //   https://onlypu.com/pu/${object.slug}`;
    // } else {
    //   return '😕';
    // }
    return null;
  }
}
