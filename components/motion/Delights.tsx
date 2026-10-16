'use client';
/**
 * Small, smart details: things that notice what the reader is doing.
 *
 *  · The companion: the brass period from the GB mark follows the pointer
 *    like a pet, settles when the hand rests, and when the pointer rests on
 *    a headline it hops onto that headline's full stop, so the sentence
 *    ends in brass. "." turns it off or on.
 *  · The seal: a click on bare paper presses the GB into it, blind-embossed
 *    on cream, brass foil on navy cloth, and the paper slowly lets it go.
 *  · Keys: "?" lists them; g then h/w/s/a/r/c/b moves between pages; "/"
 *    searches the Archive; "c" copies the email address.
 *  · Quotes: select a sentence and copy it with attribution and a link that
 *    highlights that exact sentence when opened.
 *  · The Book keeps your place in the tab title while you are away.
 *  · A note in the console for the curious.
 *
 * All decorative motion waits for a fine pointer and no reduced-motion
 * preference; everything is pointer-events: none unless it is a control.
 */
import {useCallback,useEffect,useRef,useState} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import {gsap} from '@/lib/motion';
import {site} from '@/content/site';

const FINE='(hover: hover) and (pointer: fine)';
const CALM='(prefers-reduced-motion: no-preference)';
const INTERACTIVE='a,button,input,select,textarea,label,summary,details,[role=button],[contenteditable],dialog,video,audio,.reader-shell,.archive-cards,.chronology-stops,.book-stage';
/** Surfaces that are objects, not paper: no seal is pressed onto them. */
const OBJECTS='.plate,figure,img,picture,svg,canvas,.photo,.project-preview,.career-stage,.work-lenses,.st-phone,.story-showcase,.archive-records,.proof-point,table,pre,code,.program-badges';
const NAVY='section.blue,.contact-close,.case-next,.case-chapter-result,.home-book-section,main.book-page,.site-footer.dark';
const PAGES:Record<string,[string,string]>={h:['/','Home'],w:['/work','Work'],s:['/a-story','A Story'],a:['/about','About'],r:['/archive','Archive'],c:['/contact','Contact'],b:['/book','The Book']};
const store={get:(k:string)=>{try{return localStorage.getItem(k)}catch{return null}},set:(k:string,v:string)=>{try{localStorage.setItem(k,v)}catch{}}};

let greeted=false;
function consoleNote(){
 if(greeted)return;greeted=true;
 console.log('%cGB.%c\n\nHi, curious one. You found the back room.\nIf you are building something difficult, I would like to hear about it: '+site.email+'\n\nPress ? on the page for a few shortcuts.',
  'font:italic 600 34px Georgia,serif;color:#00274c','font:14px/1.6 system-ui,sans-serif;color:#545f6b');
}

