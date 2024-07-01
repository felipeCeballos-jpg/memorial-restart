import {
  ruLang,
  enLang,
  enText,
  ruText,
  ruLangMob,
  ruLangTab,
  enLangTab,
  enLangMob,
} from './index.js';

// Set media queries
const mqlMobile = window.matchMedia('(max-width: 800px)');
const mqlTablet = window.matchMedia(
  '(min-width: 801px) and (max-width: 1366px)'
);
const mqlDesktop = window.matchMedia('(min-width: 1367px)');

// Set Language
document.getElementById('language-selector').dataset.language =
  'russian';

console.time('Loading time');
window.addEventListener('load', () => {
  console.timeEnd('Loading time');
  document.querySelector('.loader').style.display = 'none';
});

window.addEventListener('DOMContentLoaded', () => {
  changeLanguage('russian', mqlMobile.matches, mqlTablet.matches);
  scrollAction();
});

function changeLanguage(
  language,
  isMobile = false,
  isTablet = false
) {
  const imageElements = document.querySelectorAll('.changeable-img');
  const textElements = document.querySelectorAll('.changeable-txt');

  const localizedContent = {
    russian: {
      mobile: { images: ruLangMob, texts: [] },
      tablet: { images: ruLangTab, texts: ruText },
      default: { images: ruLang, texts: ruText },
    },
    english: {
      mobile: { images: enLangMob, texts: [] },
      tablet: { images: enLangTab, texts: enText },
      default: { images: enLang, texts: enText },
    },
  };

  const currentResource =
    localizedContent[language][
      isMobile ? 'mobile' : isTablet ? 'tablet' : 'default'
    ];

  const observer = new IntersectionObserver(
    (entries, observe) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          const index = Array.from(imageElements).indexOf(image);
          image.src = currentResource.images[index];
          image.onload = () => {
            image.style.opacity = 1;
          };
          image.onerror = () => {
            console.log('We have an error, ', entry.target);
            image.src = currentResource.images[index];
          };
          observe.unobserve(image);
        }
      });
    },
    { rootMargin: '200px' }
  );

  imageElements.forEach((image) => {
    image.style.opacity = 0;
    observer.observe(image);
  });

  textElements.forEach((text, index) => {
    text.style.display = currentResource.texts.length
      ? 'block'
      : 'none';
    if (currentResource.texts.length) {
      text.innerHTML = currentResource.texts[index];
    }
  });
}

const switchLanguageButton = document.getElementById(
  'language-selector'
);

switchLanguageButton.addEventListener('click', () => {
  const currentLanguage =
    switchLanguageButton.dataset.language === 'russian'
      ? 'english'
      : 'russian';

  changeLanguage(
    currentLanguage,
    mqlMobile.matches,
    mqlTablet.matches
  );

  switchLanguageButton.dataset.language = currentLanguage;
});

mqlMobile.addEventListener('change', (event) => {
  changeLanguage(
    switchLanguageButton.dataset.language,
    event.matches,
    false
  );
});

mqlTablet.addEventListener('change', (event) => {
  changeLanguage(
    switchLanguageButton.dataset.language,
    false,
    event.matches
  );
});

mqlDesktop.addEventListener('change', (event) => {
  changeLanguage(switchLanguageButton.dataset.language);
});

/*
  Animation
*/

function scrollAction() {
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
      rootMargin: '0px',
    }
  );

  observer.observe(item);
}
