import { changeLanguage } from './index.js';

window.addEventListener('resize', () => {
  const currentLanguage = document.getElementById('language-selector')
    .dataset.language;
  changeLanguage(currentLanguage);
});
