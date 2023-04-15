import { Telegraf, session } from 'telegraf';
import { IConfigService } from './config/config.interface';
import { ConfigService } from './config/config.service';
import { IBotContext, ISessionData } from './context/context.interface';
import { Command } from './commands/command.class';
import { StartCommand } from './commands/start.command';
import { ApiService } from './api/api.service';

class Bot {
  bot: Telegraf<IBotContext>;
  commands: Command[] = [];

  apiService: ApiService;

  constructor(private readonly configService: IConfigService) {
    this.apiService = new ApiService(configService);

    this.bot = new Telegraf<IBotContext>(this.configService.get('TELEGRAM_TOKEN'));
    this.bot.use(session({
      defaultSession: (): ISessionData => ({
        sourceLanguage: 'en',
        targetLanguage: 'ru',
      })
    }));
  }



  init() {
    this.commands = [new StartCommand(this.bot, this.apiService)];

    for (const command of this.commands) {
      command.handle();
    }

    this.bot.launch();
  }
}

const bot = new Bot(new ConfigService());

bot.init();