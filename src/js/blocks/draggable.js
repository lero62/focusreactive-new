import { Sortable } from '@shopify/draggable';

export function draggableCMS() {
	// Основные элементы интерфейса
	const cmsElements = {
		cmsMainContainer: document.querySelector('.js-drag-container'),
		cmsDropdownContainer: document.querySelector('.js-drag-dropdown-container'),
		cmsDropdownMenu: document.querySelector('#cms-panel-dropdown'),
		cmsCmsFooter: document.querySelector('.js-cms-footer'),
		cmsPreviewPage: document.querySelector('.js-cms-preview'),
		cmsScrollContainer: document.querySelector('.js-cms-scroll')
	};

	// Скроллит к секции по ID
	function cmsScrollToSection(sectionId) {
		if (!sectionId) return;
		
		const cmsSection = document.querySelector(`.js-cms-section[data-section="${sectionId}"]`);
		if (!cmsSection) return;
		
		if (cmsElements.cmsScrollContainer) {
			const cmsSectionRect = cmsSection.getBoundingClientRect();
			const cmsContainerRect = cmsElements.cmsScrollContainer.getBoundingClientRect();
			const cmsScrollTop = cmsSectionRect.top - cmsContainerRect.top + cmsElements.cmsScrollContainer.scrollTop - 30;
			
			cmsElements.cmsScrollContainer.scrollTo({
				top: cmsScrollTop,
				behavior: 'smooth'
			});
		} else {
			cmsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	// Обновляет порядок секций
	function cmsUpdateUI() {
		// Проверка видимости футера
		if (cmsElements.cmsDropdownMenu && cmsElements.cmsCmsFooter) {
			const cmsHasShowItems = Array.from(
				cmsElements.cmsDropdownMenu.querySelectorAll('.cms-panel__dropdown-item')
			).some(item => item.classList.contains('show'));
			
			cmsElements.cmsCmsFooter.style.display = cmsHasShowItems ? '' : 'none';
		}
		
		// Обновление порядка секций
		if (cmsElements.cmsMainContainer && cmsElements.cmsPreviewPage) {
			const cmsSectionMap = new Map();
			
			cmsElements.cmsMainContainer.querySelectorAll('.js-drag-block.show[data-section]')
				.forEach((block, index) => {
					const cmsSectionId = block.dataset.section;
					if (cmsSectionId && !cmsSectionMap.has(cmsSectionId)) {
						cmsSectionMap.set(cmsSectionId, index);
					}
				});
			
			document.querySelectorAll('.js-cms-section').forEach(section => {
				const cmsSectionId = section.dataset.section;
				section.style.order = cmsSectionId && cmsSectionMap.has(cmsSectionId) 
					? cmsSectionMap.get(cmsSectionId).toString() 
					: '999';
			});
		}
	}

	// Отслеживание изменений dropdown для скролла
	function cmsSetupDropdownObserver() {
		const cmsDropdowns = document.querySelectorAll('[data-dropdown]');
		
		cmsDropdowns.forEach(dropdown => {
			new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					if (mutation.attributeName === 'data-dropdown' && 
						dropdown.getAttribute('data-dropdown') === 'true') {
						
						const cmsToggleButton = document.querySelector(`[data-dropdown-toggle="#${dropdown.id}"]`);
						if (cmsToggleButton) {
							const cmsBlock = cmsToggleButton.closest('.js-drag-block');
							if (cmsBlock && cmsBlock.dataset.section) {
								setTimeout(() => cmsScrollToSection(cmsBlock.dataset.section), 100);
							}
						}
					}
				});
			}).observe(dropdown, { attributes: true });
		});
	}

	// Инициализация Sortable для основного контейнера
	function cmsInitMainSortable() {
		if (!cmsElements.cmsMainContainer) return;
		
		const cmsMainSortable = new Sortable(cmsElements.cmsMainContainer, {
			draggable: '.js-drag-block',
			handle: '.js-drag-btn',
			mirror: { constrainDimensions: true },
			classes: { 'sortable:start': 'js-sortable-start' },
			containers: [cmsElements.cmsMainContainer]
		});

		cmsMainSortable.on('sortable:start', (event) => {
			if (event.dragEvent.source.closest('.js-drag-dropdown-container')) {
				event.cancel();
			}
		});

		cmsMainSortable.on('sortable:stop', () => setTimeout(cmsUpdateUI, 10));
		
		// Скролл по клику на название блока
		cmsElements.cmsMainContainer.addEventListener('click', (event) => {
			const cmsBlockName = event.target.closest('.cms-panel__block-name:not([data-dropdown-toggle])');
			if (cmsBlockName) {
				const cmsBlock = cmsBlockName.closest('.js-drag-block');
				if (cmsBlock && cmsBlock.dataset.section) {
					cmsScrollToSection(cmsBlock.dataset.section);
				}
			}
		});
	}

	// Инициализация Sortable для выпадающего списка
	function cmsInitDropdownSortable() {
		if (!cmsElements.cmsDropdownContainer) return;
		
		const cmsDropdownSortable = new Sortable(cmsElements.cmsDropdownContainer, {
			draggable: '.js-drag-block',
			handle: '.js-drag-btn',
			mirror: { constrainDimensions: true },
			containers: [cmsElements.cmsDropdownContainer]
		});

		// Устанавливаем начальные data-article-id атрибуты если их нет
		function cmsSetInitialArticleIds() {
			const cmsBlogSection = document.querySelector('.js-cms-section[data-section="3"]');
			if (!cmsBlogSection) return;
			
			const cmsArticles = cmsBlogSection.querySelectorAll('.preview-page__article');
			const cmsDropdownItems = cmsElements.cmsDropdownContainer.querySelectorAll('.js-drag-block');
			
			if (cmsArticles.length === 0 || cmsDropdownItems.length === 0) return;
			
			cmsDropdownItems.forEach((item, index) => {
				const cmsItemText = item.querySelector('span').textContent.trim();
				
				for (let i = 0; i < cmsArticles.length; i++) {
					const cmsArticleTitle = cmsArticles[i].querySelector('.preview-page__article-title').textContent.trim();
					if (cmsItemText === cmsArticleTitle) {
						// Устанавливаем одинаковые data-article-id для соответствующих элементов
						const cmsArticleId = `article-${index}`;
						item.dataset.articleId = cmsArticleId;
						cmsArticles[i].dataset.articleId = cmsArticleId;
						
						// Устанавливаем начальный порядок
						cmsArticles[i].style.order = index.toString();
						break;
					}
				}
			});
		}
		
		cmsSetInitialArticleIds();

		// После перетаскивания обновляем порядок на основе data-article-id
		cmsDropdownSortable.on('sortable:stop', () => {
			setTimeout(() => {
				const cmsDropdownItems = cmsElements.cmsDropdownContainer.querySelectorAll('.js-drag-block');
				const cmsBlogSection = document.querySelector('.js-cms-section[data-section="3"]');
				if (!cmsBlogSection) return;
				
				const cmsArticles = cmsBlogSection.querySelectorAll('.preview-page__article');
				if (cmsArticles.length === 0) return;
				
				// Обновляем порядок статей по data-article-id
				cmsDropdownItems.forEach((item, index) => {
					const cmsArticleId = item.dataset.articleId;
					if (cmsArticleId) {
						const cmsArticle = cmsBlogSection.querySelector(`.preview-page__article[data-article-id="${cmsArticleId}"]`);
						if (cmsArticle) {
							cmsArticle.style.order = index.toString();
						}
					}
				});
			}, 50);
		});
	}

	function cmsSetupEventListeners() {
		document.addEventListener('click', (event) => {
			// Обработка удаления блока
			const cmsDeleteButton = event.target.closest('.js-cms-delete');
			if (cmsDeleteButton) {
				const cmsDeleteBlock = cmsDeleteButton.closest('.js-drag-block');
				if (cmsDeleteBlock) {
					cmsDeleteBlock.classList.remove('show');

					const cmsSectionId = cmsDeleteBlock.dataset.section;
					if (cmsSectionId) {
						const cmsSection = document.querySelector(`.js-cms-section[data-section="${cmsSectionId}"]`);
						if (cmsSection) cmsSection.classList.remove('show');

						const cmsDropdownItem = cmsElements.cmsDropdownMenu?.querySelector(
							`.cms-panel__dropdown-item[data-section="${cmsSectionId}"]`
						);
						if (cmsDropdownItem) cmsDropdownItem.classList.add('show');
					}
					
					cmsUpdateUI();
				}
			}
			
			// Обработка клика на элементы выпадающего списка
			if (cmsElements.cmsDropdownMenu) {
				const cmsDropdownBtn = event.target.closest('.cms-panel__dropdown-btn');
				if (cmsDropdownBtn) {
					const cmsDropdownItem = cmsDropdownBtn.closest('.cms-panel__dropdown-item');
					if (cmsDropdownItem && cmsDropdownItem.dataset.section) {
						const cmsSectionId = cmsDropdownItem.dataset.section;
						
						cmsDropdownItem.classList.remove('show');
						
						const cmsPanelBlock = cmsElements.cmsMainContainer?.querySelector(
							`.js-drag-block[data-section="${cmsSectionId}"]`
						);
						if (cmsPanelBlock) cmsPanelBlock.classList.add('show');
						
						const cmsSection = document.querySelector(
							`.js-cms-section[data-section="${cmsSectionId}"]`
						);
						if (cmsSection) cmsSection.classList.add('show');
						
						cmsUpdateUI();
					}
				}
			}
		});
	}

	// Инициализация начального состояния
	function cmsInit() {
		const cmsPanelBlocks = document.querySelectorAll('.js-drag-block[data-section]');
		
		cmsPanelBlocks.forEach(block => {
			const cmsSectionId = block.dataset.section;
			const cmsDropdownItem = cmsElements.cmsDropdownMenu?.querySelector(
				`.cms-panel__dropdown-item[data-section="${cmsSectionId}"]`
			);

			if (cmsDropdownItem) {
				cmsDropdownItem.classList.toggle('show', !block.classList.contains('show'));
			}
		});
		
		cmsUpdateUI();
		cmsInitMainSortable();
		cmsInitDropdownSortable();
		cmsSetupDropdownObserver();
		cmsSetupEventListeners();
	}

	cmsInit();
}