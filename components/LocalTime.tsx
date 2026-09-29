'use client';
import {useEffect,useState} from 'react';

const format=new Intl.DateTimeFormat('en-US',{timeZone:'America/Detroit',hour:'numeric',minute:'2-digit',timeZoneName:'short'});

/** Bao's local time; the place is server-rendered, the clock joins after hydration. */
export function LocalTime(){
 const [now,setNow]=useState<string|null>(null);
 useEffect(()=>{
  const tick=()=>setNow(format.format(new Date()));
  tick();
  const id=setInterval(tick,20_000);
  return()=>clearInterval(id);
 },[]);
 return <p className="footer-clock"><span className="live-dot" aria-hidden="true"/>Ann Arbor, Michigan{now&&<><span aria-hidden="true"> · </span><time>{now}</time></>}</p>;
}
