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

/* ChangeLanguage */
let observer;

function createImageObserver(currentResource, deviceType) {
  let newRootMargin =
    deviceType === 'mobile'
      ? '700px'
      : deviceType === 'tablet'
      ? '2000px'
      : '4000px';

  return new IntersectionObserver(
    (entries, obs) =>
      handleImagesIntersection(
        entries,
        obs,
        currentResource,
        deviceType
      ),
    {
      rootMargin: newRootMargin,
    }
  );
}

function handleImagesIntersection(
  entries,
  observer,
  currentResource
) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadImage(entry.target, currentResource);
      observer.unobserve(entry.target);
    }
  });
}

function loadImage(image, currentResource) {
  const index = Array.from(
    document.querySelectorAll('.changeable-img')
  ).indexOf(image);

  image.src = currentResource.images[index];
  image.onload = () => image.classList.add('loaded');
  /* image
    .decode()
    .then(() => {
      image.classList.add('loaded');
    })
    .catch(() => {
      throw new Error('Could not load/decode big image.');
    }); */
  image.onerror = () => {
    console.log('Error loading image: ', image.src);
  };
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
}

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

function changeLanguage(
  language,
  isMobile = false,
  isTablet = false
) {
  const imageElements = document.querySelectorAll('.changeable-img');
  const textElements = document.querySelectorAll('.changeable-txt');

  const deviceType = isMobile
    ? 'mobile'
    : isTablet
    ? 'tablet'
    : 'default';
  const currentResource = localizedContent[language][deviceType];

  // Create an new observer
  observer = createImageObserver(currentResource, deviceType);

  /* // Preload images
  preLoadImages(currentResource.images[deviceType]); */

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
  imageElements.forEach((image) => {
    image.loading = 'lazy';

    if (isInViewport(image)) {
      loadImage(image, currentResource);
    } else {
      observer.observe(image);
    }
  });
}

const switchLanguageButton = document.getElementById(
  'language-selector'
);

switchLanguageButton.addEventListener('click', () => {
  const loader = document.querySelector('.loader');
  let time;
  const currentLanguage =
    switchLanguageButton.dataset.language === 'russian'
      ? 'english'
      : 'russian';

  loader.style.display = 'flex';

  time = window.setTimeout(() => {
    changeLanguage(
      currentLanguage,
      mqlMobile.matches,
      mqlTablet.matches
    );

    switchLanguageButton.dataset.language = currentLanguage;

    loader.style.display = 'none';
  }, 1000);
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
  Carousel
*/

const items = document.querySelectorAll('.carousel-item');
const [carouselLeftBtn, carouselRightBtn] = document.querySelectorAll(
  '.carousel-control'
);
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
