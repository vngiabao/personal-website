'use client';
import {useState} from 'react';
import {programs,programFeatures} from '@/content/programs';

/**
 * The A Story page's recognition feature. NVIDIA Inception shows by default; the banner of program
 * badges beneath it switches the feature to that program.
 */
export function ProgramRecognition(){
 const [active,setActive]=useState<string>('nvidia');
 const f=programFeatures.find(p=>p.id===active)??programFeatures[0];
 const badge=programs.boxed.find(p=>p.id===f.id)!;
 return <>
  <div className="container st-inception-in" id="recognition-panel" role="tabpanel" aria-labelledby={`recognition-tab-${f.id}`}>
   <img className="inception-badge st-inception-badge" src={badge.badge} alt={badge.alt} width={badge.width} height={badge.height} decoding="async"/>
   <div className="st-inception-copy">
    <p className="eyebrow">{f.label}</p>
    <h2 id="inception-title">{f.lead}<em>{f.em}</em></h2>
   </div>
   <p className="st-inception-about" aria-live="polite">{f.about}</p>
  </div>
  <div className="container st-programs" role="tablist" aria-label="Startup programs">
   {programFeatures.map(p=>{const b=programs.boxed.find(x=>x.id===p.id)!;return <button key={p.id} id={`recognition-tab-${p.id}`} role="tab" type="button" aria-selected={active===p.id} aria-controls="recognition-panel" onClick={()=>setActive(p.id)}>
    <img src={b.badge} alt="" width={b.width} height={b.height} decoding="async"/>
    <span>{p.tab}</span>
   </button>})}
  </div>
 </>;
}
