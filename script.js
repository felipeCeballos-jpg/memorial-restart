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

// Set the loader element
const loader = document.querySelector('.loader');

// Set Language
document.getElementById('language-selector').dataset.language = 'russian';

console.time('Loading time');
window.addEventListener('load', () => {
  console.timeEnd('Loading time');
  loader.style.display = 'none';
});

window.addEventListener('DOMContentLoaded', () => {
  changeLanguage('russian', mqlMobile.matches, mqlTablet.matches);
  scrollAction();
});

/* ChangeLanguage */
const localizedContent = {
  russian: {
    mobile: { images: ruLangMob, texts: [ruText[11], ruText[12]] },
    tablet: { images: ruLangTab, texts: ruText },
    default: { images: ruLang, texts: ruText },
  },
  english: {
    mobile: { images: enLangMob, texts: [enText[11], enText[12]] },
    tablet: { images: enLangTab, texts: enText },
    default: { images: enLang, texts: enText },
  },
};

function changeLanguage(language, isMobile = false, isTablet = false) {
  const imageElements = document.querySelectorAll('.changeable-img');
  const textElements = document.querySelectorAll('.changeable-txt');
  let imagesLoaded = 0;
  const totalImages = imageElements.length;

  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'default';
  const currentResource = localizedContent[language][deviceType];

  // Update Text
  textElements.forEach((text, index) => {
    const retirementTitleIndex = 11;
    const retirementTextIndex = 12;

    if (currentResource.texts.length === 2) {
      if (index === retirementTitleIndex) {
        text.style.display = 'block';
        text.innerHTML = currentResource.texts[0];
      } else if (index === retirementTextIndex) {
        text.style.display = 'block';
        text.innerHTML = currentResource.texts[1];
      } else {
        text.style.display = 'none';
      }
    } else {
      text.style.display = 'block';
      text.innerHTML = currentResource.texts[index];
    }
  });

  // Update Images
  imageElements.forEach((image, index) => {
    image.src = currentResource.images[index];
    image.onload = () => imagesLoaded++;
    image.onerror = () => {
      imagesLoaded++;
      console.log('Error loading image: ', image.src);
    };
  });

  return {
    imagesLoaded: () => imagesLoaded === totalImages,
  };
}

const switchLanguageButton = document.getElementById('language-selector');

switchLanguageButton.addEventListener('click', () => {
  const currentLanguage =
    switchLanguageButton.dataset.language === 'russian' ? 'english' : 'russian';
  loader.style.display = 'flex';

  const currentAssets = changeLanguage(
    currentLanguage,
    mqlMobile.matches,
    mqlTablet.matches
  );

  checkImagesLoaded(currentAssets.imagesLoaded, loader);
  console.log('Cuantas veces me activo');
  switchLanguageButton.dataset.language = currentLanguage;
});

mqlMobile.addEventListener('change', (event) => {
  if (!event.matches) return; // Prevent to call the function each time this event is active;
  loader.style.display = 'flex'; // Active Loader

  const currentAssets = changeLanguage(
    switchLanguageButton.dataset.language,
    event.matches
  );

  checkImagesLoaded(currentAssets.imagesLoaded, loader);
  console.log('Cuantas veces me activo');
});

mqlTablet.addEventListener('change', (event) => {
  if (!event.matches) return; // Prevent to call the function each time this event is active;
  loader.style.display = 'flex';

  const currentAssets = changeLanguage(
    switchLanguageButton.dataset.language,
    false,
    event.matches
  );

  checkImagesLoaded(currentAssets.imagesLoaded, loader);
});

mqlDesktop.addEventListener('change', (event) => {
  if (!event.matches) return; // Prevent to call the function each time this event is active;
  loader.style.display = 'flex';

  const currentAssets = changeLanguage(switchLanguageButton.dataset.language);

  checkImagesLoaded(currentAssets.imagesLoaded, loader);
});

function checkImagesLoaded(callback, loaderElement) {
  const checkLoadStatus = setInterval(() => {
    if (callback()) {
      loaderElement.style.display = 'none';
      clearInterval(checkLoadStatus);
    }
  }, 100);
}

/*
  Carousel
*/

const items = document.querySelectorAll('.carousel-item');
const [carouselLeftBtn, carouselRightBtn] =
  document.querySelectorAll('.carousel-control');
let activeIndex = 0; // Start with the first item active

// carousel functionality
carouselLeftBtn.addEventListener('click', () => {
  items[activeIndex].classList.remove('carousel-active');
  activeIndex = (activeIndex + 1) % items.length;
  items[activeIndex].classList.add('carousel-active');
});

carouselRightBtn.addEventListener('click', () => {
  items[activeIndex].classList.remove('carousel-active');
  activeIndex = (activeIndex - 1 + items.length) % items.length;
  items[activeIndex].classList.add('carousel-active');
});

/*
  Dashes functionality

  - add background image
  - remove background image

*/

// Carousel Left Button
carouselLeftBtn.addEventListener('pointerdown', () => {
  addBackgroundImage(carouselLeftBtn);
});
carouselLeftBtn.addEventListener('pointerup', () => {
  setTimeout(() => {
    removeBackgroundImage(carouselLeftBtn);
  }, 500);
});

// Carousel Right Button
carouselRightBtn.addEventListener('pointerdown', () => {
  addBackgroundImage(carouselRightBtn);
});
carouselRightBtn.addEventListener('pointerup', () => {
  setTimeout(() => {
    removeBackgroundImage(carouselRightBtn);
  }, 500);
});

function addBackgroundImage(item) {
  item.style.backgroundImage = `url("./assets/arrow choose@2x.webp")`;
  item.style.backgroundSize = '100%';
  item.style.backgroundRepeat = 'no-repeat';
  item.style.backgroundPosition = 'center';
}

function removeBackgroundImage(item) {
  item.style.backgroundImage = `none`;
}

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
