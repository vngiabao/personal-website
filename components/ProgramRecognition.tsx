'use client';
import type {CSSProperties} from 'react';
import {useState} from 'react';
import {programs,programFeatures} from '@/content/programs';

/**
 * The A Story page's recognition feature. NVIDIA Inception shows by default; the banner of program
 * marks beneath it switches the feature to that program. Every panel is in the HTML, stacked
 * in one grid cell (the closed ones invisible and inert), so the band keeps one height and one
 * column grid from program to program, and search engines read every program, not just the open one.
 */
export function ProgramRecognition(){
 const [active,setActive]=useState<string>('nvidia');
 const mark=(id:string)=>programs.home.find(p=>p.id===id)!;
 return <>
  <div className="st-recognition-stage">
  {programFeatures.map(f=>{const b=mark(f.id),open=active===f.id;return <div key={f.id} className="container st-inception-in" id={`recognition-panel-${f.id}`} role="tabpanel" aria-labelledby={`recognition-tab-${f.id}`} data-open={open} aria-hidden={!open||undefined} inert={!open}>
   <div className="st-inception-mark"><img className={`${f.id==='nvidia'?'inception-badge':'program-mark'} st-inception-badge st-inception-badge-${f.id}`} src={b.badge} alt={b.alt} width={b.width} height={b.height} decoding="async" style={{'--s':b.scale} as CSSProperties}/></div>
   <div className="st-inception-copy">
    <p className="eyebrow">{f.label}</p>
    <h2 id={f.id==='nvidia'?'inception-title':`${f.id}-title`}>{f.lead}<em>{f.em}</em></h2>
   </div>
   <p className="st-inception-about">{f.about}</p>
  </div>})}
  </div>
  <div className="st-programs-band">
   <div className="container st-programs" role="tablist" aria-label="Startup programs">
    {programFeatures.map(p=>{const b=mark(p.id);return <button key={p.id} id={`recognition-tab-${p.id}`} role="tab" type="button" aria-selected={active===p.id} aria-controls={`recognition-panel-${p.id}`} aria-label={p.tab} onClick={()=>setActive(p.id)}>
     <img className={`st-programs-mark-${p.id}`} src={b.badge} alt="" width={b.width} height={b.height} decoding="async"/>
    </button>})}
   </div>
  </div>
 </>;
}
