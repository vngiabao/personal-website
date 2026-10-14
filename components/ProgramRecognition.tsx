'use client';
import type {CSSProperties} from 'react';
import {useState} from 'react';
import {programs,programFeatures} from '@/content/programs';

/**
 * The A Story page's recognition feature. NVIDIA Inception shows by default; the banner of program
 * marks beneath it switches the feature to that program. All three panels are in the HTML (the
 * closed ones `hidden`), so search and answer engines read every program, not just the open one.
 */
export function ProgramRecognition(){
 const [active,setActive]=useState<string>('nvidia');
 const mark=(id:string)=>programs.home.find(p=>p.id===id)!;
 return <>
  {programFeatures.map(f=>{const b=mark(f.id);return <div key={f.id} className="container st-inception-in" id={`recognition-panel-${f.id}`} role="tabpanel" aria-labelledby={`recognition-tab-${f.id}`} hidden={active!==f.id}>
   <img className={`${f.id==='nvidia'?'inception-badge':'program-mark'} st-inception-badge st-inception-badge-${f.id}`} src={b.badge} alt={b.alt} width={b.width} height={b.height} decoding="async" style={{'--s':b.scale} as CSSProperties}/>
   <div className="st-inception-copy">
    <p className="eyebrow">{f.label}</p>
    <h2 id={f.id==='nvidia'?'inception-title':`${f.id}-title`}>{f.lead}<em>{f.em}</em></h2>
   </div>
   <p className="st-inception-about">{f.about}</p>
  </div>})}
  <div className="st-programs-band">
   <div className="container st-programs" role="tablist" aria-label="Startup programs">
    {programFeatures.map(p=>{const b=mark(p.id);return <button key={p.id} id={`recognition-tab-${p.id}`} role="tab" type="button" aria-selected={active===p.id} aria-controls={`recognition-panel-${p.id}`} aria-label={p.tab} onClick={()=>setActive(p.id)}>
     <img className={`st-programs-mark-${p.id}`} src={b.badge} alt="" width={b.width} height={b.height} decoding="async"/>
    </button>})}
   </div>
  </div>
 </>;
}
