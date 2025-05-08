export function filterInit() {
  const portfolioRow = document.querySelector('.js-filter-container');
  if (!portfolioRow) return;
  
  const portfolioItems = document.querySelectorAll('.js-filter-card');
  if (!portfolioItems.length) return;
  
  const showMoreBtn = document.querySelector('.js-portfolio-show');
  const showMoreBtnContainer = showMoreBtn ? showMoreBtn.closest('.portfolio-nav') : null;
  const filterBtns = document.querySelectorAll('.js-filter-btn');
  const itemsToShow = 8;
  let currentFilter = 'all';
  
  function setupInitialClasses() {
    portfolioItems.forEach((item, index) => {
      item.classList.remove('portfolio-item--even', 'portfolio-item--odd');
      item.classList.add(index % 2 === 0 ? 'portfolio-item--even' : 'portfolio-item--odd');
    });
  }
  
  function getOffsetByBreakpoint() {
    const windowWidth = window.innerWidth;
    if (windowWidth > 1299) return 80;
    if (windowWidth > 1024) return 50;
    if (windowWidth > 767) return 30;
    return 30;
  }
  
  function calculateVisibleHeight(items) {
    const visibleItems = items.slice(0, itemsToShow);
    if (visibleItems.length === 0) return 0;
    
    const columnCount = 2;
    const rowsToShow = Math.ceil(Math.min(visibleItems.length, itemsToShow) / columnCount);
    const offset = getOffsetByBreakpoint();
    let totalHeight = 0;
    
    for (let i = 0; i < rowsToShow; i++) {
      let rowHeight = 0;
      for (let j = 0; j < columnCount; j++) {
        const itemIndex = i * columnCount + j;
        if (itemIndex < visibleItems.length) {
          rowHeight = Math.max(rowHeight, visibleItems[itemIndex].offsetHeight - offset);
        }
      }
      totalHeight += rowHeight;
    }
    
    return rowsToShow > 1 ? totalHeight + 120 : totalHeight;
  }
  
  function animateItems(items) {
    if (!items || !items.length) return;
    
    items.forEach((item, index) => {
      item.classList.add('portfolio-item--hidden');
      setTimeout(() => {
        item.classList.add('portfolio-item--animated');
      }, index * 100);
    });
  }
  
  function updateItemClasses(items) {
    if (!items || !items.length) return;
    
    items.forEach((item, index) => {
      item.classList.remove('portfolio-item--even', 'portfolio-item--odd');
      item.classList.add(index % 2 === 0 ? 'portfolio-item--even' : 'portfolio-item--odd');
    });
  }
  
  function updateShowAllClass() {
    if (showMoreBtnContainer) {
      const isHidden = getComputedStyle(showMoreBtnContainer).display === 'none';
      if (isHidden) {
        portfolioRow.classList.add('portfolio-row--all-shown');
      } else {
        portfolioRow.classList.remove('portfolio-row--all-shown');
      }
    }
  }
  
  function filterItems(filterValue) {
    if (!filterValue) return;
    
    portfolioRow.classList.add('portfolio-row--filtering');
    currentFilter = filterValue;
    
    const filteredItems = Array.from(portfolioItems).filter(item => {
      if (filterValue === 'all') return true;
      const categories = (item.getAttribute('data-category') || '').split(' ');
      return categories.includes(filterValue);
    });
    
    portfolioItems.forEach(item => {
      item.classList.remove('portfolio-item--animated');
      item.classList.add('portfolio-item--hidden');
      item.style.display = 'none';
    });
    
    filteredItems.forEach(item => item.style.display = '');
    updateItemClasses(filteredItems);
    
    if (filteredItems.length <= itemsToShow) {
      if (showMoreBtnContainer) showMoreBtnContainer.style.display = 'none';
      animateItems(filteredItems);
    } else {
      if (showMoreBtnContainer) showMoreBtnContainer.style.display = '';
      const visibleItems = filteredItems.slice(0, itemsToShow);
      animateItems(visibleItems);
      
      const hiddenItems = filteredItems.slice(itemsToShow);
      hiddenItems.forEach(item => {
        item.classList.add('portfolio-item--hidden');
        item.classList.remove('portfolio-item--animated');
      });
    }
    
    if (filteredItems.length > itemsToShow) {
      portfolioRow.classList.add('portfolio-row--limited');
      const visibleHeight = calculateVisibleHeight(filteredItems);
      portfolioRow.style.setProperty('--visible-height', `${visibleHeight}px`);
    } else {
      portfolioRow.classList.remove('portfolio-row--limited');
    }
    
    updateShowAllClass();
    setTimeout(() => portfolioRow.classList.remove('portfolio-row--filtering'), 600);
  }
  
  function init() {
    setupInitialClasses();
    
    if (portfolioItems.length <= itemsToShow) {
      if (showMoreBtnContainer) {
        showMoreBtnContainer.style.display = 'none';
      }
    } else {
      portfolioRow.classList.add('portfolio-row--limited');
      const visibleHeight = calculateVisibleHeight(Array.from(portfolioItems));
      portfolioRow.style.setProperty('--visible-height', `${visibleHeight}px`);
      
      Array.from(portfolioItems).slice(itemsToShow).forEach(item => {
        item.classList.add('portfolio-item--hidden');
      });
    }
    
    updateShowAllClass();
    
    if (filterBtns && filterBtns.length) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          let filterValue = this.getAttribute('data-filter') || 'all';
          
          const activeEl = document.querySelector('.js-filter .is-active');
          if (activeEl) activeEl.classList.remove('is-active');
          
          const navItem = this.closest('li');
          if (navItem) navItem.classList.add('is-active');
          
          filterItems(filterValue);
        });
      });
    }
  }
  
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', function() {
      portfolioRow.classList.remove('portfolio-row--limited');
      if (showMoreBtnContainer) showMoreBtnContainer.style.display = 'none';
      
      const filteredItems = Array.from(portfolioItems).filter(item => {
        if (currentFilter === 'all') return getComputedStyle(item).display !== 'none';
        const categories = (item.getAttribute('data-category') || '').split(' ');
        return categories.includes(currentFilter) && getComputedStyle(item).display !== 'none';
      });
      
      updateItemClasses(filteredItems);
      animateItems(filteredItems.slice(itemsToShow));
      updateShowAllClass();
    });
  }
  
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (portfolioRow && portfolioRow.classList.contains('portfolio-row--limited')) {
        const filteredItems = Array.from(portfolioItems).filter(item => {
          if (currentFilter === 'all') return getComputedStyle(item).display !== 'none';
          const categories = (item.getAttribute('data-category') || '').split(' ');
          return categories.includes(currentFilter) && getComputedStyle(item).display !== 'none';
        });
        
        const visibleHeight = calculateVisibleHeight(filteredItems);
        portfolioRow.style.setProperty('--visible-height', `${visibleHeight}px`);
      }
    }, 200);
  });
  
  init();
}