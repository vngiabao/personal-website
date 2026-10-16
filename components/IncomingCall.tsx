'use client';
/**
 * The product, in its own gesture: a few seconds after the A Story page
 * opens, the phone in the hero rings. Answer and you are taken to the
 * conversation; "Later" and it promises to call back, which is what the
 * product actually does. Once per visit.
 */
import {useEffect,useState} from 'react';

export function IncomingCall(){
 const [state,setState]=useState<'idle'|'ringing'|'later'|'gone'>('idle');
 useEffect(()=>{
  try{if(sessionStorage.getItem('gb-call-seen'))return}catch{}
  const t=setTimeout(()=>setState('ringing'),2600);
  return()=>clearTimeout(t);
 },[]);
 useEffect(()=>{
  if(state==='later'){const t=setTimeout(()=>setState('gone'),2600);return()=>clearTimeout(t)}
  if(state==='ringing')try{sessionStorage.setItem('gb-call-seen','1')}catch{}
 },[state]);
 if(state==='idle'||state==='gone')return null;
 const answer=()=>{setState('gone');document.getElementById('listen')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})};
 return <div className={`incoming-call ${state}`} role="status" aria-live="polite">
  {state==='ringing'?<>
   <span className="call-avatar" aria-hidden="true">A</span>
   <span className="call-text"><b>A Story</b><small>Tuesday, 7:00 PM</small></span>
   <span className="call-actions">
    <button className="call-later" onClick={()=>setState('later')} aria-label="Later: A Story will call back">Later</button>
    <button className="call-answer" onClick={answer} aria-label="Answer: hear the conversation">Answer</button>
   </span>
  </>:<span className="call-text"><b>No problem.</b><small>A Story will call back tomorrow.</small></span>}
 </div>;
}
