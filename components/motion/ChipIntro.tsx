'use client';
/**
 * The first-visit intro: the Path, run as silicon.
 *
 * The camera trails a brass signal low across a die whose macro blocks are
 * the chapters of the Path. Each chapter gets a title card, set large like a
 * film's chapter title, the moment the signal nears its block, and it holds
 * until the next. Then the camera rises to the whole chip, settles low; the
 * die sinks into shadow, only the A Story core keeps its light, the GB mark is
 * written in with its brass period, and the name, a plain welcome and one line
 * about him settle beneath it; the thesis is left for the hero to say. The cover lifts off the hero, which starts its
 * own entrance as it goes.
 *
 * three.js is imported only here, on demand. If WebGL or the import fails,
 * `onFail` hands over to the card intro. The Skip button or Escape jumps to
 * the lift; a stray click does not.
 */
import {useLayoutEffect,useRef,useState} from 'react';
import {gsap,EASE} from '@/lib/motion';
import {releaseIntro} from './introSignal';
import {STOPS,BLOCK_T} from './chip/dieArt';
import type {ChipState} from './chip/chipScene';
import {BrandMark} from '@/components/brand/Brand';

/** A card appears this far (in route progress) before its block is reached. */
const LEAD=.05;

export function ChipIntro({onDone,onFail}:{onDone:()=>void;onFail:()=>void}){
 const root=useRef<HTMLDivElement>(null);
 const canvas=useRef<HTMLCanvasElement>(null);
 const [ready,setReady]=useState(false);

 useLayoutEffect(()=>{
  const html=document.documentElement,el=root.current,cv=canvas.current;
  if(!el||!cv)return;
  html.classList.remove('intro');
  html.style.overflow='hidden';
  let disposed=false,scene:{dispose():void}|null=null,tl:gsap.core.Timeline|null=null;
  const state:ChipState={progress:0,crane:0,settle:0,sweep:0,fade:0,dim:0,core:0};
  const q=gsap.utils.selector(el);

  const finish=()=>{html.style.overflow='';onDone()};
  const skip=(e:Event)=>{if(e instanceof KeyboardEvent&&e.key!=='Escape')return;if(tl&&tl.time()<tl.labels.lift)tl.seek(tl.labels.lift-.01,false)};

  (async()=>{
   try{
    await document.fonts?.ready; // die markings are set in the site's own faces
    const {createChipScene}=await import('./chip/chipScene');
    if(disposed)return;
    scene=createChipScene(cv,state,{small:matchMedia('(max-width: 767px)').matches});
   }catch{if(!disposed){html.style.overflow='';onFail()}return}
   try{sessionStorage.setItem('bao-intro-seen','1')}catch{/* private mode: may replay, harmless */}
   setReady(true);

   // Title cards: the outgoing one lifts away, the incoming one rises from a mask.
   const cards=q('.chip-card') as HTMLElement[];
   gsap.set(cards,{autoAlpha:0});
   let shown=-1;
   const chapter=(i:number)=>{
    if(i===shown)return;
    const prev=cards[shown],next=cards[i];shown=i;
    if(prev)gsap.to(prev,{autoAlpha:0,y:-18,duration:.55,ease:'power2.in',overwrite:true});
    gsap.set(next,{autoAlpha:1,y:0});
    gsap.fromTo(next.querySelectorAll('.chip-card-name > span, .chip-card-meta'),{yPercent:110,opacity:0},{yPercent:0,opacity:1,duration:1.1,ease:EASE,stagger:.08,delay:prev?.25:0,overwrite:true});
   };
   const name=q('.chip-name > span')[0] as HTMLElement|undefined;
   tl=gsap.timeline({onComplete:finish});
   tl.to(state,{fade:1,duration:1.1,ease:'power2.out'},0)
    .from(q('.chip-skip'),{opacity:0,duration:1,ease:'sine.out'},.6)
    // I — the signal runs the Path; the camera trails it low.
    .to(state,{progress:1,duration:5.6,ease:'power1.inOut',onUpdate:()=>{
      let i=-1;BLOCK_T.forEach((t,k)=>{if(state.progress>=t-LEAD)i=k});if(i>=0)chapter(i);
     }},.4)
    .to(state,{sweep:1,duration:4.2,ease:'sine.inOut'},1.2)
    // II — rise to the whole die; the last card leaves.
    .to(state,{crane:1,duration:1.5,ease:'power2.inOut'},5.9)
    .to(q('.chip-cards'),{autoAlpha:0,duration:.6,ease:'power2.in'},6.2)
    // III — settle low; the die sinks into shadow; only A Story keeps its light.
    .to(state,{settle:1,duration:1.8,ease:'power2.inOut'},7.1)
    .to(state,{dim:1,duration:1.6,ease:'sine.inOut'},7.2)
    .to(state,{core:1,duration:1.4,ease:'sine.out'},7.3)
    // The GB mark is written in, left to right like a pen; its brass period
    // lands last. Then the name settles beneath it, the welcome, the bio line.
    .fromTo(q('.chip-mark'),{clipPath:'inset(-10% 100% -10% 0%)'},{clipPath:'inset(-10% 0% -10% 0%)',duration:1.9,ease:'power2.inOut'},7.4)
    .from(q('.chip-mark circle'),{opacity:0,scale:.5,transformOrigin:'50% 50%',duration:.8,ease:'expo.out'},9.05)
    .fromTo(name??[],{letterSpacing:'.7em',opacity:0},{letterSpacing:'.32em',opacity:1,duration:1.6,ease:'expo.out'},8.3)
    .from(q('.chip-keyline'),{scaleX:0,duration:1.1,ease:'expo.inOut'},8.7)
    .from(q('.chip-thesis'),{opacity:0,y:8,duration:1,ease:'sine.out'},9.0)
    .from(q('.chip-bio'),{opacity:0,y:6,duration:1,ease:'sine.out'},9.5)
    // Long enough to read the welcome and the line about him.
    .addLabel('lift',11)
    .add(()=>releaseIntro(),'lift')
    .to(q('.chip-centre, .chip-skip'),{opacity:0,y:-24,duration:.8,ease:'sine.in'},'lift')
    .to(el,{clipPath:'inset(0% 0% 100% 0%)',duration:1.35,ease:'power3.inOut'},'lift+=.1');
   // Development only: ?chip-at=3.2 freezes the timeline at that moment for review.
   if(process.env.NODE_ENV!=='production'){const at=new URLSearchParams(location.search).get('chip-at');if(at)tl.pause(parseFloat(at),false)}
  })();

  // A stray click must not end it: only the Skip button or Escape does.
  const button=el.querySelector<HTMLButtonElement>('.chip-skip');
  button?.addEventListener('click',skip);window.addEventListener('keydown',skip);
  return()=>{disposed=true;tl?.kill();scene?.dispose();button?.removeEventListener('click',skip);window.removeEventListener('keydown',skip);html.style.overflow=''};
 },[onDone,onFail]);

 return <div className="chip-intro" ref={root} data-ready={ready}>
  <canvas ref={canvas} className="chip-canvas" aria-hidden="true"/>
  <div className="chip-cards" aria-hidden="true">{STOPS.map((s,i)=><div key={s.label} className="chip-card">
   <p className="chip-card-meta"><span>{String(i+1).padStart(2,'0')}</span>{s.year} · {s.tag}</p>
   <p className="chip-card-name"><span>{s.label}</span></p>
  </div>)}</div>
  <div className="chip-centre" aria-hidden="true">
   <BrandMark className="chip-mark"/>
   <p className="chip-name"><span>Bao Vo</span></p>
   <span className="chip-keyline"/>
   <p className="chip-thesis">Welcome to my corner.</p>
   <p className="chip-bio">Engineer · Founder · Ann Arbor, by way of Vietnam</p>
  </div>
  <button type="button" className="chip-skip">Skip intro</button>
 </div>;
}
