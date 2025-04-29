import en from '../messages/en.json';
 
export type MessagesTranslations = typeof en;
 
declare global {
  // Use type safe message keys with `next-intl`
  type IntlMessages = MessagesTranslations
}