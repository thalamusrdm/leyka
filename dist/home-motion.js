'use strict';
(() => {
 const hero=document.querySelector('.reference-hero');
 const quality=document.querySelector('.home-quality');
 if(!hero||!quality)return;
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=value=>Math.max(0,Math.min(1,value));
 let pending=0;
 function update(){
  pending=0;
  if(preference.matches){hero.style.removeProperty('--home-hero-scale');quality.style.removeProperty('--home-quality-x');return;}
  const viewport=window.innerHeight;
  const heroRect=hero.getBoundingClientRect();
  const qualityRect=quality.getBoundingClientRect();
  // A maximum 6% zoom over the hero's departure from the viewport.
  const heroProgress=clamp(-heroRect.top/heroRect.height);
  hero.style.setProperty('--home-hero-scale',(1+heroProgress*.06).toFixed(4));
  // Positive x on entry, negative x on exit: right to left in either writing direction.
  const qualityProgress=clamp((viewport-qualityRect.top)/(viewport+qualityRect.height));
  quality.style.setProperty('--home-quality-x',(32-qualityProgress*64).toFixed(2)+'px');
 }
 function schedule(){if(!pending)pending=requestAnimationFrame(update);}
 function syncPreference(){
  window.removeEventListener('scroll',schedule);
  window.removeEventListener('resize',schedule);
  if(!preference.matches){window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});}
  schedule();
 }
 preference.addEventListener('change',syncPreference);
 window.addEventListener('pageshow',schedule);
 syncPreference();
})();
