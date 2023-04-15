import { ApiService } from "../api/api.service";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { Markup, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

const START_MESSAGE = 'Привет! На данный момент я нахожусь в разработке и мой язык по умолчанию "Русский. В будущем я буду поддерживать большее количество языков.';

export class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, private readonly apiService: ApiService) {
    super(bot);
  }

  handle(): void {
    this.bot.start((context) => {
      console.log(context.session, context);

      context.reply(START_MESSAGE);

      context.reply("Выбери пожалуйста язык, на котором ты будешь присылать мне слова и фразы", Markup.inlineKeyboard([
        Markup.button.callback('English', 'lang_en'),
        Markup.button.callback('Русский', 'lang_ru'),
      ]));

      
    });

    this.bot.on(message('text'), async (context) => {
      const text = context.message.text;

      const translatedText = await this.apiService.translate(text, 'en', 'ru');
      const definition = await this.apiService.definition(text);
      context.reply(translatedText);

      context.reply(`Definitions:\n\n ${definition}`);
    });

    this.bot.action('lang_en', (context) => {
      context.session.sourceLanguage = 'en';

      context.editMessageText("Nice, your language is English");


      context.reply("А сейчас выбери язык, который ты хочешь изучить", Markup.inlineKeyboard([
        Markup.button.callback('English', 'target_lang_en'),
        Markup.button.callback('Русский', 'target_lang_ru'),
      ]));
    });

    this.bot.action('lang_ru', (context) => {
      context.session.sourceLanguage = 'ru';

      context.editMessageText("Отлично, твой язык - Русский");


      context.reply("А сейчас выбери язык, который ты хочешь изучить", Markup.inlineKeyboard([
        Markup.button.callback('English', 'target_lang_en'),
        Markup.button.callback('Русский', 'target_lang_ru'),
      ]));
    });

    this.bot.action('target_lang_en', (context) => {
      context.session.targetLanguage = 'en';

      context.editMessageText("Отлично, будем изучать Английский");
    });

    this.bot.action('target_lang_ru', (context) => {
      context.session.targetLanguage = 'ru';

      context.editMessageText("Nice, we will learn Russian");
    });
  }
}