'use client';
/**
 * The Path, So Far — the interactive book.
 *
 * Reads like a printed book: a title page and a contents page open it, each
 * chapter is a spread (verso: the photograph, tipped in with photo corners;
 * recto: running head, chapter number in words, title, prose with a drop cap,
 * a closing line), and folios run 1–24 after the roman front matter.
 *
 * Mechanics are unchanged from the previous reader: the cover opens into a
 * native <dialog>; pages turn with the controls, arrow keys, Home/End or a
 * drag from a page edge (short drags settle back); every move is pushed to
 * history on /book; the Contents overlay and the scrolling view share the
 * same state; reduced motion skips the animation, and the no-JS reading is
 * the whole book as one page. On phones each page carries its photograph and
 * its text together — there is no photo/text toggle to find.
 */
import {useEffect,useRef,useState} from 'react';
import {bookChapters,bookChapterAliases} from '@/content/chapters';
import {ArrowLink,BookCover,Photo} from './Ledger';

type Chapter=(typeof bookChapters)[number];
type Mode='pages'|'scroll';
type Phase='closed'|'prepare'|'opening'|'open'|'closing';

/** Spread 0 is the front matter; spreads 1–12 are the chapters. */
const FRONT='contents';
const SPREADS=[FRONT,...bookChapters.map(c=>c.id)];
const chapterAt=(i:number):Chapter|undefined=>i>0?bookChapters[i-1]:undefined;
const labelAt=(i:number)=>chapterAt(i)?.label??'Contents';
const findSpread=(id:string|null|undefined)=>SPREADS.indexOf(bookChapterAliases[id??'']||id||'');
const ROMAN=['i','ii'];
/** Printed page numbers: roman for the front matter, then 1–24. */
const folio=(i:number,side:0|1)=>i===0?ROMAN[side]:String((i-1)*2+1+side);
/** A slight, fixed lean per print, as if each was mounted by hand. */
const TILT=[-1.1,.8,-.6,1.2,-.9,.5,-1.3,.9,-.5,.7,-1,.6];

// ── Pages ────────────────────────────────────────────────────────────────

function Print({id,sizes,className=''}:{id:string;sizes:string;className?:string}){
 return <div className={`bk-print ${className}`}><Photo id={id} sizes={sizes}/><i className="bk-corner tl"/><i className="bk-corner tr"/><i className="bk-corner bl"/><i className="bk-corner br"/></div>;
}

function Verso({i}:{i:number}){
 const c=chapterAt(i);
 if(!c)return <div className="book-left bk-title-page">
  <div className="bk-title-block">
   <p className="bk-kicker">A personal record</p>
   <p className="bk-book-title">The Path,<br/><em>So Far.</em></p>
   <span className="bk-orn" aria-hidden="true"><i/></span>
   <p className="bk-byline">Bao Vo</p>
   <p className="bk-imprint">Ann Arbor, Michigan · 2019–2026</p>
  </div>
  <p className="bk-epigraph">“From silicon to strategy.”</p>
  <span className="book-folio">{folio(i,0)}</span>
 </div>;
 let visual;
 if(c.id==='next-chapter')visual=<div className="book-map"><p className="bk-kicker">Follow a thread</p>{[['Silicon','/work/faraday-tapeout','Test, timing & delivery'],['Strategy','/work/healthcare-commercialization','Context & commercial judgment'],['Stories','/a-story','A Story, the current chapter'],['What comes next','/contact','A conversation']].map(([title,href,note],n)=><a key={title} href={href}><span>0{n+1}</span><div><strong>{title}</strong><p>{note}</p></div></a>)}<p className="bk-continued">To be continued.</p></div>;
 else if(c.id==='a-story')visual=<figure className="book-product-page"><div className="st-phone"><img src="/media/story/app/home.webp" width={786} height={1704} alt="The A Story app home screen"/></div><figcaption>The A Story app · In development</figcaption></figure>;
 else visual=<>
  <Print id={c.id==='under-a-clock'?'articulate':c.image} sizes="(max-width:767px) 86vw, 42vw"/>
  {c.id==='masters'&&<Print className="bk-second" id="wentzloff" sizes="(max-width:767px) 40vw, 16vw"/>}
 </>;
 return <div className="book-left" style={{'--tilt':`${TILT[(i-1)%TILT.length]}deg`} as React.CSSProperties}>
  <p className="bk-runhead">The Path, So Far.</p>
  <div className="bk-visual">{visual}</div>
  <span className="book-folio">{folio(i,0)}</span>
 </div>;
}

