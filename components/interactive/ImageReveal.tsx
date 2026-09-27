'use client';
import {useEffect,useRef} from 'react';
export function ImageReveal({children}:{children:React.ReactNode}){
 const element=useRef<HTMLDivElement>(null);
 useEffect(()=>{const node=element.current;if(!node||matchMedia('(prefers-reduced-motion: reduce)').matches)return;let animation:Animation|undefined;
  const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){animation=node.animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:400,easing:'cubic-bezier(.2,.7,.2,1)'});observer.disconnect()}},{threshold:.2});observer.observe(node);
  return()=>{observer.disconnect();animation?.cancel()};
 },[]);
 return <div ref={element}>{children}</div>
}
