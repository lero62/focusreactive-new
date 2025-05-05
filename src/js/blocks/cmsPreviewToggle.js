export default function initCmsPreviewToggle() {
  const toggleButton = document.querySelector('.js-cms-preview-toggle');
  
  if (!toggleButton) {
    return;
  }
  
  toggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.currentTarget.classList.toggle('is-active');
    
    const cmsPanel = document.querySelector('.cms-preview');
    
    if (cmsPanel) {
      cmsPanel.classList.toggle('is-open');
    }
  });
}