'use client';
/** One phrase at a time, rolling up from behind a mask (Binder-style). Static first phrase without motion.
 * Every phrase sits in the same grid cell, so the box is always the size of the longest one and
 * the text around it never moves. */
import {useEffect,useRef,useState} from 'react';
import {gsap} from '@/lib/motion';

export function RotatingWords({words,className=''}:{words:string[];className?:string}){
 const [i,setI]=useState(0);
 const box=useRef<HTMLSpanElement>(null),first=useRef(true);
 useEffect(()=>{
  if(!matchMedia('(prefers-reduced-motion: no-preference)').matches)return;
  const id=setInterval(()=>setI(n=>(n+1)%words.length),2600);
  return()=>clearInterval(id);
 },[words.length]);
 useEffect(()=>{
  const el=box.current?.querySelector<HTMLElement>('.rw-word[data-on="true"]');if(!el)return;
  if(first.current){first.current=false;return}
  gsap.fromTo(el,{yPercent:105,opacity:0},{yPercent:0,opacity:1,duration:.7,ease:'expo.out'});
 },[i]);
 return <span ref={box} className={`rotating-words ${className}`} aria-live="off">{words.map((w,n)=><span key={n} className="rw-word" data-on={n===i} aria-hidden="true">{w}</span>)}<span className="sr-only">{words[0]}</span></span>;
}
