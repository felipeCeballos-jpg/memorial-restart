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

// Localized Content
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

console.time('Loading time');
window.addEventListener('load', () => {
  console.timeEnd('Loading time');
  loader.style.display = 'none';
});

window.addEventListener('DOMContentLoaded', () => {
  changeLanguage('russian', mqlMobile.matches, mqlTablet.matches);
  sideElementsAnimation();
  booksAnimation();
});

/* ChangeLanguage */
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

  sideElementsAnimation();
  booksAnimation();

  checkImagesLoaded(currentAssets.imagesLoaded, loader, true);
  switchLanguageButton.dataset.language = currentLanguage;
});

mqlMobile.addEventListener('change', (event) => {
  if (!event.matches) return; // Prevent to call the function each time this event is active;
  loader.style.display = 'flex'; // Active Loader

  booksAnimation();
  const currentAssets = changeLanguage(
    switchLanguageButton.dataset.language,
    event.matches
  );

  checkImagesLoaded(currentAssets.imagesLoaded, loader);
});

mqlTablet.addEventListener('change', (event) => {
  if (!event.matches) return; // Prevent to call the function each time this event is active;
  loader.style.display = 'flex';
  sideElementsAnimation();
  booksAnimation();

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
  sideElementsAnimation();
  booksAnimation();

  const currentAssets = changeLanguage(switchLanguageButton.dataset.language);

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

function sideElementsAnimation() {
  resetSEAnimation();

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

function resetSEAnimation() {
  const elementsToReset = [
    { selector: '.scroll-action', animationClass: 'scroll-active-right' },
    { selector: '.scroll-action-left', animationClass: 'scroll-active-left' },
  ];

  elementsToReset.forEach(({ selector, animationClass }) => {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.classList.contains(animationClass)) {
        element.classList.remove(animationClass);
      }
    });
  });
}

function booksAnimation() {
  resetBooksAnimation();

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

function resetBooksAnimation() {
  const page = document.querySelector('.menu');
  if (page.classList.contains('menu-active')) {
    page.classList.remove('menu-active');
  }
}
