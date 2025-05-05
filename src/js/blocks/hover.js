export function hoverInit() {

	document.querySelectorAll('.roll').forEach((e) => {
    if (!e.dataset.initialized) {
        let t;
        e.addEventListener('mouseenter', (event) => {
            const o = event.target;
            o.classList.remove('is-active');
            o.offsetWidth; 
            o.classList.add('is-active');
            window.clearTimeout(t);
            t = setTimeout(() => {
                o.classList.remove('is-active');
            }, 400);
        });
        e.dataset.initialized = 'true';
    }
});
}
