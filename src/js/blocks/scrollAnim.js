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
    '.integration__title'
  );

  if (
    !integrationAnimSection ||
    !integrationAnimItems.length ||
    !integrationAnimMainTitle
  )
    return;

  setupInitialStates();
  createAnimationTimeline();

  function setupInitialStates() {
    gsap.set(integrationAnimItems, {
      y: -120,
      opacity: 0,
    });
  }

  function createAnimationTimeline() {
    const integrationAnimMainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: integrationAnimSection,
        start: 'top 70%',
        end: () => '+=' + integrationAnimSection.offsetHeight,
        scrub: 1,
        pin: integrationAnimSection,
        pinSpacing: false,
      },
    });

    addItemsAnimation(integrationAnimMainTimeline);
    addItemsDownwardAnimation(integrationAnimMainTimeline);
		addClassToTitle(integrationAnimMainTimeline);
    addClassToggleAnimation(integrationAnimMainTimeline);
  }

  function addItemsAnimation(timeline) {
    integrationAnimItems.forEach((item, index) => {
      timeline.to(
        item,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)"
        },
        index * 0.1
      );
    });
  }

  function addItemsDownwardAnimation(timeline) {
    timeline.to(
      integrationAnimItems,
      {
        y: 60,
        duration: 0.3,
        ease: 'power1.out',
        stagger: 0.01,
      },
    );
  }

	function addClassToTitle(timeline) {
    timeline.to(
      integrationAnimMainTitle,
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
      0.5
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
      0.5
    );
  }
}
