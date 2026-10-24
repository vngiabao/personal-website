'use client';
/** One phrase at a time, rolling up from behind a mask (Binder-style). Static first phrase without motion. */
import {useEffect,useRef,useState} from 'react';
import {gsap} from '@/lib/motion';

export function RotatingWords({words,className=''}:{words:string[];className?:string}){
 const [i,setI]=useState(0);
 const box=useRef<HTMLSpanElement>(null);
 useEffect(()=>{
  if(!matchMedia('(prefers-reduced-motion: no-preference)').matches)return;
  const id=setInterval(()=>setI(n=>(n+1)%words.length),2600);
  return()=>clearInterval(id);
 },[words.length]);
 useEffect(()=>{
  const el=box.current?.querySelector<HTMLElement>('.rw-word');if(!el||!box.current)return;
  gsap.fromTo(el,{yPercent:105,opacity:0},{yPercent:0,opacity:1,duration:.7,ease:'expo.out'});
  gsap.to(box.current,{width:el.offsetWidth,duration:.6,ease:'expo.out'});
 },[i]);
 return <span ref={box} className={`rotating-words ${className}`} aria-live="off"><span key={i} className="rw-word" aria-hidden="true">{words[i]}</span><span className="sr-only">{words[0]}</span></span>;
}
