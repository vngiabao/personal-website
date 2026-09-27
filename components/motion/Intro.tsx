'use client';
/**
 * The first-visit intro: the path so far, run once as a title card.
 *
 * Set in the site's own materials, not A Story's: Michigan navy ground, cream
 * type, brass for what is live. The wordmark rises with its brass period;
 * beneath it the chapter name rolls through the seven stops of the Path —
 * Michigan to A Story — while the year runs 2019 → Today along a trace whose
 * vias fill in brass as they are passed (silicon, read as a timeline). Then
 * the whole card lifts off the hero, which starts its own entrance as it goes.
 * The hero states the thesis ("From silicon to strategy."); the intro only
 * tells the path, so nothing is said twice.
 *
 * THE COVER IS PAINTED BEFORE REACT BOOTS. The inline script in app/layout.tsx
 * adds `html.intro` (first home visit per session, motion allowed), and a CSS
 * rule in app/motion.css paints navy at once, so the prerendered hero never
 * flashes underneath. This component takes over that cover and must always
 * remove the class. The inline script has its own timeout in case this
 * bundle never arrives. Click, tap or Escape skips to the lift.
 */
import {useLayoutEffect,useRef,useState} from 'react';
import {gsap,EASE} from '@/lib/motion';
import {releaseIntro} from './introSignal';

const SEEN='bao-intro-seen';
/** The seven stops of the Path, in order; the year is where each begins. */
const STOPS=[
 {label:'Michigan',year:2019},
 {label:'Peterson Lab',year:2022},
 {label:'Circuit design',year:2023},
 {label:'Faraday',year:2024},
 {label:'WICS',year:2024},
 {label:'miLEAD',year:2024},
 {label:'A Story',year:2026},
];
const LAST=STOPS.length-1;
const at=(i:number)=>i/LAST*100;

export function Intro(){
 // Rendered as nothing on the server and at hydration; the layout effect
 // below swaps the painted cover for this one before the first paint.
 const [active,setActive]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 const year=useRef<HTMLSpanElement>(null);

 useLayoutEffect(()=>{
  const html=document.documentElement;
  if(html.classList.contains('intro')&&matchMedia('(prefers-reduced-motion: no-preference)').matches)setActive(true);
  else{html.classList.remove('intro');releaseIntro()}
 },[]);

 useLayoutEffect(()=>{
  const html=document.documentElement;
  const el=root.current;
  if(!active||!el)return;
  try{sessionStorage.setItem(SEEN,'1')}catch{/* Private mode: the intro may play again, which is harmless. */}
  // This component's cover now stands where the painted one was.
  html.classList.remove('intro');
  html.style.overflow='hidden';

  const q=gsap.utils.selector(el);
  const vias=q('.intro-via') as HTMLElement[];
  const reel=q('.intro-reel')[0] as HTMLElement;
  const run={stop:0};
  let shown=0;

  // A context, so cleanup reverts every from() — StrictMode's rehearsal run
  // would otherwise leave the contents hidden.
  const ctx=gsap.context(()=>{
   const tl=gsap.timeline({onComplete:()=>{html.style.overflow='';setActive(false)}});
   tl.from(q('.intro-eyebrow'),{y:14,opacity:0,duration:.9,ease:EASE},.1)
    .from(q('.intro-name > span'),{yPercent:110,duration:1.3,ease:EASE,stagger:.06},.15)
    .from(q('.intro-keyline'),{scaleX:0,duration:1,ease:'expo.inOut'},.45)
    .from(q('.intro-window'),{y:18,opacity:0,duration:1,ease:EASE},.6)
    .from(q('.intro-foot'),{opacity:0,duration:.8},.6)
    .to(run,{stop:LAST,duration:2.9,ease:'power1.inOut',onUpdate:()=>{
     const s=run.stop,i=Math.floor(s+.001),f=s-i;
     const from=STOPS[i].year,to=STOPS[Math.min(i+1,LAST)].year;
     if(year.current)year.current.textContent=String(Math.round(from+(to-from)*f));
     vias.forEach((v,n)=>v.classList.toggle('passed',n<=s+.001));
     // The chapter name rolls to each stop as the trace reaches it.
     const next=Math.round(s);
     if(next!==shown){shown=next;gsap.to(reel,{yPercent:-100*next/STOPS.length,duration:.55,ease:'expo.out'})}
    }},.9)
    .to(q('.intro-fill'),{scaleX:1,duration:2.9,ease:'power1.inOut'},.9)
    .fromTo(q('.intro-bead'),{left:'0%'},{left:'100%',duration:2.9,ease:'power1.inOut'},.9)
    .add(()=>{if(year.current)year.current.textContent='Today'})
    .addLabel('lift','+=.45')
    .add(()=>releaseIntro(),'lift')
    .to(q('.intro-centre, .intro-foot'),{y:-40,opacity:0,duration:.8,ease:'power2.in'},'lift')
    .to(el,{clipPath:'inset(0% 0% 100% 0%)',duration:1.15,ease:'expo.inOut'},'lift+=.1');

   const skip=(e:Event)=>{if(e instanceof KeyboardEvent&&e.key!=='Escape')return;if(tl.time()<tl.labels.lift)tl.seek(tl.labels.lift-.01,false)};
   el.addEventListener('pointerdown',skip);window.addEventListener('keydown',skip);
   return()=>{el.removeEventListener('pointerdown',skip);window.removeEventListener('keydown',skip)};
  },el);

  // No releaseIntro() in cleanup: StrictMode's rehearsal unmount would start
  // the hero under a cover that is about to be rebuilt.
  return()=>{ctx.revert();html.style.overflow=''};
 },[active]);

 if(!active)return null;
 return <div className="site-intro" ref={root} aria-hidden="true">
  <span className="intro-frame"/>
  <div className="intro-centre">
   <p className="intro-eyebrow">Founder · Strategist · Builder</p>
   <p className="intro-name"><span>Bao Vo<b>.</b></span></p>
   <span className="intro-keyline"/>
   <p className="intro-window"><span className="intro-reel">{STOPS.map(s=><span key={s.label}>{s.label}</span>)}</span></p>
  </div>
  <div className="intro-foot">
   <div className="intro-row"><span>The path so far · Ann Arbor, Michigan</span><span className="intro-year" ref={year}>{STOPS[0].year}</span></div>
   <div className="intro-trace">
    <span className="intro-track"/>
    <span className="intro-fill"/>
    {STOPS.map((s,i)=><span key={s.label} className={'intro-via'+(i===0?' first':i===LAST?' last':'')} style={{left:`${at(i)}%`}}><i/><small>{s.label}</small></span>)}
    <span className="intro-bead"/>
   </div>
  </div>
 </div>;
}
