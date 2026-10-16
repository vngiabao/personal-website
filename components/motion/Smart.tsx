'use client';
/**
 * More details that answer the reader's hand (desktop, fine pointer):
 *
 *  · Peeks: anything marked data-peek (a place named in the copy, a "Where to
 *    next" row) shows its photograph beside the cursor, leaning with the
 *    pointer's speed, like a print slid out of a folder.
 *  · Loupe: evidence exhibits (schematics, competition decks) can be read
 *    up close: a lens follows the pointer at 2.4×.
 *  · Section links: hovering a section's heading offers "#", which copies a
 *    link straight to that section.
 *
 * Toasts go through Delights ("gb:toast").
 */
import {useEffect,useRef} from 'react';
import {usePathname} from 'next/navigation';
import {gsap} from '@/lib/motion';

const FINE='(hover: hover) and (pointer: fine)';
const CALM='(prefers-reduced-motion: no-preference)';
const toast=(message:string)=>window.dispatchEvent(new CustomEvent('gb:toast',{detail:message}));

export function Smart(){
 const pathname=usePathname();
 const peekEl=useRef<HTMLDivElement>(null);
 const anchor=useRef<HTMLButtonElement>(null);

 // ── Peeks ───────────────────────────────────────────────────────────────
 useEffect(()=>{
  const el=peekEl.current;if(!el||!matchMedia(FINE).matches)return;
  const calm=matchMedia(CALM).matches;
  const img=el.querySelector('img')!;
  const x=gsap.quickTo(el,'x',{duration:calm?.45:0,ease:'power3'}),y=gsap.quickTo(el,'y',{duration:calm?.45:0,ease:'power3'});
  const tilt=gsap.quickTo(el,'rotation',{duration:.5,ease:'power3'});
  let current:HTMLElement|null=null,last=0,lx=0;
  const show=(t:HTMLElement,e:PointerEvent)=>{
   current=t;img.src=t.dataset.peek!;
   gsap.set(el,{x:e.clientX+22,y:e.clientY-40});
   gsap.to(el,{autoAlpha:1,scale:1,duration:calm?.35:0,ease:'back.out(1.7)',overwrite:'auto'});
  };
  const hide=()=>{current=null;gsap.to(el,{autoAlpha:0,scale:.86,duration:calm?.25:0,ease:'power2.in',overwrite:'auto'})};
  const over=(e:PointerEvent)=>{const t=(e.target as Element).closest<HTMLElement>('[data-peek]');if(t&&t!==current&&t.dataset.peek)show(t,e);else if(!t&&current)hide()};
  const move=(e:PointerEvent)=>{
   if(!current)return;
   const r=el.getBoundingClientRect(),right=e.clientX+22+r.width>innerWidth;
   x(right?e.clientX-22-r.width:e.clientX+22);y(Math.min(innerHeight-r.height-12,Math.max(12,e.clientY-r.height/2)));
   const now=performance.now(),v=(e.clientX-lx)/Math.max(8,now-last);lx=e.clientX;last=now;
   if(calm)tilt(gsap.utils.clamp(-7,7,v*6));
  };
  document.addEventListener('pointerover',over);window.addEventListener('pointermove',move,{passive:true});
  window.addEventListener('scroll',hide,{passive:true});
  return()=>{document.removeEventListener('pointerover',over);window.removeEventListener('pointermove',move);window.removeEventListener('scroll',hide);hide()};
 },[pathname]);

 // ── Loupe ───────────────────────────────────────────────────────────────
 useEffect(()=>{
  if(!matchMedia(FINE).matches)return;
  const figures=[...document.querySelectorAll<HTMLElement>('.case-page :is(.case-curated-artifact,.case-artifact,.case-hero-visual .clean-evidence)')];
  const off:(()=>void)[]=[];
  figures.forEach(fig=>{
   const img=fig.querySelector('img');if(!img)return;
   const lens=document.createElement('span');lens.className='gb-loupe';lens.setAttribute('aria-hidden','true');
   fig.classList.add('has-loupe');(img.parentElement??fig).appendChild(lens);
   const Z=2.4;
   const move=(e:PointerEvent)=>{
    const r=img.getBoundingClientRect();const px=e.clientX-r.left,py=e.clientY-r.top;
    if(px<0||py<0||px>r.width||py>r.height){lens.classList.remove('on');return}
    lens.classList.add('on');
    const host=(img.parentElement??fig).getBoundingClientRect();
    lens.style.transform=`translate(${e.clientX-host.left-80}px,${e.clientY-host.top-80}px)`;
    lens.style.backgroundImage=`url("${img.currentSrc||img.src}")`;
    lens.style.backgroundSize=`${r.width*Z}px ${r.height*Z}px`;
    lens.style.backgroundPosition=`${-(px*Z-80)}px ${-(py*Z-80)}px`;
   };
   const leave=()=>lens.classList.remove('on');
   img.addEventListener('pointermove',move);img.addEventListener('pointerleave',leave);
   off.push(()=>{img.removeEventListener('pointermove',move);img.removeEventListener('pointerleave',leave);lens.remove();fig.classList.remove('has-loupe')});
  });
  return()=>off.forEach(f=>f());
 },[pathname]);

 // ── Section links ─────────────────────────────────────────────────────────
 useEffect(()=>{
  const btn=anchor.current;if(!btn||!matchMedia(FINE).matches)return;
  let target:string|null=null,hideTimer:ReturnType<typeof setTimeout>|undefined;
  const place=(h:HTMLElement,id:string)=>{
   const r=h.getBoundingClientRect();target=id;clearTimeout(hideTimer);
   btn.style.left=`${r.left+scrollX-34}px`;btn.style.top=`${r.top+scrollY+Math.min(r.height,60)/2-14}px`;btn.classList.add('on');
  };
  const over=(e:PointerEvent)=>{
   const t=e.target as Element;
   if(t.closest('.gb-anchor'))return clearTimeout(hideTimer);
   const h=t.closest<HTMLElement>('main section[id] h2, main [id] > h2, main [id] > .container h2');
   const id=h?.closest('[id]')?.id;
   if(h&&id&&!h.closest('.reader-shell,dialog')&&h.getBoundingClientRect().left>40)place(h,id);
   else{clearTimeout(hideTimer);hideTimer=setTimeout(()=>btn.classList.remove('on'),300)}
  };
  const click=async()=>{
   if(!target)return;
   const url=`${location.origin}${location.pathname}#${target}`;
   try{await navigator.clipboard.writeText(url);toast('Link to this section copied.')}catch{toast(url)}
  };
  document.addEventListener('pointerover',over);btn.addEventListener('click',click);
  return()=>{document.removeEventListener('pointerover',over);btn.removeEventListener('click',click);btn.classList.remove('on')};
 },[pathname]);

 return <>
  <div ref={peekEl} className="gb-peek" aria-hidden="true"><img alt="" decoding="async"/></div>
  <button ref={anchor} className="gb-anchor" type="button" aria-label="Copy a link to this section" tabIndex={-1}>#</button>
 </>;
}
