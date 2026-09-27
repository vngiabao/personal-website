'use client';
import {useEffect,useRef} from 'react';
/** Editorial geometry, never measured data. SSR retains the resting composition. */
export function SignalPath({d,from,viewBox,className,duration=900,children}:{d:string;from?:string;viewBox:string;className?:string;duration?:number;children?:React.ReactNode}){
 const svg=useRef<SVGSVGElement>(null),route=useRef<SVGPathElement>(null),point=useRef<SVGCircleElement>(null);
 useEffect(()=>{
  const element=svg.current,path=route.current,dot=point.current;if(!element||!path||!dot)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,elapsed=0,previous=0,visible=false,started=false,done=false;
  const length=path.getTotalLength();const start=from?.match(/-?\d+(?:\.\d+)?/g)?.map(Number);const end=d.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
  const draw=(progress:number)=>{if(start&&end&&start.length===end.length){let index=0;const ease=1-Math.pow(1-progress,3);path.setAttribute('d',d.replace(/-?\d+(?:\.\d+)?/g,()=>{const i=index++;return String(start[i]+(end[i]-start[i])*ease)}))}const currentLength=path.getTotalLength();const p=path.getPointAtLength(currentLength*progress);dot.setAttribute('cx',String(p.x));dot.setAttribute('cy',String(p.y));path.style.strokeDashoffset=from?'0':String(length*(1-progress))};
  function settle(){done=true;cancelAnimationFrame(frame);path!.style.strokeDasharray='none';draw(1);element!.dataset.settled='true'}
  function tick(now:number){if(done||!visible||document.hidden)return;elapsed+=previous?now-previous:0;previous=now;draw(Math.min(1,elapsed/duration));if(elapsed>=duration)settle();else frame=requestAnimationFrame(tick)}
  function resume(){cancelAnimationFrame(frame);previous=0;if(reduced.matches){settle();return}if(visible&&!document.hidden&&!done){if(!started){started=true;path!.style.strokeDasharray=from?'none':String(length);draw(0)}frame=requestAnimationFrame(tick)}}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume()},{threshold:.35});observer.observe(element);
  document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);if(reduced.matches)settle();
  return()=>{observer.disconnect();cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',resume);reduced.removeEventListener('change',resume)};
 },[d,from,duration]);
 const tail=d.trim().match(/([\d.]+)[ ,]+([\d.]+)$/);
 return <svg ref={svg} viewBox={viewBox} className={className} aria-hidden="true" fill="none" data-signal="editorial">{children}<path d={d} stroke="currentColor" strokeOpacity=".24" vectorEffect="non-scaling-stroke"/><path ref={route} d={d} stroke="currentColor" strokeOpacity=".55" vectorEffect="non-scaling-stroke"/><circle ref={point} cx={tail?.[1]??0} cy={tail?.[2]??0} r="3" fill="var(--maize)" stroke="var(--blue)" strokeWidth="1"/></svg>
}
