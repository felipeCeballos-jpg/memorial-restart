import { INITIAL_LANGUAGE } from './constant.js';

/* Storage language on localStorage */
export function initLanguage(html) {
  const language = localStorage.getItem('language');

  if (!language) {
    localStorage.setItem('language', INITIAL_LANGUAGE);
    html.lang = INITIAL_LANGUAGE;
    return;
  }

  html.lang = language;
}

export function getLanguage() {
  const language = localStorage.getItem('language');
  return language || INITIAL_LANGUAGE;
}

export function setLanguage(html) {
  const currentLang = html.lang === 'ru' ? 'en' : 'ru';

  localStorage.setItem('language', currentLang);
  html.lang = currentLang;
}
