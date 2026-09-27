'use client';
import {useEffect,useState} from 'react';
export function SectionNav({items,label}:{items:string[][];label:string}){
 const [active,setActive]=useState(items[0][0]);
 useEffect(()=>{let frame=0;const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const current=items.map(([id])=>document.getElementById(id)).filter(el=>el&&el.getBoundingClientRect().top<190).at(-1);setActive(current?.id||items[0][0])})};window.addEventListener('scroll',update,{passive:true});update();return()=>{window.removeEventListener('scroll',update);cancelAnimationFrame(frame)}},[items]);
 return <nav className="section-navigation" aria-label={label}><div className="container">{items.map(([id,title])=><a key={id} href={`#${id}`} aria-current={active===id?'location':undefined}>{title}</a>)}</div></nav>
}
