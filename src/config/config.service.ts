import { config, DotenvParseOutput, parse } from "dotenv";
import { IConfigService } from "./config.interface";
import { env } from 'process';

export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor() {
    console.log('PROCESS.ENV', process.env);

    const { error, parsed } = config({ debug: true });

    console.log('CONFIG', error, parsed);

    if (error) {
      console.error('.env is not found!');
    }

    if (!parsed) {
      console.error('.env is empty!');
    }

      this.config = parsed || env as DotenvParseOutput;
  }

  get(key: string): string {
    const result = this.config[key];

    if (!result) {
      throw new Error(`Key '${key}' is not exist in .env`);
    }
    return result;
  }
}