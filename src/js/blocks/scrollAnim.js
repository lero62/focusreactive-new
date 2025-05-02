import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

export function initIntegrationAnimation() {
  const section = document.querySelector('.integration__section');
  if (!section) return;

  const topBox = section.querySelector('.integration__box');
  const bottomBox = section.querySelector('.integration__box--bottom');

  if (!topBox || !bottomBox) return;

  const topItems = topBox.querySelectorAll('.integration__item');
  const bottomItems = bottomBox.querySelectorAll('.integration__item');
  const topTitle = topBox.querySelector('.section__title');
  const bottomTitle = bottomBox.querySelector('.section__title');

  gsap.set([...topItems, topTitle], { opacity: 0, y: -300 });
  gsap.set([...bottomItems, bottomTitle], { opacity: 0, y: -300 });

  const appearDuration = 0.6;   
  const appearDelayStep = 0.1;   

  let timeline1 = gsap.timeline({
    scrollTrigger: {
      trigger: topBox,
      start: "-10% top",
      end: "+=100%",
      scrub: 1,
      pin: true,
      pinSpacing: true,
    }
  });

  topItems.forEach((item, index) => {
    timeline1.to(item, {
      opacity: 1,
      y: 0,
      duration: appearDuration
    }, index * appearDelayStep);
  });

  timeline1.to(topTitle, {
    opacity: 1,
    y: 0,
    duration: appearDuration
  }, topItems.length * appearDelayStep);

  let timeline2 = gsap.timeline({
    scrollTrigger: {
      trigger: bottomBox,
      start: "-10% 20%",
      end: "+=100%",
      scrub: 1,
      pin: true,
      pinSpacing: true,
    }
  });

  timeline2.to(bottomTitle, {
    opacity: 1,
    y: 0,
    duration: appearDuration
  }, 0);

  bottomItems.forEach((item, index) => {
    timeline2.to(item, {
      opacity: 1,
      y: 0,
      duration: appearDuration
    }, 0.2 + index * appearDelayStep);
  });
}
