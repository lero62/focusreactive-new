const toggleDropdown = (toggleBtn) => {
  const targetSelector = toggleBtn.getAttribute('data-dropdown-toggle');
  if (!targetSelector) return;
  
  const dropdown = document.querySelector(targetSelector);
  if (!dropdown) return;
  
  toggleBtn.classList.toggle('is-active');
  const isOpen = dropdown.getAttribute('data-dropdown') === 'true';
  
  closeAllDropdowns();
  
  if (!isOpen) {
    toggleBtn.classList.add('is-active');
    dropdown.setAttribute('data-dropdown', 'true');
    
    const parentBlock = toggleBtn.closest('.cms-panel__block');
    if (parentBlock) {
      parentBlock.classList.add('is-active');
    }
  }
};

const closeAllDropdowns = () => {
  document.querySelectorAll('[data-dropdown="true"]').forEach((dropdown) => {
    dropdown.setAttribute('data-dropdown', 'false');
  });
  
  document.querySelectorAll('[data-dropdown-toggle]').forEach((dropdownButton) => {
    dropdownButton.classList.remove('is-active');
    
    const parentBlock = dropdownButton.closest('.cms-panel__block');
    if (parentBlock) {
      parentBlock.classList.remove('is-active');
    }
  });
};

export default function initDropdowns() {
  document.querySelectorAll('[data-dropdown-toggle]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(btn);
    });
    
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        toggleDropdown(btn);
      }
    });
  });
  
  document.addEventListener('click', (e) => {
    const isInsideDropdown = e.target.closest('[data-dropdown="true"]');
    const isToggleButton = e.target.closest('[data-dropdown-toggle]');
    if (!isInsideDropdown && !isToggleButton) {
      closeAllDropdowns();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });
}