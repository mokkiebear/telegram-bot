import { IConfigService } from "../config/config.interface";
import { TLanguage } from "../types";

export class ApiService {
  constructor(private readonly configService: IConfigService) { }

  // TODO: return array of strings.
  async translate(text: string, sourceLanguage: TLanguage, targetLanguage: TLanguage): Promise<string> {
    const response = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${this.configService.get('YANDEX_TRANSLATE')}&lang=${sourceLanguage}-${targetLanguage}&text=${text}`);

    const data = await response.json();

    return data.text[0];
  }

  async definition(text: string): Promise<string> {
    // TODO: add other languages.
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`);

    const data = await response.json();

    const { definitions } = data[0].meanings[0];

    return definitions.reduce((acc: string, definition: any) => {
      acc += definition.definition + '\n';

      return acc;
    }, '');
  }
}