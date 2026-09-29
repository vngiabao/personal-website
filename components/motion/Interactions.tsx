'use client';
/**
 * Pointer details that make the controls feel physical.
 *
 * Primary actions lean toward the pointer while it is over them and spring
 * back when it leaves: decorative, so only for a fine pointer with motion
 * allowed. The pull uses the individual `translate` property, leaving
 * `transform` and `scale` free for the CSS press state (app/atelier.css).
 * Delegated from the document, so controls that React re-renders (the Work
 * preview, the product theatre) keep working without rebinding.
 */
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {gsap} from '@/lib/motion';

const MAGNETIC='.solid-link,[data-magnetic]';
const PULL=.28,MAX=10;

/**
 * Every navy surface is cut from the same cloth as the Book's cover: its fine
 * cross-weave, laid behind each band's content (app/atelier.css .tex-cloth).
 * A Story's cream pages keep their paper (CSS only). Layers are injected once
 * per section and never take pointer events.
 */
const CLOTH='main section.blue,.contact-close,.case-next,.case-chapter-result,.home-book-section,main.book-page';
function dress(){
 document.querySelectorAll<HTMLElement>(CLOTH).forEach(host=>{
  if(host.querySelector(':scope > .tex'))return;
  const layer=document.createElement('div');layer.className='tex tex-cloth';layer.setAttribute('aria-hidden','true');
  host.classList.add('tex-host');host.prepend(layer);
 });
}

export function Interactions(){
 const pathname=usePathname();
 useEffect(()=>{dress()},[pathname]);
 useEffect(()=>{
  const query=matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)');
  let current:HTMLElement|null=null;
  // GSAP does not tween the individual `translate` property, so each element
  // gets a proxy {x,y} that is written to style.translate on every frame.
  const pulls=new WeakMap<HTMLElement,{x:number;y:number}>();
  const pull=(el:HTMLElement,x:number,y:number,vars:gsap.TweenVars)=>{
   let at=pulls.get(el);if(!at){at={x:0,y:0};pulls.set(el,at)}
   const p=at;
   gsap.to(p,{x,y,...vars,overwrite:'auto',onUpdate:()=>{el.style.translate=`${p.x.toFixed(2)}px ${p.y.toFixed(2)}px`},onComplete:()=>{if(!p.x&&!p.y)el.style.translate=''}});
  };
  const release=(el:HTMLElement)=>pull(el,0,0,{duration:.9,ease:'elastic.out(1,0.45)'});
  const move=(event:PointerEvent)=>{
   if(!query.matches)return;
   const el=(event.target as Element).closest?.(MAGNETIC) as HTMLElement|null;
   if(current&&current!==el){release(current);current=null}
   if(!el)return;
   current=el;
   const r=el.getBoundingClientRect();
   const x=gsap.utils.clamp(-MAX,MAX,(event.clientX-(r.left+r.width/2))*PULL);
   const y=gsap.utils.clamp(-MAX,MAX,(event.clientY-(r.top+r.height/2))*PULL);
   pull(el,x,y,{duration:.5,ease:'power3.out'});
  };
  const leave=()=>{if(current){release(current);current=null}};
  document.addEventListener('pointermove',move,{passive:true});
  document.documentElement.addEventListener('pointerleave',leave);
  return()=>{document.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',leave)};
 },[]);
 return null;
}

/**
 * One ink rule under the active entry of a section bar, sliding between
 * entries instead of each link drawing its own underline.
 */
export function useInk(container:React.RefObject<HTMLElement|null>,active:string){
 useEffect(()=>{
  const box=container.current;
  const ink=box?.querySelector<HTMLElement>(':scope > .nav-ink');
  if(!box||!ink)return;
  const place=()=>{
   const link=box.querySelector<HTMLElement>('a[aria-current]');
   if(!link){ink.style.opacity='0';return}
   ink.style.opacity='1';
   // A 100px rule scaled to the link: transform only, so the slide stays on the compositor.
   ink.style.transform=`translateX(${link.offsetLeft}px) scaleX(${link.offsetWidth/100})`;
   // Keep the active entry visible when the bar scrolls sideways on narrow screens.
   if(box.scrollWidth>box.clientWidth)box.scrollTo({left:link.offsetLeft-box.clientWidth/2+link.offsetWidth/2,behavior:'smooth'});
  };
  place();
  const observer=new ResizeObserver(place);
  observer.observe(box);
  return()=>observer.disconnect();
 },[container,active]);
}
