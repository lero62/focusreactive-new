export default function initCmsPreviewToggle() {
  document
    .querySelector('.js-cms-preview-toggle')
    .addEventListener('click', (e) => {
      e.preventDefault();
      e.currentTarget.classList.toggle('is-active');
      const cmsPanel = document.querySelector('.cms-preview');
      cmsPanel.classList.toggle('is-open');
    });
}
