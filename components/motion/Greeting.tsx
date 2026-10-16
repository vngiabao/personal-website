'use client';
import {useEffect,useState} from 'react';

/**
 * The hero's hello reads the room: the time of day where the visitor is, and
 * whether they have been here before. Server-rendered as the plain hello.
 */
export function Greeting(){
 const [text,setText]=useState('Hi, I’m G. Bao Vo.');
 useEffect(()=>{
  let last:number|null=null;
  try{last=Number(localStorage.getItem('gb-last-visit'))||null;localStorage.setItem('gb-last-visit',String(Date.now()))}catch{}
  const hour=new Date().getHours();
  if(last&&Date.now()-last>6*36e5){setText('Welcome back. Good to see you again.');return}
  if(last)return;
  setText(hour<5?'Up late? I’m G. Bao Vo.':hour<12?'Good morning. I’m G. Bao Vo.':hour<18?'Good afternoon. I’m G. Bao Vo.':'Good evening. I’m G. Bao Vo.');
 },[]);
 return <>{text}</>;
}
