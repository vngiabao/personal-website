import {ArrowLink,Label} from './Ledger';
// A Story first, then the awards; the engineering record follows as the foundation.
const proofs=[
 {value:'5',unit:'programs',label:'Startup programs, A Story',note:'NVIDIA Inception · Google for Startups · AssemblyAI · Deepgram · Cartesia grant',href:'/a-story#recognition'},
 {value:'Track Winner',unit:'+ Audience Choice',label:'Ross +Tech Innovation Jam',note:'ARTiculate · Team achievement · 2025',href:'/work/articulate',award:true},
 {value:'2',unit:'×',label:'Semifinalist',note:'MHCC 2025 + Southeast Case Competition 2026',href:'#recognition'},
 {value:'1.5',unit:'months',label:'From design to tape-out',note:'UMC 22nm · Faraday shuttle project',href:'/work/faraday-tapeout#result'},
 {value:'Top 10',unit:'%',label:'Faraday performance evaluation',note:'Director’s testimonial · April 2026',href:'/documents/faraday-testimonial-bao-vo.pdf'},
 {value:'400',unit:'+',label:'Students supported',note:'EECS 215 · Instruction & laboratory materials',href:'/about#teaching'},
];
export function AtGlance(){return <section id="at-a-glance" className="at-glance section container"><div className="glance-heading"><div><Label num="06">On the record</Label><h2>A few things<br/><em>on the record.</em></h2></div><p>Real projects. Shared achievements.<br/>A foundation for what comes next.</p></div><div className="proof-grid">{proofs.map(p=><a className={`proof-point ${'award' in p?'proof-award':''}`} key={p.label} href={p.href}><span className="proof-value">{p.value}<em>{p.unit}</em></span><h3>{p.label}</h3><p>{p.note}</p></a>)}</div><ArrowLink href="#recognition">See the evidence</ArrowLink></section>}
