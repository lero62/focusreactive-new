export function initAnimationOnScroll() {
  const animItems = document.querySelectorAll('.js-animation');

  if (animItems.length > 0) {
    animItems.forEach((animItem) => {
      const threshold = parseFloat(animItem.dataset.threshold) || 0.25;

      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-anim');
            } else {
              if (!entry.target.classList.contains('js-animation-no-hide')) {
                entry.target.classList.remove('is-anim');
              }
            }
          });
        },
        {
          threshold,
        }
      );

      observer.observe(animItem);

      setTimeout(() => {
        observer.observe(animItem);
      }, 300);
    });
  }
}
