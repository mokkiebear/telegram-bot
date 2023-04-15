import { config, DotenvParseOutput } from "dotenv";
import { IConfigService } from "./config.interface";

export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;
  
  constructor() {
    const { error, parsed } = config();

    console.log('CONFIG', error, parsed);

    if (error) {
      throw new Error('.env is not found!');
    }

    if (!parsed) {
      throw new Error('.env is empty!');
    }

    this.config = parsed;
  }
  
  get(key: string): string {
    const result = this.config[key];

    if (!result) {
      throw new Error(`Key '${key}' is not exist in .env`);
    }
    return result;
  }
}