function Recto({i,onJump}:{i:number;onJump?:(i:number)=>void}){
 const c=chapterAt(i);
 if(!c)return <div className="book-right bk-contents-page">
  <p className="bk-runhead">The Path, So Far.</p>
  <h2 className="bk-contents-title">Contents</h2>
  <ol className="bk-toc">{bookChapters.map((ch,n)=><li key={ch.id}>
   <button type="button" onClick={()=>onJump?.(n+1)} tabIndex={onJump?undefined:-1}>
    <span className="bk-toc-n">{ch.word}</span><span className="bk-toc-t">{ch.title}</span><span className="bk-toc-dots" aria-hidden="true"/><span className="bk-toc-p">{folio(n+1,0)}</span>
   </button>
  </li>)}</ol>
  <span className="book-folio">{folio(i,1)}</span>
 </div>;
 return <div className="book-right">
  <p className="bk-runhead">{c.label}</p>
  <p className="bk-chapno">Chapter {c.word}<span>{c.year}</span></p>
  <h2>{c.title}</h2>
  <div className="bk-prose">{c.prose.map((p,n)=><p key={n}>{p}</p>)}</div>
  <p className="bk-coda">{c.coda}</p>
  <ArrowLink href={c.link}>{c.linkLabel}</ArrowLink>
  <span className="book-folio">{folio(i,1)}</span>
 </div>;
}

/** One spread's pages; `side` limits it to one page for the turning leaf. */
function Pages({i,side,onJump}:{i:number;side?:'left'|'right';onJump?:(i:number)=>void}){
 return <>{side!=='right'&&<Verso i={i}/>}{side!=='left'&&<Recto i={i} onJump={onJump}/>}</>;
}

// ── Reader ───────────────────────────────────────────────────────────────

