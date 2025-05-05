import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { SplitText } from 'gsap/SplitText.js';

export function scrollAnimations() {
  gsap.config({ trialWarn: false });
  gsap.registerPlugin(ScrollTrigger, SplitText);

  let textFillSplit = new SplitText(".js-textColorAnim", { type: "lines" });
  let textFillMasks;

  function makeTextFillHappen() {
    textFillMasks = [];
    textFillSplit.lines.forEach((textFillTarget) => {
      let textFillMask = document.createElement("span");
      textFillMask.className = "text-fill-mask";
      textFillTarget.append(textFillMask);
      textFillMasks.push(textFillMask);
      
      gsap.to(textFillMask, {
        scaleX: 0,
        transformOrigin: "right center",
        ease: "none",
        scrollTrigger: {
          trigger: textFillTarget,
          scrub: 2.5,
          start: "top 40%",
          end: "bottom 30%"
        }
      });
    });
  }

  window.addEventListener("resize", textFillNewTriggers);

  function textFillNewTriggers() {
    ScrollTrigger.getAll().forEach((textFillTrigger, i) => {
      textFillTrigger.kill();
      textFillMasks[i].remove();
    });
    textFillSplit.split();
    makeTextFillHappen();
  }
  
  makeTextFillHappen();
}