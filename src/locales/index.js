import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import ru from './ru.json';
export const messages = {
  en, 
  es,
  fr,
  ru
};
export const availableLocales = Object.keys(messages);
export default {
  en,
  es,
  fr,
  ru,
  messages
};