export function initTabs() {
	document.querySelectorAll('[data-tabs]').forEach((tabsContainer) => {
		const navItems = tabsContainer.querySelectorAll('[data-tabs-nav] li');
		const tabContents = tabsContainer.querySelectorAll('[data-tabs-block]');

		navItems.forEach((navItem, index) => {
			const button = navItem.querySelector('button');
			if (!button) return;

			button.addEventListener('click', () => {
				// Удаляем активные классы
				navItems.forEach((item) => item.classList.remove('is-active'));
				tabContents.forEach((tab) => tab.classList.remove('is-active'));

				// Добавляем активный класс
				navItem.classList.add('is-active');
				tabContents[index].classList.add('is-active');
			});
		});
	});

	
}