/** Where a headline's final full stop is drawn, so the companion can sit on it. */
function periodOf(h:HTMLElement){
 const walker=document.createTreeWalker(h,NodeFilter.SHOW_TEXT);
 let last:Text|null=null;
 for(let n=walker.nextNode();n;n=walker.nextNode())if((n.textContent??'').trim())last=n as Text;
 if(!last)return null;
 const text=last.textContent!;const i=text.trimEnd().length-1;
 if(text[i]!=='.')return null;
 const range=document.createRange();range.setStart(last,i);range.setEnd(last,i+1);
 const rects=range.getClientRects();const rect=rects[rects.length-1];if(!rect||!rect.width)return null;
 const cs=getComputedStyle(last.parentElement!);
 const ctx=document.createElement('canvas').getContext('2d')!;
 ctx.font=`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
 const stretch=parseFloat(cs.fontStretch)||100;
 ctx.fontStretch=(stretch<=81?'condensed':stretch<=93?'semi-condensed':stretch<=106?'normal':stretch<=118?'semi-expanded':'expanded') as CanvasFontStretch;
 const m=ctx.measureText('.');
 const baseline=rect.top+(m.fontBoundingBoxAscent||parseFloat(cs.fontSize)*.8)*(rect.height/((m.fontBoundingBoxAscent+m.fontBoundingBoxDescent)||rect.height));
 const w=m.actualBoundingBoxRight+m.actualBoundingBoxLeft,hgt=m.actualBoundingBoxAscent+m.actualBoundingBoxDescent;
 return {x:rect.left+(m.actualBoundingBoxRight-m.actualBoundingBoxLeft)/2,y:baseline-(m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2,size:Math.max(w,hgt)*1.18};
}

export function Delights(){
 const router=useRouter();const pathname=usePathname();
 const [panel,setPanel]=useState(false);
 const [toast,setToast]=useState('');
 const [quote,setQuote]=useState<{x:number;y:number;text:string}|null>(null);
 const [companion,setCompanion]=useState(true);
 const dot=useRef<HTMLDivElement>(null);
 const seals=useRef<HTMLDivElement>(null);
 const toastTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);

 const say=useCallback((message:string)=>{setToast(message);clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),2600)},[]);
 const copyEmail=useCallback(async()=>{try{await navigator.clipboard.writeText(site.email);say('Email address copied. Say hello.')}catch{say(site.email)}},[say]);

 useEffect(()=>{consoleNote();setCompanion(store.get('gb-companion')!=='off')},[]);

 // ── The companion ─────────────────────────────────────────────────────
 useEffect(()=>{
  const el=dot.current;
  if(!el||!companion||!matchMedia(FINE).matches||!matchMedia(CALM).matches)return;
  const x=gsap.quickTo(el,'x',{duration:.55,ease:'power3'}),y=gsap.quickTo(el,'y',{duration:.55,ease:'power3'});
  const size=(s:number,d=.35)=>gsap.to(el,{width:s,height:s,duration:d,ease:'power3.out',overwrite:'auto'});
  let px=-100,py=-100,seated:HTMLElement|null=null,shown=false;
  let rest:ReturnType<typeof setTimeout>|undefined,sleep:ReturnType<typeof setTimeout>|undefined;
  const wake=()=>{el.classList.remove('asleep');clearTimeout(sleep);sleep=setTimeout(()=>{if(!seated)el.classList.add('asleep')},4200)};
  const follow=()=>{seated=null;size(9);x(px+14);y(py+12)};
  const settle=()=>{
   const h=(document.elementFromPoint(px,py) as HTMLElement|null)?.closest<HTMLElement>('main h1,main h2,main h3');
   if(!h)return;
   const p=periodOf(h);if(!p)return;
   seated=h;el.classList.remove('asleep');
   gsap.to(el,{x:p.x-p.size/2,y:p.y-p.size/2,width:p.size,height:p.size,duration:.7,ease:'back.out(1.6)',overwrite:true});
  };
  const move=(e:PointerEvent)=>{
   px=e.clientX;py=e.clientY;
   if(!shown){shown=true;gsap.set(el,{x:px+14,y:py+12});el.classList.add('on')}
   const over=(e.target as Element)?.closest?.(INTERACTIVE);
   if(seated&&Math.hypot(px-(gsap.getProperty(el,'x') as number),py-(gsap.getProperty(el,'y') as number))<60)return;
   if(over){seated=null;size(5,.25);x(px+12);y(py+10)}else follow();
   wake();clearTimeout(rest);rest=setTimeout(settle,650);
  };
  const scroll=()=>{if(seated)follow()};
  const out=()=>{el.classList.remove('on');shown=false;seated=null};
  const down=()=>gsap.fromTo(el,{scale:.55},{scale:1,duration:.5,ease:'back.out(3)'});
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('scroll',scroll,{passive:true});
  document.documentElement.addEventListener('pointerleave',out);window.addEventListener('pointerdown',down);
  return()=>{clearTimeout(rest);clearTimeout(sleep);window.removeEventListener('pointermove',move);window.removeEventListener('scroll',scroll);document.documentElement.removeEventListener('pointerleave',out);window.removeEventListener('pointerdown',down);el.classList.remove('on');gsap.killTweensOf(el)};
 },[companion,pathname]);

 // ── The seal ───────────────────────────────────────────────────────────
 useEffect(()=>{
  const layer=seals.current;if(!layer||!matchMedia(CALM).matches)return;
  let downAt={x:0,y:0};
  const down=(e:PointerEvent)=>{downAt={x:e.clientX,y:e.clientY}};
  const click=(e:MouseEvent)=>{
   const t=e.target as Element;
   if(e.button!==0||t.closest(INTERACTIVE)||t.closest(OBJECTS)||!t.closest('main,.site-footer'))return;
   if(Math.hypot(e.clientX-downAt.x,e.clientY-downAt.y)>6)return;
   if(String(getSelection()??'').trim())return;
   const foil=!!t.closest(NAVY);
   const seal=document.createElement('div');seal.className=`gb-seal${foil?' foil':''}`;seal.setAttribute('aria-hidden','true');
   seal.innerHTML='<i></i>';
   seal.style.left=`${e.pageX}px`;seal.style.top=`${e.pageY}px`;
   layer.appendChild(seal);
   while(layer.children.length>7)layer.firstElementChild?.remove();
   gsap.timeline({onComplete:()=>seal.remove()})
    .fromTo(seal,{scale:1.25,opacity:0,rotation:gsap.utils.random(-8,8)},{scale:1,opacity:1,duration:.22,ease:'power2.in'})
    .to(seal,{opacity:0,duration:1.6,ease:'power1.in'},'+=1.6');
  };
  window.addEventListener('pointerdown',down,{passive:true});window.addEventListener('click',click);
  return()=>{window.removeEventListener('pointerdown',down);window.removeEventListener('click',click)};
 },[]);
 // Seals belong to the page they were pressed into.
 useEffect(()=>{seals.current?.replaceChildren()},[pathname]);

 // ── Keys ───────────────────────────────────────────────────────────────
 useEffect(()=>{
  let prefix=0;
  const key=(e:KeyboardEvent)=>{
   const t=e.target as HTMLElement;
   if(e.ctrlKey||e.metaKey||e.altKey||t.closest('input,textarea,select,[contenteditable],dialog[open]'))return;
   if(e.key==='Escape'){setPanel(false);return}
   if(e.key==='?'){e.preventDefault();setPanel(p=>!p);return}
   if(Date.now()-prefix<1200&&PAGES[e.key]){e.preventDefault();prefix=0;setPanel(false);router.push(PAGES[e.key][0]);return}
   if(e.key==='g'){prefix=Date.now();return}
   if(e.key==='/'){e.preventDefault();const box=document.querySelector<HTMLInputElement>('.archive-search input');if(box)box.focus();else router.push('/archive?focus=search');return}
   if(e.key==='c'){copyEmail();return}
   if(e.key==='.'){setCompanion(on=>{store.set('gb-companion',on?'off':'on');say(on?'The brass period is resting. Press . to call it back.':'The brass period is back.');return !on});return}
  };
  window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
 },[router,copyEmail,say]);
 useEffect(()=>{
  if(new URLSearchParams(location.search).get('focus')==='search')requestAnimationFrame(()=>document.querySelector<HTMLInputElement>('.archive-search input')?.focus({preventScroll:true}));
 },[pathname]);

 // ── Quotes ─────────────────────────────────────────────────────────────
 useEffect(()=>{
  if(!matchMedia(FINE).matches)return;
  let timer:ReturnType<typeof setTimeout>|undefined;
  const check=()=>{
   clearTimeout(timer);
   timer=setTimeout(()=>{
    const sel=getSelection();const text=String(sel??'').replace(/\s+/g,' ').trim();
    if(!sel||sel.isCollapsed||text.length<16||text.length>480){setQuote(null);return}
    const node=sel.anchorNode?.parentElement;
    if(!node?.closest('main')||node.closest('input,textarea,.reader-shell')){setQuote(null);return}
    const r=sel.getRangeAt(0).getBoundingClientRect();
    setQuote({x:r.left+r.width/2,y:r.top+scrollY,text});
   },180);
  };
  const hide=(e:PointerEvent)=>{if(!(e.target as Element).closest('.quote-pill'))setQuote(null)};
  document.addEventListener('selectionchange',check);window.addEventListener('pointerdown',hide);
  return()=>{clearTimeout(timer);document.removeEventListener('selectionchange',check);window.removeEventListener('pointerdown',hide)};
 },[]);
 const copyQuote=async()=>{
  if(!quote)return;
  const words=quote.text.split(' ');
  const frag=words.length>8?`${encodeURIComponent(words.slice(0,4).join(' '))},${encodeURIComponent(words.slice(-4).join(' '))}`:encodeURIComponent(quote.text);
  const link=`${location.origin}${location.pathname}#:~:text=${frag}`;
  try{await navigator.clipboard.writeText(`“${quote.text}”\n— ${site.name}, ${link}`);say('Quote copied, with a link that highlights it.')}catch{say('Copy was blocked by the browser.')}
  setQuote(null);getSelection()?.removeAllRanges();
 };

 // ── The Book keeps your place in the tab ─────────────────────────────────
 useEffect(()=>{
  let saved='';
  const vis=()=>{
   const open=document.querySelector('.reader-shell[data-open=true] .reader-chapter-title small');
   if(document.hidden&&open){saved=document.title;document.title=`Bookmarked · ${open.textContent} · The Path, So Far`}
   else if(!document.hidden&&saved){document.title=saved;saved=''}
  };
  document.addEventListener('visibilitychange',vis);return()=>document.removeEventListener('visibilitychange',vis);
 },[]);

 return <>
  <div ref={dot} className="gb-companion" aria-hidden="true"/>
  <div ref={seals} className="gb-seals" aria-hidden="true"/>
  {quote&&<button className="quote-pill" style={{left:quote.x,top:quote.y}} onClick={copyQuote}>Copy quote</button>}
  <p className={`gb-toast ${toast?'on':''}`} role="status" aria-live="polite">{toast}</p>
  {panel&&<div className="gb-keys" role="dialog" aria-label="Keyboard shortcuts">
   <p className="eyebrow">Shortcuts</p>
   <dl>
    {Object.entries(PAGES).map(([k,[,label]])=><div key={k}><dt><kbd>g</kbd> <kbd>{k}</kbd></dt><dd>{label}</dd></div>)}
    <div><dt><kbd>/</kbd></dt><dd>Search the Archive</dd></div>
    <div><dt><kbd>c</kbd></dt><dd>Copy my email address</dd></div>
    <div><dt><kbd>.</kbd></dt><dd>{companion?'Rest':'Wake'} the brass period</dd></div>
    <div><dt><kbd>?</kbd></dt><dd>Show or hide this card</dd></div>
   </dl>
   <button className="gb-keys-close" onClick={()=>setPanel(false)} aria-label="Close shortcuts">Esc</button>
  </div>}
 </>;
}
