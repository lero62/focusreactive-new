import initDropdowns from './blocks/dropdown.js';
import initCmsPreviewToggle from './blocks/cmsPreviewToggle.js';
import { initStickyHeader } from './blocks/navigation.js';
import { initSpoilers } from './blocks/spoiler.js';
import { initTabs } from './blocks/tabs.js';
import { selectboxes, setupSelectboxes } from './blocks/selectbox.js';
import { initTestimonialSwiper } from './blocks/sliders.js';
import { draggableCMS } from './blocks/draggable.js';
import { scrollAnimations } from './blocks/scrollAnim.js';
import { filterInit } from './blocks/filter.js';

document.addEventListener('DOMContentLoaded', function (event) {
  initDropdowns();
  initCmsPreviewToggle();
  initStickyHeader();
  initSpoilers();
  initTabs();
  selectboxes();
  setupSelectboxes();
  initTestimonialSwiper();
  draggableCMS();
  scrollAnimations();
	filterInit();
});


