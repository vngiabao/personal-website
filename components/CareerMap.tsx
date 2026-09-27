'use client';
import {useEffect,useRef,useState} from 'react';
import {careerChapters as allChapters} from '@/content/career';
const careerChapters=allChapters.filter(c=>['michigan','materials','circuits','silicon','medical','strategy','venture'].includes(c.id));
import {Photo,ArrowLink} from './Ledger';
const category=(id:string)=>({michigan:'Education',materials:'Research',circuits:'Engineering',silicon:'Engineering',medical:'Research',strategy:'Consulting',product:'Product',mhcc:'Case competition',teaching:'Teaching',ntt:'Engineering',masters:'Education',aurora:'Case competition',venture:'Venture'}[id]);
export function CareerMap(){
 const route=useRef<HTMLDivElement>(null);
 const [rail,setRail]=useState({path:'',arrows:''});
 useEffect(()=>{
  const element=route.current;if(!element)return;
  const draw=()=>{
   const cards=[...element.querySelectorAll('button')].map(b=>({left:b.offsetLeft,top:b.offsetTop,width:b.offsetWidth,height:b.offsetHeight,right:b.offsetLeft+b.offsetWidth,bottom:b.offsetTop+b.offsetHeight}));if(cards.length!==7)return;
   const center=(i:number)=>({x:cards[i].left+cards[i].width/2,y:cards[i].top+cards[i].height/2});
   const first=center(0),fourth=center(3),fifth=center(4),last=center(6);
   if(cards[1].top>cards[0].bottom){setRail({path:`M 10 ${first.y} V ${last.y}`,arrows:''});return;}
   const edge=element.clientWidth-3,radius=38;
   const upper=(cards[2].right+cards[3].left)/2,lower=(cards[5].right+cards[4].left)/2;
   setRail({path:`M ${first.x} ${first.y} H ${edge-radius} Q ${edge} ${first.y} ${edge} ${first.y+radius} V ${fifth.y-radius} Q ${edge} ${fifth.y} ${edge-radius} ${fifth.y} H ${last.x}`,arrows:`M ${upper-4} ${fourth.y-4} L ${upper+4} ${fourth.y} L ${upper-4} ${fourth.y+4} M ${lower+4} ${fifth.y-4} L ${lower-4} ${fifth.y} L ${lower+4} ${fifth.y+4}`});
  };
  const resize=new ResizeObserver(draw);resize.observe(element);draw();
  // Entrance and rail drawing are scroll-authored in ScrollMotion.
  return()=>resize.disconnect();
 },[]);
 const [selected,setSelected]=useState(0);const c=careerChapters[selected];
 useEffect(()=>{const restore=()=>{const id=location.hash.replace('#path-','');const i=careerChapters.findIndex(c=>c.id===id);if(i>=0){setSelected(i);requestAnimationFrame(()=>document.querySelector('.career-map')?.scrollIntoView({block:'start'}))}};restore();window.addEventListener('hashchange',restore);window.addEventListener('popstate',restore);return()=>{window.removeEventListener('hashchange',restore);window.removeEventListener('popstate',restore)}},[]);
 function select(i:number){if(i<0||i>=careerChapters.length)return;setSelected(i);if(document.querySelector('.new-home'))history.pushState(null,'','#path-'+careerChapters[i].id)}
 return <div className="career-map chronology-map snake-map"><div className="career-intro"><span>One path. Many chapters.</span><p>Choose a year. Follow what came next.</p></div><div className="chronology-route" ref={route}><svg className="chronology-rail" aria-hidden="true"><path d={rail.path} pathLength={1}/><path className="rail-directions" d={rail.arrows}/></svg><div className="chronology-stops" role="group" aria-label="Career chronology">{careerChapters.map((chapter,i)=><button key={chapter.id} id={'path-'+chapter.id} data-chapter={chapter.id} aria-pressed={selected===i} aria-controls="career-stage" onClick={()=>select(i)}><span className="milestone-main"><span className="career-year">{chapter.year}</span><strong>{chapter.label}</strong><small>{chapter.id==='venture'?'Current venture':category(chapter.id)}</small></span>{chapter.id==='venture'&&<><span className="chapter-now"><span aria-hidden="true"/>Now</span><span className="venture-destination">A family archive <br/>built through conversation.<span>Co-founder &amp; COO</span></span></>}</button>)}</div></div><div id="career-stage" className="career-stage" data-path={c.id}><div className="career-media" key={c.id}>{c.id==='teaching'?<div className="career-teaching"><span className="eyebrow">EECS 215 / 2025–26</span><strong>400<span>+</span></strong><p>Students supported through instruction and laboratory materials.</p></div>:c.id==='ntt'?<div className="technical-artifact"><span className="eyebrow">Reconfigurable NTT accelerator</span><strong>256 / 1024</strong><p>Parallel butterfly processing.<br/>Banked memory.<br/>A path to implementation.</p><span className="small">Course project · 2026</span></div>:c.id==='venture'?<figure className="clean-evidence"><img src="/media/story/home.webp" width="530" height="1242" alt="A Story Home product design"/><figcaption>Product design · In development</figcaption></figure>:<Photo id={c.image} sizes="(max-width:767px) 90vw, 48vw"/>}</div><div className="career-copy" key={'copy-'+c.id} aria-live="polite"><p className="eyebrow">{c.year} / {category(c.id)}</p><p className="career-organization">{c.organization}</p><h3>{c.title}</h3><p className="career-role">{c.role}</p><p>{c.text}</p><ul className="path-proof">{c.proof.map(p=><li key={p}>{p}</li>)}</ul><div className="career-actions"><ArrowLink className="solid-link" href={c.href}>Explore this chapter</ArrowLink><ArrowLink href={'/book?chapter='+c.book+'&mode=pages'}>Read in the Book</ArrowLink></div></div></div><div className="career-controls"><button disabled={selected===0} onClick={()=>select(selected-1)} aria-label="Previous career chapter">← Previous</button><span>{String(selected+1).padStart(2,'0')} / {careerChapters.length} chapters</span><button disabled={selected===careerChapters.length-1} onClick={()=>select(selected+1)} aria-label="Next career chapter">Next →</button></div><noscript><ol>{careerChapters.map(c=><li key={c.id}><a href={c.href}>{c.year} · {c.organization}</a><p>{c.text}</p></li>)}</ol></noscript></div>
}

