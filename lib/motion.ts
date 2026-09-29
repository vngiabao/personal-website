/**
 * Scroll-authored motion, shared by the intro and every page.
 *
 * The earlier layers animated with CSS keyframes that played once, on mount or
 * on an IntersectionObserver hit, so every section behaved the same whether it
 * was being read or not. The reference work (Bearplus: CargoKite, Binder, and
 * A Story's own pass 10) ties movement to the reader's position instead: a
 * headline rises line by line as it arrives, a photograph opens, a dark band
 * grows to the edges, a sentence fills in as it is read. GSAP ScrollTrigger is
 * the one tool that survives resizes, fonts loading late and route changes.
 *
 * EVERY SCENE MUST BE COMPLETE WITHOUT MOTION. Readers who ask for reduced
 * motion, and the no-JS render, get the authored layout. Hidden states are
 * only ever set here, from JS, inside the `motion` condition — never in CSS.
 */
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';

if(typeof window!=='undefined')gsap.registerPlugin(ScrollTrigger,SplitText);

export {gsap,ScrollTrigger,SplitText};

/** Conditions a scene can build against; keys become booleans on `context.conditions`. */
export const MOTION={
 motion:'(prefers-reduced-motion: no-preference)',
 wide:'(prefers-reduced-motion: no-preference) and (min-width: 1024px)',
 narrow:'(prefers-reduced-motion: no-preference) and (max-width: 1023px)',
} as const;
export type Conditions={[K in keyof typeof MOTION]:boolean};

/** The house ease: a long, confident settle, like paper coming to rest. */
export const EASE='expo.out';

/**
 * Masked line reveal. SplitText re-splits when the font loads or the width
 * changes, so a headline that wraps differently on a phone still rises line
 * by line. Only use it on static (server-rendered) text: React must never
 * re-render inside a split.
 */
export function riseLines(target:Element,vars:{delay?:number;stagger?:number;trigger?:Element|false;paused?:boolean}={}){
 const {delay=0,stagger=.08,trigger,paused}=vars;
 let tween:gsap.core.Tween|undefined;
 const split=SplitText.create(target,{
  type:'lines',mask:'lines',autoSplit:true,
  onSplit:self=>{
   openMasks(self.masks);
   tween=gsap.from(self.lines,{
    yPercent:115,duration:1.25,ease:EASE,stagger,delay,paused,
    scrollTrigger:trigger===false||paused?undefined:{trigger:trigger??target,start:'top 88%',once:true},
   });
   return tween;
  },
 });
 return {split,play:()=>tween?.play()};
}

/**
 * A line mask clips at the line box, which cuts the descenders of y, g and p
 * in tightly set serif italics ("strategy."). Give each mask room below the
 * baseline and take the same room back, so the layout does not move.
 */
export function openMasks(masks:Element[]|undefined,room='.18em'){
 masks?.forEach(m=>{const el=m as HTMLElement;el.style.paddingBottom=room;el.style.marginBottom=`-${room}`});
}

/** After fonts and lazy images settle, measured scenes need their positions redone. */
export function refreshWhenSettled(){
 let active=true;
 const refresh=()=>{if(active)ScrollTrigger.refresh()};
 document.fonts?.ready.then(refresh);
 if(document.readyState!=='complete')window.addEventListener('load',refresh,{once:true});
 // Lazy photographs change section heights as they arrive.
 const images=[...document.querySelectorAll<HTMLImageElement>('main img[loading=lazy]')].filter(i=>!i.complete);
 let frame=0;const soon=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(refresh)};
 images.forEach(i=>i.addEventListener('load',soon,{once:true}));
 return()=>{active=false;cancelAnimationFrame(frame);window.removeEventListener('load',refresh);images.forEach(i=>i.removeEventListener('load',soon))};
}
