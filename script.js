import { changeLanguage } from './index.js';

console.time('Loading time');
window.addEventListener('load', () => {
  console.timeEnd('Loading time');
  document.querySelector('.loader').style.display = 'none';
});

document.getElementById('language-selector').dataset.language =
  'russian';

changeLanguage('russian');
scrollAction();

const switchLanguageButton = document.getElementById(
  'language-selector'
);

switchLanguageButton.addEventListener('click', () => {
  const currentLanguage =
    switchLanguageButton.dataset.language === 'russian'
      ? 'english'
      : 'russian';
  changeLanguage(currentLanguage);

  switchLanguageButton.dataset.language = currentLanguage;
});

function scrollAction() {
  /*  document.querySelectorAll('.scroll-action').forEach((item) => {
    addObserver(item, 'right');
  }); */

  document.querySelectorAll('.scroll-action-left').forEach((item) => {
    addObserver(item, 'left');
  });
}

function addObserver(item, side) {
  let observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(`scroll-active-${side}`);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '-100px 0px',
      threshold: 0,
    }
  );
  observer.observe(item);
}
