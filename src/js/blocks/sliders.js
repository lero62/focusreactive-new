import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

export function initTestimonialSwiper() {
  const swiperEl = document.querySelector('.testimonial-swiper');
  const customPagination = document.querySelector(
    '.testimonial-swiper__numbers'
  );

  if (swiperEl) {
    new Swiper(swiperEl, {
      modules: [Pagination],
      loop: false,
      slidesPerView: 1,
      spaceBetween: 0,
      watchOverflow: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      autoHeight: true,
      pagination: {
        el: '.testimonial-swiper__pagination',
        clickable: true,
      },
      on: {
        init: function () {
          createCustomPagination(this);
          updateCustomPagination(this);
        },
        slideChange: function () {
          updateCustomPagination(this);
        },
      },
    });

    function createCustomPagination(swiper) {
      if (!customPagination) return;

      const totalSlides = swiper.slides.length;

      for (let i = 0; i < totalSlides; i++) {
        const btn = document.createElement('button');
        btn.className = 'testimonial-swiper__number';
        btn.textContent = String(i + 1).padStart(2, '0');
        btn.setAttribute('data-index', i);
        btn.addEventListener('click', () => swiper.slideTo(i));
        customPagination.appendChild(btn);
      }
    }

    function updateCustomPagination(swiper) {
      if (!customPagination) return;

      const buttons = customPagination.querySelectorAll(
        '.testimonial-swiper__number'
      );
      buttons.forEach((btn, index) => {
        btn.classList.toggle('is-active', index === swiper.realIndex);
      });
    }
  }
}
