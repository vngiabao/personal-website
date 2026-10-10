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
 const {delay=0,stagger=.06,trigger,paused}=vars;
 let tween:gsap.core.Tween|undefined;
 const split=SplitText.create(target,{
  type:'lines',mask:'lines',autoSplit:true,
  onSplit:self=>{
   openMasks(self.masks);
   tween=gsap.from(self.lines,{
    yPercent:115,duration:.85,ease:EASE,stagger,delay,paused,
    scrollTrigger:trigger===false||paused?undefined:{trigger:trigger??target,start:'top 96%',once:true},
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

/** Refresh only when page geometry changes, coalesced after scrolling settles. */
export function refreshWhenSettled(){
 let active=true;
 let timer:ReturnType<typeof setTimeout>|undefined;
 const refresh=()=>{
  if(!active)return;
  if(ScrollTrigger.isScrolling()){timer=setTimeout(refresh,150);return;}
  ScrollTrigger.refresh();
 };
 const soon=()=>{if(!active)return;clearTimeout(timer);timer=setTimeout(refresh,150)};
 document.fonts?.ready.then(soon);
 if(document.readyState!=='complete')window.addEventListener('load',soon,{once:true});
 // Image dimensions are reserved in markup. Decoding an image is not itself
 // a reason to reset every scroll scene; only an actual height change is.
 const main=document.querySelector('main');
 let height=main?.getBoundingClientRect().height??0;
 const observer=new ResizeObserver(entries=>{
  const next=entries[0]?.contentRect.height??height;
  if(Math.abs(next-height)>1){height=next;soon()}
 });
 if(main)observer.observe(main);
 return()=>{active=false;clearTimeout(timer);observer.disconnect();window.removeEventListener('load',soon)};
}
