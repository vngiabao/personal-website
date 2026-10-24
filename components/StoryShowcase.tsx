'use client';
import {useState} from 'react';
import {story} from '@/content/story';

/* The product loop in five screens, told with the same people as the A Story page:
   Joan's Tuesday call, then Walt's lake monster and the family who were there. */
const panels=[
 {id:'calls',label:'Scheduled calls',title:'You pick the hour. A Story calls.',copy:'Set it up once on their phone. At that hour, A Story rings with one question. Nothing to open, nothing to type.',
  src:'/media/story/app/call-incoming.webp',alt:'A Story’s scheduled call screen: “A little time for your story. Tuesday, 7:00 pm”, today’s question, and an Answer call button',w:786,h:1704,caption:'Call screen concept'},
 {id:'conversation',label:'It listens',title:'It follows the detail.',copy:'When something slips out on the way to an answer, A Story drops its own question and goes after it.',
  src:'/media/story/app/call-listening.webp',alt:'An A Story call in progress: today’s question, a live waveform, and “Listening. Take your time.”',w:786,h:1703,caption:'Call screen concept'},
 {id:'archive',label:'A living archive',title:'Every call becomes a memory.',copy:'The voice, the words and the photos land on one page the whole family can open, in the order it happened.',
  src:'/media/story/app/memory-top.webp',alt:'A memory page in the A Story app: Summer in Vermont, with the story text and family photos',w:786,h:1704,caption:'The A Story app · Private beta'},
 {id:'perspectives',label:'Every voice credited',title:'Everyone who was there adds theirs.',copy:'One link, no account. Each addition keeps its name, and nothing appears until the storyteller says yes.',
  src:'/media/story/app/invite.webp',alt:'The A Story invite screen: one link to share, a referral code and an email invite',w:786,h:1704,caption:'The A Story app · Private beta'},
 {id:'book',label:'Something to keep',title:'Then it goes on the shelf.',copy:'When the family is ready, the archive becomes a printed book: the photographs, the moments and their own words.',
  src:'/media/story/book.webp',alt:'The teal Moments & Memories keepsake book',w:700,h:939,caption:'Keepsake book concept'},
];
const w=story.witness;
function ContextCard({id}:{id:string}){return <aside className={'theater-artifact artifact-'+id} aria-label="Example from the A Story page">
 {id==='calls'&&<><span className="small">TUESDAY · 7:00 PM</span><h4>Joan answers.</h4><p>Paul set it up from the next room.</p></>}
 {id==='conversation'&&<><span className="small">THE FOLLOW-UP</span><p className="theater-quote">“I’ve still got them all in a biscuit tin. All but one.”</p><div className="theater-wave" aria-hidden="true">▂ ▅ ▃ ▆ ▄ ▂ ▇ ▅ ▃ ▆ ▂</div><h4>“What happened to the one, Joan?”</h4></>}
 {id==='archive'&&<><span className="small">SAVED FROM THE CALL</span><h4>Summer in Vermont</h4><p>With the photos the family added.</p></>}
 {id==='perspectives'&&<><span className="small">{w.title.toUpperCase()} · {w.added.length} ADDITIONS</span><div className="theater-people">{w.added.map(a=><p key={a.name}><strong>{a.name}</strong><span>+ {a.kind}</span></p>)}</div></>}
 {id==='book'&&<><span className="small">MOMENTS &amp; MEMORIES</span><h4>Printed from the archive.</h4><p>Every voice credited.</p></>}
 </aside>}
export function StoryShowcase({compact=false}:{compact?:boolean}){const [selected,setSelected]=useState(0);const p=panels[selected];return <div className={'story-showcase product-theater '+(compact?'compact-showcase':'')}><div className="product-tabs" role="group" aria-label="Explore A Story product designs">{panels.map((panel,i)=><button key={panel.id} aria-pressed={i===selected} onClick={()=>setSelected(i)}>{panel.label}</button>)}</div><div className="story-display" data-panel={p.id}><span className="display-counter" aria-label={'Design '+(selected+1)+' of 5'}>0{selected+1}<span>/ 05</span></span><div className="story-display-note" key={'text-'+p.id}><span className="eyebrow">A STORY / {p.id==='book'?'THE LONGER VIEW':'HOW IT WORKS'}</span><h3>{p.title}</h3><p>{p.copy}</p></div><div className="theater-stage" key={p.id}><ContextCard id={p.id}/><figure className={'product-panel product-'+p.id}><img src={p.src} alt={p.alt} width={p.w} height={p.h} loading="lazy"/></figure><p className="theater-caption">{p.caption}</p></div></div><p className="theater-disclosure">Sample families, with fictional names.</p></div>}
