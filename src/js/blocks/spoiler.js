const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const toggleSpoiler = (spoilerHead) => {
  const item = spoilerHead.closest('.js-spoiler-item');
  const isActive = item.classList.contains('is-active');

  // Если элемент уже активен, ничего не делаем
  if (isActive) return;

  const parent = item.closest('[data-spoilers]');
  const allItems = parent.querySelectorAll('.js-spoiler-item');

  // Закрыть все элементы
  allItems.forEach((el) => {
    el.classList.remove('is-active');
  });

  // Открыть текущий элемент
  item.classList.add('is-active');
};

export function initSpoilers() {
  const spoilers = document.querySelectorAll('[data-spoilers]');
  if (!spoilers.length) return;

  spoilers.forEach((spoiler) => {
    const isHover = spoiler.hasAttribute('data-spoiler-hover') && !isTouchDevice();
    const items = spoiler.querySelectorAll('.js-spoiler-item');

    items.forEach((item) => {
      const head = item.querySelector('.js-spoiler-head');
      if (head.classList.contains('is-active')) {
        item.classList.add('is-active');
      }
    });

    spoiler.querySelectorAll('.js-spoiler-head').forEach((spoilerHead) => {
      spoilerHead.onclick = null;

      if (isHover) {
        let hoverTimer = null;

        spoilerHead.addEventListener('mouseenter', () => {
          hoverTimer = setTimeout(() => {
            toggleSpoiler(spoilerHead);
            hoverTimer = null;
          }, 250);
        });

        spoilerHead.addEventListener('mouseleave', () => {
          if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
          }
        });
      } else {
        spoilerHead.addEventListener('click', () => {
          toggleSpoiler(spoilerHead);
        });

        spoilerHead.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            toggleSpoiler(spoilerHead);
          }
        });
      }
    });
  });
}
