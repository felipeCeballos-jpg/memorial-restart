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

// Definir los media queries
const mqlMobile = window.matchMedia('(max-width: 800px)');
const mqlTablet = window.matchMedia(
  '(min-width: 801px) and (max-width: 1366px)'
);
const mqlDesktop = window.matchMedia('(min-width: 1367px)');

// Set Languaje
document.getElementById('language-selector').dataset.language =
  'russian';

console.time('Loading time');
window.addEventListener('load', () => {
  console.timeEnd('Loading time');
  document.querySelector('.loader').style.display = 'none';
});

/*
  Debemos de revisar esta funcion cuidadosamente para a ver si: 
    1. concuerda con los media queries de css. 
    2. Saber si esta funcionando como hemos escrito el codigo.
    3. Estar seguros de todo
*/
function adjustImageSizes(language, isMobile, isTablet) {
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
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          const index = Array.from(imageElements).indexOf(image);
          let attempt = 1;
          image.src = currentResource.images[index];
          image.onload = () => {
            image.style.opacity = 1;
          };
          image.onerror = () => {
            if (attempt <= 3) {
              // Intentar cargar la imagen hasta 3 veces
              image.src =
                currentResource.images[index] + '?attempt=' + attempt; // Añadir parámetro para evitar cache
              attempt++;
            }
          };
          observer.unobserve(image);
        }
      });
    },
    { rootMargin: '50px 0px', threshold: 0.01 }
  );

  imageElements.forEach((image) => {
    image.style.opacity = 0; // Establece la opacidad a 0 para iniciar la transición
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

adjustImageSizes('russian', mqlMobile.matches, mqlTablet.matches);

const switchLanguageButton = document.getElementById(
  'language-selector'
);

switchLanguageButton.addEventListener('click', () => {
  const currentLanguage =
    switchLanguageButton.dataset.language === 'russian'
      ? 'english'
      : 'russian';
  //changeLanguage(currentLanguage);
  adjustImageSizes(
    currentLanguage,
    mqlMobile.matches,
    mqlTablet.matches
  );

  switchLanguageButton.dataset.language = currentLanguage;
});

// Añadir event listeners a los media queries
mqlMobile.addEventListener('change', () => {
  adjustImageSizes(
    switchLanguageButton.dataset.language,
    mqlMobile.matches,
    mqlTablet.matches
  );
});

mqlTablet.addEventListener('change', () => {
  adjustImageSizes(
    switchLanguageButton.dataset.language,
    mqlMobile.matches,
    mqlTablet.matches
  );
});

mqlDesktop.addEventListener('change', () => {
  adjustImageSizes(
    switchLanguageButton.dataset.language,
    mqlMobile.matches,
    mqlTablet.matches
  );
});
