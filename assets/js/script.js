import {
  ruLang,
  enLang,
  enText,
  ruText,
  ruLangMob,
  ruLangTab,
  enLangTab,
  enLangMob,
} from './constant.js';
import { initLanguage, getLanguage, setLanguage } from './util.js';

const html = document.querySelector('html');

// Set media queries
const mqlMobile = window.matchMedia('(max-width: 800px)');
const mqlTablet = window.matchMedia(
  '(min-width: 801px) and (max-width: 1366px)'
);
const mqlDesktop = window.matchMedia('(min-width: 1367px)');

// Set the loader element
const loader = document.querySelector('.loader');

// Set Language
initLanguage(html);

// Localized Content
const localizedContent = {
  ru: {
    mobile: { images: ruLangMob, texts: [ruText[11], ruText[12]] },
    tablet: { images: ruLangTab, texts: ruText },
    default: { images: ruLang, texts: ruText },
  },
  en: {
    mobile: { images: enLangMob, texts: [enText[11], enText[12]] },
    tablet: { images: enLangTab, texts: enText },
    default: { images: enLang, texts: enText },
  },
};

console.time('Loading time');
window.addEventListener('load', () => {
  console.timeEnd('Loading time');
  loader.style.display = 'none';
});

window.addEventListener('DOMContentLoaded', () => {
  updateDesign(mqlMobile.matches, mqlTablet.matches);
  sideElementsAnimation();
  booksAnimation();

  // Preload the dashes images
  const img = new Image();
  img.src = './assets/arrow choose@2x.webp';
});

/* UpdateDesign */
function updateDesign(isMobile = false, isTablet = false) {
  const language = getLanguage();
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
  loader.style.display = 'flex';
  setLanguage(html);

  const currentAssets = updateDesign(mqlMobile.matches, mqlTablet.matches);

  sideElementsAnimation();
  booksAnimation();

  checkImagesLoaded(currentAssets.imagesLoaded, loader, true);
});

mqlMobile.addEventListener('change', (event) => {
  if (!event.matches) return; // Prevent to call the function each time this event is active;
  loader.style.display = 'flex'; // Active Loader

  booksAnimation();
  const currentAssets = updateDesign(event.matches);

  checkImagesLoaded(currentAssets.imagesLoaded, loader);
});

mqlTablet.addEventListener('change', (event) => {
  if (!event.matches) return; // Prevent to call the function each time this event is active;
  loader.style.display = 'flex';
  sideElementsAnimation();
  booksAnimation();

  const currentAssets = updateDesign(false, event.matches);

  checkImagesLoaded(currentAssets.imagesLoaded, loader);
});

mqlDesktop.addEventListener('change', (event) => {
  if (!event.matches) return; // Prevent to call the function each time this event is active;
  loader.style.display = 'flex';
  sideElementsAnimation();
  booksAnimation();

  const currentAssets = updateDesign();

  checkImagesLoaded(currentAssets.imagesLoaded, loader);
});

function checkImagesLoaded(callback, loaderElement, delayLoadingPage = false) {
  const maxLoadingTime = 3000; // 3 seconds
  const checkInterval = 100; // Interval time in ms
  const startTime = Date.now();

  const checkLoadStatus = setInterval(() => {
    if (callback()) {
      const elapsedTime = Date.now() - startTime;
      const timeRemaining = maxLoadingTime - elapsedTime;

      if (delayLoadingPage && elapsedTime < maxLoadingTime) {
        setTimeout(() => {
          loaderElement.style.display = 'none';
        }, timeRemaining);
      } else {
        loaderElement.style.display = 'none';
      }

      clearInterval(checkLoadStatus);
    }
  }, checkInterval);
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
carouselLeftBtn.addEventListener('pointerdown', (e) => {
  initBackgroundFn('add', e.target);
});
carouselLeftBtn.addEventListener('pointerup', (e) => {
  initBackgroundFn('remove', e.target);
});

carouselLeftBtn.addEventListener('focus', (e) => {
  e.target.addEventListener('keydown', (key) => {
    if (key.code === 'Enter' || key.code === 'Space') {
      initBackgroundFn('add', e.target);
    }
  });

  e.target.addEventListener('keyup', (key) => {
    if (key.code === 'Enter' || key.code === 'Space') {
      initBackgroundFn('remove', e.target);
    }
  });
});

// Carousel Right Button
carouselRightBtn.addEventListener('pointerdown', (e) => {
  initBackgroundFn('add', e.target);
});
carouselRightBtn.addEventListener('pointerup', (e) => {
  initBackgroundFn('remove', e.target);
});

carouselRightBtn.addEventListener('focus', (e) => {
  e.target.addEventListener('keydown', (key) => {
    if (key.code === 'Enter' || key.code === 'Space') {
      initBackgroundFn('add', e.target);
    }
  });

  e.target.addEventListener('keyup', (key) => {
    if (key.code === 'Enter' || key.code === 'Space') {
      initBackgroundFn('remove', e.target);
    }
  });
});

function initBackgroundFn(action, element) {
  if (action === 'add') {
    addBackgroundImage(element);
  } else if (action === 'remove') {
    setTimeout(() => {
      removeBackgroundImage(element);
    }, 100);
  }
}

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

function sideElementsAnimation() {
  resetAnimation([
    { selector: '.scroll-action', animationClass: 'scroll-active-right' },
    { selector: '.scroll-action-left', animationClass: 'scroll-active-left' },
  ]);

  const elementsToAnimate = [
    { selector: '.scroll-action', side: 'right' },
    { selector: '.scroll-action-left', side: 'left' },
  ];

  elementsToAnimate.forEach(({ selector, side }) => {
    document.querySelectorAll(selector).forEach((item) => {
      initScrollAnimationObserver(item, side);
    });
  });
}

function initScrollAnimationObserver(item, side) {
  const observer = new IntersectionObserver(
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
      threshold: 0, // trigger when 0% of the element is visible
    }
  );

  observer.observe(item);
}

function resetAnimation(elements) {
  if (elements.length === 0) return;

  elements.forEach(({ selector, animationClass }) => {
    if (elements === 1) {
      const element = document.querySelector(selector);
      if (element.classList.contains('menu-active')) {
        element.classList.remove('menu-active');
      }

      return;
    }

    document.querySelectorAll(selector).forEach((element) => {
      if (element.classList.contains(animationClass)) {
        element.classList.remove(animationClass);
      }
    });
  });
}

function booksAnimation() {
  resetAnimation([{ selector: '.menu', animationClass: 'menu-active' }]);

  const footer = document.querySelector('.section-navbook');
  const books = document.querySelector('.menu');
  const booksObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          books.classList.add('menu-active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px',
      threshold: 0.6,
    }
  );

  booksObserver.observe(footer);
}
