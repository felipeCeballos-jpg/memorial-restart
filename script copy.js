import {
  changeLanguage,
  ruLang,
  enLang,
  enText,
  ruText,
  ruLangMob,
  ruLangTab,
  enLangTab,
  enLangMob,
} from './index.js';

console.time('Loading time');
window.addEventListener('load', () => {
  console.timeEnd('Loading time');
  document.querySelector('.loader').style.display = 'none';
});

function adjustImageSizes(language) {
  const imageElements = document.querySelectorAll('.changeable-img');
  const textElements = document.querySelectorAll('.changeable-txt');

  if (language === 'russian') {
    if (mqlMobile.matches) {
      imageElements.forEach((image, index) => {
        image.src = ruLangMob[index];
      });

      textElements.forEach((text) => {
        text.style.display = 'none';
      });
    } else if (mqlTablet.matches) {
      imageElements.forEach((image, index) => {
        image.src = ruLangTab[index];
      });

      textElements.forEach((text, index) => {
        text.style.display = 'block';
        text.innerHTML = ruText[index];
      });
    } else {
      imageElements.forEach((image, index) => {
        image.src = ruLang[index];
      });

      textElements.forEach((text, index) => {
        text.style.display = 'block';
        text.innerHTML = ruText[index];
      });
    }
  } else {
    if (mqlMobile.matches) {
      imageElements.forEach((image, index) => {
        image.src = enLangMob[index];
      });

      textElements.forEach((text) => {
        text.style.display = 'none';
      });
    } else if (mqlTablet.matches) {
      imageElements.forEach((image, index) => {
        image.src = enLangTab[index];
      });

      textElements.forEach((text, index) => {
        text.style.display = 'block';
        text.innerHTML = enText[index];
      });
    } else {
      imageElements.forEach((image, index) => {
        image.src = enLang[index];
      });

      textElements.forEach((text, index) => {
        text.style.display = 'block';
        text.innerHTML = enText[index];
      });
    }
  }
}

// Definir los media queries
const mqlMobile = window.matchMedia('(max-width: 800px)');
const mqlTablet = window.matchMedia(
  '(min-width: 801px) and (max-width: 1365px)'
);
const mqlDesktop = window.matchMedia('(min-width: 1366px)');

// Set Languaje
document.getElementById('language-selector').dataset.language =
  'russian';

adjustImageSizes('russian');

const switchLanguageButton = document.getElementById(
  'language-selector'
);

switchLanguageButton.addEventListener('click', () => {
  const currentLanguage =
    switchLanguageButton.dataset.language === 'russian'
      ? 'english'
      : 'russian';
  //changeLanguage(currentLanguage);
  adjustImageSizes(currentLanguage);

  switchLanguageButton.dataset.language = currentLanguage;
});

/* window.addEventListener('DOMContentLoaded', () => {
  console.log('Cuantas veces esto cambia');
  const currentLanguage = switchLanguageButton.dataset.language;
  changeLanguage(currentLanguage);
}); */

// Añadir event listeners a los media queries
mqlMobile.addEventListener(
  'change',
  adjustImageSizes(switchLanguageButton.dataset.language)
);
mqlTablet.addEventListener(
  'change',
  adjustImageSizes(switchLanguageButton.dataset.language)
);
mqlDesktop.addEventListener(
  'change',
  adjustImageSizes(switchLanguageButton.dataset.language)
);

/* window.addEventListener('resize', () => {
  const currentLanguage = switchLanguageButton.dataset.language;
  changeLanguage(currentLanguage);
}); */

/* function scrollAction() {
  document.querySelectorAll('.scroll-action').forEach((item) => {
    addObserver(item, 'right');
  }); 

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
} */
