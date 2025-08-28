import { createI18n } from "vue-i18n";
import messages from '../locales'; 

const supportedLocales = ['en', 'es', 'fr', 'ru']; 
const browserLanguage = window.navigator.language.substring(0, 2);
var localeFromLocalStorage = localStorage.getItem("locale");
var localeSelected = 'en';
if(localeFromLocalStorage!==null){
  localeSelected=localeFromLocalStorage;
}else if(supportedLocales.includes(browserLanguage)){
  localeSelected=browserLanguage;
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localeSelected,  // Fallback a 'en'
  fallbackLocale: 'en',
  messages,
});