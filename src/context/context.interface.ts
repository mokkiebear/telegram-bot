import { Context } from "telegraf";
import { TLanguage } from "../types";

export interface ISessionData {
  sourceLanguage: TLanguage;
  targetLanguage: TLanguage;
}

export interface IBotContext extends Context {
  session: ISessionData;
}