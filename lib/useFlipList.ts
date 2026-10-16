'use client';
import {useEffect,useLayoutEffect,useRef} from 'react';
import {gsap,plugins,whenNear,MOTION} from './motion';

/**
 * A React list that glides between filters instead of jumping (GSAP Flip).
 * Call the returned `capture()` just before the state change that re-filters
 * or re-orders the list: rows that stay slide to their new places, rows that
 * arrive rise in behind them. Keyed rows keep their DOM nodes, so Flip can
 * match each row to itself. Reduced motion: the list simply changes.
 */
export function useFlipList(list:React.RefObject<HTMLElement|null>,change:unknown){
 const flip=useRef<typeof Flip|null>(null);
 const state=useRef<Flip.FlipState|null>(null);
 useEffect(()=>{
  const el=list.current;
  if(!el||!matchMedia(MOTION.motion).matches)return;
  let alive=true;
  const stop=whenNear(el,()=>plugins.flip().then(F=>{if(alive)flip.current=F}));
  return()=>{alive=false;stop()};
 },[]);
 useLayoutEffect(()=>{
  const F=flip.current,from=state.current,el=list.current;
  state.current=null;
  if(!F||!from||!el)return;
  const rows=[...el.children] as HTMLElement[];
  const glide=F.from(from,{targets:rows,duration:.6,ease:'power3.inOut',prune:true,
   onEnter:arrived=>gsap.fromTo(arrived,{opacity:0,y:16},{opacity:1,y:0,duration:.5,ease:'power3.out',stagger:.035,delay:.12,clearProps:'transform,opacity'})});
  return()=>{glide.progress(1).kill()};
 },[change]);// eslint-disable-line react-hooks/exhaustive-deps
 return ()=>{
  const F=flip.current,el=list.current;if(!F||!el)return;
  // Rows still waiting below the fold for their entrance are finished first:
  // Flip hands each row back its recorded inline style when the glide ends,
  // and a row recorded mid-entrance would be handed back hidden.
  const rows=[...el.children];
  gsap.killTweensOf(rows);gsap.set(rows,{clearProps:'transform,opacity'});
  state.current=F.getState(rows);
 };
}
