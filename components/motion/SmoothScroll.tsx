'use client';
/**
 * Weighted scrolling for mouse and trackpad readers.
 *
 * Lenis interpolates the wheel so long pages glide and settle instead of
 * stepping, and drives ScrollTrigger from the same frame so scrubbed scenes
 * (the Path's rail, the testimonial fill, drifting prints) move with the page
 * rather than a frame behind it. Touch keeps the platform's own scrolling:
 * momentum there is already physical, and replacing it feels wrong.
 *
 * Off entirely for reduced motion. Paused while a modal dialog (the Book,
 * the menu sheet) holds focus, so the page behind it cannot drift.
 */
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import Lenis from 'lenis';
import {gsap,ScrollTrigger} from '@/lib/motion';

let lenis:Lenis|null=null;

/** Header and sticky section bar; anchors land below both. */
const anchorOffset=()=>parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;

export function SmoothScroll(){
 const pathname=usePathname();

 useEffect(()=>{
  const query=matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)');
  const tick=(time:number)=>lenis?.raf(time*1000);
  const syncDialogs=()=>{if(!lenis)return;document.querySelector('dialog[open]')?lenis.stop():lenis.start()};
  const dialogs=new MutationObserver(syncDialogs);

  // In-page anchors glide to their section and still update the address bar.
  const onClick=(event:MouseEvent)=>{
   if(!lenis||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const link=(event.target as Element).closest?.('a[href*="#"]') as HTMLAnchorElement|null;
   if(!link||link.target||link.origin!==location.origin||link.pathname!==location.pathname||!link.hash)return;
   const target=document.getElementById(decodeURIComponent(link.hash.slice(1)));
   if(!target)return;
   event.preventDefault();
   // Lenis already honours scroll-padding-top (header + section bar) for an
   // element target, so no offset here. Lazy photographs above the target can
   // arrive mid-glide and push it down;
   // once the glide lands, correct for whatever moved.
   const glide=(duration:number,tries:number)=>lenis?.scrollTo(target,{duration,easing:t=>1-Math.pow(1-t,4),onComplete:()=>{
    if(tries>0&&Math.abs(target.getBoundingClientRect().top-anchorOffset())>4)glide(.7,tries-1);
   }});
   glide(1.4,3);
   if(location.hash!==link.hash){history.pushState(history.state,'',link.hash);window.dispatchEvent(new HashChangeEvent('hashchange'))}
  };

  const start=()=>{
   if(lenis)return;
   lenis=new Lenis({lerp:.095,wheelMultiplier:.95,smoothWheel:true,prevent:node=>!!node.closest?.('dialog,[data-lenis-prevent]')});
   lenis.on('scroll',ScrollTrigger.update);
   gsap.ticker.add(tick);
   gsap.ticker.lagSmoothing(0);
   dialogs.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
   document.addEventListener('click',onClick);
   syncDialogs();
  };
  const stop=()=>{
   if(!lenis)return;
   gsap.ticker.remove(tick);
   gsap.ticker.lagSmoothing(500,33);
   dialogs.disconnect();
   document.removeEventListener('click',onClick);
   lenis.destroy();lenis=null;
  };
  const update=()=>query.matches?start():stop();
  update();
  query.addEventListener('change',update);
  return()=>{query.removeEventListener('change',update);stop()};
 },[]);

 // A new route has a new height; let Lenis re-measure after Next has placed the scroll.
 useEffect(()=>{
  const frame=requestAnimationFrame(()=>lenis?.resize());
  return()=>cancelAnimationFrame(frame);
 },[pathname]);

 return null;
}
