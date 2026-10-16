'use client';
import {useRef,useState} from 'react';

/** Copies the address; the envelope seals with a brass dot to say it worked. */
export function CopyEmail(){
 const [state,setState]=useState<'idle'|'copied'|'manual'>('idle');
 const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const copy=async()=>{
  try{await navigator.clipboard.writeText('gbao.n.vo@gmail.com');setState('copied')}catch{setState('manual')}
  clearTimeout(timer.current);timer.current=setTimeout(()=>setState('idle'),2800);
 };
 return <div className="copy-email" data-state={state}>
  <button onClick={copy}>
   <svg className="copy-envelope" viewBox="0 0 28 20" aria-hidden="true"><rect x="1" y="1" width="26" height="18" rx="2"/><path className="flap" d="M1.5 2 14 11 26.5 2"/><circle className="seal" cx="14" cy="11" r="3.2"/></svg>
   {state==='copied'?'Copied. Say hello.':'Copy email address'}
  </button>
  <span className="small" role="status">{state==='copied'?'Email copied.':state==='manual'?'Select the email address above to copy it.':''}</span>
 </div>;
}
