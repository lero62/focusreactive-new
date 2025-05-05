import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

export function scrollAnimations() {
	initTextColorAnimation();
	initIntegrationAnimation();
}

function initTextColorAnimation() {
	const fillText = document.querySelector('.js-textColorAnim');
	const fillTextLines = document.querySelectorAll('.js-textColorAnim span');

	if (fillText && fillTextLines.length > 0) {
		fillTextLines.forEach((line) => {
			line.style.backgroundPosition = '100% 0%';
		});

		fillTextLines.forEach((line, index) => {
			ScrollTrigger.create({
				trigger: fillText,
				start: 'top 70%',
				end: 'bottom 30%',
				scrub: 1,
				onEnter: () => {
					line.style.backgroundPosition = '100% 0%';
				},
				onUpdate: function (self) {
					const progress = self.progress;
					const offset = index * 0.15;
					const position = Math.max(
						0,
						Math.min(100, 100 - (progress - offset) * 100 * 2)
					);
					line.style.backgroundPosition = `${position}% 0%`;
				},
			});
		});
	}
}

function initIntegrationAnimation() {
	const integrationAnimSection = document.querySelector('.js-cms-animTrigger');
	const integrationAnimItems = document.querySelectorAll('.js-cms-animBlock');
	const integrationAnimMainTitle = document.querySelector(
		'.integration__title span:first-child'
	);
	const integrationAnimGreenTitle = document.querySelector(
		'.integration__title span:last-child'
	);

	if (
		!integrationAnimSection ||
		!integrationAnimItems.length ||
		!integrationAnimMainTitle ||
		!integrationAnimGreenTitle
	)
		return;

	setupInitialStates();
	createAnimationTimeline();

	function setupInitialStates() {
		gsap.set(integrationAnimItems, {
			y: -30,
			opacity: 0,
		});

		gsap.set(integrationAnimMainTitle, {
			y: -100,
			autoAlpha: 0,
		});

		gsap.set(integrationAnimGreenTitle, {
			y: -100,
			autoAlpha: 0,
		});
	}

	function createAnimationTimeline() {
		const integrationAnimMainTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: integrationAnimSection,
				start: 'top 70%',
				end: () => '+=' + integrationAnimSection.offsetHeight,
				scrub: 2,
				pin: integrationAnimSection,
				pinSpacing: false,
			},
		});

		addItemsAnimation(integrationAnimMainTimeline);
		addMainTitleAnimation(integrationAnimMainTimeline);
		addItemsDownwardAnimation(integrationAnimMainTimeline);
		addGreenTitleAnimation(integrationAnimMainTimeline);
		addClassToggleAnimation(integrationAnimMainTimeline);
	}

	function addItemsAnimation(timeline) {
		integrationAnimItems.forEach((item) => {
			timeline.to(
				item,
				{
					y: 0,
					opacity: 1,
					duration: 0.2,
					ease: 'power2.out',
				},
				0.05
			);
		});
	}

	function addMainTitleAnimation(timeline) {
		timeline.to(
			integrationAnimMainTitle,
			{
				y: 0,
				autoAlpha: 1,
				duration: 0.2,
				ease: 'power1.out',
			},
			0.3
		);

		timeline.to(
			integrationAnimMainTitle,
			{
				autoAlpha: 0,
				y: 100,
				duration: 0.2,
				ease: 'power1.out',
			},
			0.5
		);
	}

	function addItemsDownwardAnimation(timeline) {
		timeline.to(
			integrationAnimItems,
			{
				y: 0,
				duration: 0.3,
				ease: 'power1.out',
				stagger: 0.05,
			},
			0.6
		);
	}

	function addGreenTitleAnimation(timeline) {
		timeline.to(
			integrationAnimGreenTitle,
			{
				y: 0,
				autoAlpha: 1,
				duration: 0.2,
				ease: 'power1.out',
			},
			0.7
		);

		timeline.to(
			integrationAnimGreenTitle,
			{
				autoAlpha: 0,
				y: 100,
				duration: 0.2,
				ease: 'power1.out',
			},
			0.9
		);
	}

	function addClassToggleAnimation(timeline) {
		timeline.to(
			integrationAnimItems,
			{
				onStart: function () {
					this.targets().forEach((el) => {
						el.classList.add('is-active');
					});
				},
				onReverseComplete: function () {
					this.targets().forEach((el) => {
						el.classList.remove('is-active');
					});
				},
			},
			0.95
		);
	}
}
