'use client';
/**
 * The GB, signed at the close of the letter (the "Let's talk" band).
 *
 * As the band arrives a hairline traces the mark the way a pen would: the G,
 * then the B, then the sweep through both (GSAP DrawSVG). The ink floods in
 * behind the line, the line lifts away, and the brass period lands last.
 * The filled mark is the same evenodd path as the logo, so the finished
 * signature is exactly the brand; the traced lines only ever sit on top.
 * Without motion it is simply the signed mark.
 */
import {useEffect,useRef} from 'react';
import {GB_VIEWBOX,GB_G,GB_B,GB_SWEEP,GB_LETTERS,GB_DOT} from '@/components/brand/gbPaths';
import {gsap,plugins,whenNear,MOTION} from '@/lib/motion';

export function Signature({className=''}:{className?:string}){
 const svg=useRef<SVGSVGElement>(null);
 useEffect(()=>{
  const root=svg.current;
  if(!root||!matchMedia(MOTION.motion).matches)return;
  let alive=true;
  const ctx=gsap.context(()=>{},root);
  const stop=whenNear(root,()=>plugins.draw().then(()=>{
   if(!alive)return;
   ctx.add(()=>{
    const [g,b,sweep]=gsap.utils.toArray<SVGPathElement>('.sig-line',root);
    const tl=gsap.timeline({paused:true})
     .set('.sig-ink',{opacity:0})
     .set('.sig-dot',{scale:0,transformOrigin:'50% 50%'})
     .set('.sig-line',{opacity:1,drawSVG:'0% 0%'})
     .to(g,{drawSVG:'0% 100%',duration:1.25,ease:'power1.inOut'})
     .to(b,{drawSVG:'0% 100%',duration:1,ease:'power1.inOut'},'-=.25')
     .to(sweep,{drawSVG:'0% 100%',duration:.7,ease:'power2.inOut'},'-=.2')
     .to('.sig-ink',{opacity:1,duration:1,ease:'power2.inOut'},'-=.35')
     .to('.sig-line',{opacity:0,duration:.9,ease:'power1.out'},'<.35')
     .to('.sig-dot',{scale:1,duration:.55,ease:'back.out(2.4)'},'<.1');
    // Signed when it is really in view. Its own observer, not a ScrollTrigger:
    // photographs above it can still be loading, and a cached scroll position
    // would sign it before the reader gets there.
    const seen=new IntersectionObserver(([e])=>{if(e.isIntersecting){tl.play();seen.disconnect()}},{threshold:.75});
    seen.observe(root);
    return()=>seen.disconnect();
   });
  }));
  return()=>{alive=false;stop();ctx.revert()};
 },[]);
 return <svg ref={svg} className={`signature ${className}`} viewBox={GB_VIEWBOX} aria-hidden="true" focusable="false">
  <path className="sig-ink" d={GB_LETTERS} fill="currentColor" fillRule="evenodd"/>
  {[GB_G,GB_B,GB_SWEEP].map((d,i)=><path key={i} className="sig-line" d={d} fill="none" stroke="var(--sig-line, #e8c064)" strokeWidth="1.3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity="0"/>)}
  <circle className="sig-dot" cx={GB_DOT.cx} cy={GB_DOT.cy} r={GB_DOT.r} fill="var(--brand-dot, #b58420)"/>
 </svg>;
}
