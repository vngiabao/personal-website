'use client';
import {useEffect,useState} from 'react';

const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Detroit',hour:'numeric',minute:'2-digit',weekday:'long',hour12:true});
const hour24=new Intl.DateTimeFormat('en-US',{timeZone:'America/Detroit',hour:'numeric',hour12:false});

/** What a message sent right now can expect, told by the clock in Ann Arbor. */
function note(now:Date){
 const p=Object.fromEntries(parts.formatToParts(now).map(x=>[x.type,x.value]));
 const time=`${p.hour}:${p.minute} ${p.dayPeriod}`,h=Number(hour24.format(now))%24,day=p.weekday;
 const weekend=day==='Saturday'||day==='Sunday';
 if(h<6)return `It’s ${time} in Ann Arbor, so I’m probably asleep. I’ll reply in the morning.`;
 if(weekend)return `It’s ${day} in Ann Arbor. Replies are a little slower on weekends, but they come.`;
 if(h<9)return `It’s ${time} in Ann Arbor. My day is just starting.`;
 if(h<18)return `It’s ${time} in Ann Arbor. I usually reply within a day.`;
 return `It’s ${time} in Ann Arbor. I’ll likely reply tomorrow.`;
}

export function ReplyClock(){
 const [text,setText]=useState<string|null>(null);
 useEffect(()=>{const tick=()=>setText(note(new Date()));tick();const id=setInterval(tick,30_000);return()=>clearInterval(id)},[]);
 return text?<p className="reply-clock"><span className="live-dot" aria-hidden="true"/>{text}</p>:null;
}
