export function initStickyHeader() {
	const header = document.querySelector('header');
	if (!header) return;

	const onScroll = () => {
		if (window.scrollY > 0) {
			header.classList.add('is-sticky');
		} else {
			header.classList.remove('is-sticky');
		}
	};

	window.addEventListener('scroll', onScroll);
	onScroll();

	// OPEN MOBILE MAIN MOBILE MENU

	const hamburger = document.querySelector('.js-hamburger');
	const nav = document.querySelector('.js-main-nav');

	function toggleMenu() {
		const isOpen = hamburger.classList.toggle('is-active');
		nav.classList.toggle('is-open', isOpen);
		hamburger.setAttribute('aria-expanded', isOpen);
	}

	function closeMenu() {
		hamburger.classList.remove('is-active');
		nav.classList.remove('is-open');
		hamburger.setAttribute('aria-expanded', 'false');
	}

	// Клик по бургеру
	hamburger.addEventListener('click', toggleMenu);

	// Нажатие Enter / Space
	hamburger.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleMenu();
		}
	});

	// Закрытие по Esc
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closeMenu();
		}
	});
}