export function BookReader({initialChapter='',initialMode='pages',embedded=false}:{initialChapter?:string;initialMode?:Mode;embedded?:boolean}){
 const start=Math.max(0,findSpread(initialChapter));
 const initiallyOpen=!!initialChapter||initialMode==='scroll';

 const [current,setCurrent]=useState(start);
 const [mode,setMode]=useState<Mode>(initialMode);
 const [phase,setPhase]=useState<Phase>(initiallyOpen?'open':'closed');
 const [turn,setTurn]=useState<'next'|'previous'|null>(null);
 const [ghost,setGhost]=useState(start);
 const [drag,setDrag]=useState(0);
 const [settling,setSettling]=useState(false);
 const [dragDirection,setDragDirection]=useState(1);
 const turnStart=useRef(0);
 const modal=useRef<HTMLDialogElement>(null);
 const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 const reader=useRef<HTMLDivElement>(null);
 const opener=useRef<HTMLButtonElement>(null);
 const gesture=useRef<{x:number;y:number;time:number;direction:number;width:number;captured:boolean}|null>(null);

 const isVisible=phase!=='closed';
 const busy=phase!=='closed'&&phase!=='open';
 const expanded=phase==='open';
 const last=SPREADS.length-1;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

 // The reader lives in a native modal; closing restores the page position.
 useEffect(()=>{
  if(!isVisible)return;
  const dialog=modal.current;if(!dialog)return;
  const scrollY=window.scrollY,overflow=document.body.style.overflow;
  dialog.showModal();document.body.style.overflow='hidden';
  return()=>{dialog.close();document.body.style.overflow=overflow;window.scrollTo({top:scrollY,behavior:'instant'})};
 },[isVisible]);

 function later(fn:()=>void,ms:number){timers.current.push(setTimeout(fn,ms))}

 // Back and forward restore the chapter and view from the URL.
 useEffect(()=>{
  const restore=()=>{
   if(embedded)return;
   timers.current.forEach(clearTimeout);setTurn(null);
   const q=new URLSearchParams(location.search);
   const i=findSpread(q.get('chapter'));
   setCurrent(Math.max(0,i));
   setPhase(i>=0||q.get('mode')==='scroll'?'open':'closed');
   setMode(q.get('mode')==='scroll'?'scroll':'pages');
  };
  window.addEventListener('popstate',restore);
  return()=>{window.removeEventListener('popstate',restore);timers.current.forEach(clearTimeout)};
 },[embedded]);

 function url(i:number,m:Mode){if(!embedded)history.pushState(null,'',`/book?${new URLSearchParams({chapter:SPREADS[i],mode:m})}`)}

 function navigate(i:number){
  if(i<0||i>last||turn||busy||i===current)return;
  setDragDirection(i>current?1:-1);setGhost(current);setCurrent(i);url(i,mode);
  if(mode==='pages'&&!reduced()){setTurn(i>current?'next':'previous');later(()=>{setTurn(null);turnStart.current=0},560)}
  if(mode==='scroll')requestAnimationFrame(()=>document.getElementById(`chapter-${SPREADS[i]}`)?.scrollIntoView());
 }
 function begin(){
  if(busy||expanded)return;
  url(current,mode);
  if(reduced()){setPhase('open');requestAnimationFrame(()=>reader.current?.focus({preventScroll:true}));return}
  setPhase('prepare');later(()=>setPhase('opening'),150);later(()=>{setPhase('open');reader.current?.focus({preventScroll:true})},820);
 }
 function close(){
  if(busy)return;
  const finish=()=>{setPhase('closed');opener.current?.focus({preventScroll:true})};
  if(mode==='scroll')setMode('pages');
  if(!embedded)history.pushState(null,'','/book');
  if(reduced()){finish();return}
  setPhase('closing');later(finish,680);
 }
 function changeMode(){
  const next=mode==='pages'?'scroll':'pages';
  setMode(next);setPhase('open');url(current,next);
  requestAnimationFrame(()=>{if(next==='scroll')document.getElementById(`chapter-${SPREADS[current]}`)?.scrollIntoView();else reader.current?.focus({preventScroll:true})});
 }
 function key(e:React.KeyboardEvent){
  if(!expanded||mode!=='pages'||/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName)||e.altKey||e.ctrlKey||e.metaKey)return;
  const next:Record<string,number>={ArrowRight:current+1,ArrowLeft:current-1,Home:0,End:last};
  if(e.key in next){e.preventDefault();navigate(next[e.key])}
 }

 // Edge drag: a press within 56px of a page edge can lift the leaf.
 function down(e:React.PointerEvent){
  if(mode!=='pages'||turn||settling||!expanded||(e.target as HTMLElement).closest('a,button,summary'))return;
  const r=e.currentTarget.getBoundingClientRect();const x=e.clientX-r.left;
  setGhost(current);setDragDirection(x<56?-1:1);
  if(x>56&&x<r.width-56)return;
  if(e.pointerType==='mouse')e.preventDefault();
  gesture.current={x:e.clientX,y:e.clientY,time:performance.now(),direction:x<56?-1:1,width:r.width,captured:false};
 }
 function move(e:React.PointerEvent){
  const g=gesture.current;if(!g)return;
  const dx=e.clientX-g.x,dy=e.clientY-g.y;
  if(!g.captured){
   if(Math.abs(dy)>8&&Math.abs(dy)>=Math.abs(dx)/1.5){gesture.current=null;return}
   if(Math.abs(dx)>8&&Math.abs(dx)>1.5*Math.abs(dy)){g.captured=true;e.currentTarget.setPointerCapture(e.pointerId)}
  }
  if(g.captured&&Math.sign(dx)===-g.direction&&current+g.direction>=0&&current+g.direction<=last)setDrag(Math.min(145,Math.abs(dx)/g.width*180));
 }
 function end(e:React.PointerEvent,cancel=false){
  const g=gesture.current;gesture.current=null;
  if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
  if(!g||!g.captured){setDrag(0);return}
  const dx=e.clientX-g.x,speed=Math.abs(dx)/(performance.now()-g.time);
  const commit=!cancel&&(Math.abs(dx)>g.width*.28||(Math.abs(dx)>30&&speed>.45))&&Math.sign(dx)===-g.direction&&current+g.direction>=0&&current+g.direction<=last;
  if(commit){turnStart.current=drag*g.direction*-1;setDrag(0);navigate(current+g.direction)}
  else{setSettling(true);setDrag(0);later(()=>setSettling(false),280)}
 }

 const forward=dragDirection===1;
 // A jump from the contents page: the pressed button turns away with its
 // page, so focus returns to the reader and the arrow keys keep working.
 const jump=(i:number)=>{if(mode==='scroll'){setCurrent(i);url(i,mode);requestAnimationFrame(()=>document.getElementById(`chapter-${SPREADS[i]}`)?.scrollIntoView())}else{navigate(i);reader.current?.focus({preventScroll:true})}};

 return <div className="reader-shell book-theatre" data-phase={phase} data-open={phase!=='closed'} data-mode={mode} onKeyDown={key}>
  <div className="closed-book" aria-hidden={phase!=='closed'} inert={phase!=='closed'}>
   <button className="book-stage cover-button" onClick={begin} aria-label="Open the book cover" disabled={busy}><BookCover/></button>
   <div className="closed-book-copy">
    <p className="eyebrow">A personal record / {bookChapters.length} chapters</p>
    <h2>The Path,<br/><em>So Far.</em></h2>
    <p>Michigan, silicon, strategy, and the chapter that became A Story.</p>
    <button ref={opener} className="solid-link" onClick={begin} disabled={busy}>Open the Book</button>
    <a href="/book?mode=scroll">Read the scrolling story</a>
    <p className="small">Use the controls, arrow keys,<br/>or swipe from a page edge.</p>
   </div>
  </div>

  <dialog className="book-modal" ref={modal} aria-label="The Path, So Far" onCancel={e=>{e.preventDefault();close()}}>
   <div className="reader-opening-cover" aria-hidden="true"><BookCover/></div>
   <div className="open-reader" ref={reader} tabIndex={-1} role="region" aria-label="The Path, So Far, book reader" aria-hidden={!expanded} inert={!expanded}>
    <div className="reader-toolbar">
     <details className="book-contents">
      <summary>Contents <span aria-hidden="true">＋</span></summary>
      <nav aria-label="Book chapters">{SPREADS.map((id,i)=><button key={id} aria-current={i===current?'page':undefined} onClick={e=>{jump(i);e.currentTarget.closest('details')?.removeAttribute('open')}}><span>{i===0?'—':String(i).padStart(2,'0')}</span>{i===0?'Title & contents':chapterAt(i)!.title}</button>)}</nav>
     </details>
     <span className="reader-chapter-title">{labelAt(current)}<small>{current===0?'The Path, So Far.':`Chapter ${current} of ${bookChapters.length}`}</small></span>
     <button onClick={changeMode}>{mode==='pages'?'Read as one scroll':'Read as pages'}</button>
     <button onClick={close}>Close ×</button>
    </div>

    {/* data-dir carries which way the reader is going, so the narrow-screen
        page move (app/craft.css) can come from the edge being turned from. */}
    <div className="book-pages" data-dir={dragDirection} onDragStart={e=>e.preventDefault()} onPointerDown={down} onPointerMove={move} onPointerUp={e=>end(e)} onPointerCancel={e=>end(e,true)} style={{'--drag':`${drag}deg`} as React.CSSProperties}>
     {SPREADS.map((id,i)=><article id={`chapter-${id}`} key={id} className="book-spread" data-chapter={id} data-front={i===0||undefined} data-current={i===current} data-under={drag>0&&i===current+dragDirection}>
      <Pages i={i} onJump={jump}/>
     </article>)}
     {(turn||drag>0||settling)&&<>
      {/* The page that stays put while the leaf lifts off the other side. */}
      <div className={`turn-static ${forward?'hold-left':'hold-right'}`} aria-hidden="true"><Pages i={ghost} side={forward?'left':'right'}/></div>
      <div className={`turning-leaf ${turn||(settling?'settling':'dragging')} ${forward?'':'from-left'}`} style={{'--turn-start':`${turnStart.current}deg`,...(drag>0||settling?{transform:`rotateY(${forward?-drag:drag}deg)`}:{})} as React.CSSProperties} aria-hidden="true">
       <div className="leaf-front">
        {/* On phones the whole page turns: photograph and text together. */}
        <div className="leaf-mobile"><Pages i={ghost}/></div>
        <Pages i={ghost} side={forward?'right':'left'}/>
       </div>
       <div className="leaf-back"><Pages i={current} side={forward?'left':'right'}/></div>
       <div className="paper-fold"/>
      </div>
     </>}
    </div>

    <div className="reader-controls">
     <button disabled={current===0||!!turn} onClick={()=>navigate(current-1)}>← Previous</button>
     <p aria-live="polite" aria-atomic="true">{current===0?'Title & contents':`Chapter ${chapterAt(current)!.word}`}<span>{current===0?'Twelve chapters':chapterAt(current)!.title}</span></p>
     <button disabled={current===last||!!turn} onClick={()=>navigate(current+1)}>{current===0?'Begin →':'Next →'}</button>
    </div>
   </div>
  </dialog>

  <noscript>
   <style>{'.book-theatre{height:auto!important}.book-theatre .closed-book,.book-theatre .book-modal{display:none!important}.book-nojs{display:block;padding:30px;max-width:850px;margin:auto}.book-nojs article{margin-bottom:60px}'}</style>
   <div className="book-nojs"><p>The complete Book, as a scrolling story.</p>{bookChapters.map(c=><article key={c.id}><p>Chapter {c.word} · {c.year}</p><h2>{c.title}</h2>{c.prose.map(p=><p key={p}>{p}</p>)}<p><em>{c.coda}</em></p><a href={c.link}>{c.linkLabel}</a></article>)}</div>
  </noscript>
 </div>;
}
