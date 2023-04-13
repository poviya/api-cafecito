import { Telegraf } from 'telegraf';

const bot = new Telegraf('5570627049:AAGqXEv_rGHLAG86SoCYohRBybVk2vLlnlg');
/*
bot.command('quit', async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

bot.on('text', async (ctx) => {
  // Explicit usage
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hello ${ctx.state.role}`,
  );

  // Using context shortcut
  await ctx.reply(`Hello ${ctx.state.role}`);
});

bot.on('callback_query', async (ctx) => {
  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

  // Using context shortcut
  await ctx.answerCbQuery();
});

bot.on('inline_query', async (ctx) => {
  const result = [];
  // Explicit usage
  await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

  // Using context shortcut
  await ctx.answerInlineQuery(result);
});

bot.launch();
*/
export const sendMessage = () => {
  bot.telegram.sendMessage(
    '-1611792260',
    'File content at: ' + new Date() + ' is: \n',
  );
};
