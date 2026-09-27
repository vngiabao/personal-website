import {ArrowLink,Label} from './Ledger';
const proofs=[
 {value:'22',unit:'nm',label:'ASIC process',note:'UMC · Faraday shuttle project',href:'/work/faraday-tapeout'},
 {value:'1.5',unit:'months',label:'Tape-out project timeline',note:'A shuttle project I helped bring to tape-out',href:'/work/faraday-tapeout#result'},
 {value:'Top 10',unit:'%',label:'Faraday performance evaluation',note:'Director’s testimonial · April 2026',href:'/documents/faraday-testimonial-bao-vo.pdf'},
 {value:'400',unit:'+',label:'Students supported',note:'EECS 215 · Instruction & laboratory materials',href:'/about#teaching'},
 {value:'Track Winner',unit:'+ Audience Choice',label:'Ross +Tech Innovation Jam',note:'ARTiculate · Team achievement · 2025',href:'/work/articulate'},
 {value:'2',unit:'×',label:'Semifinalist',note:'MHCC 2025 + Southeast Case Competition 2026',href:'#recognition'},
];
export function AtGlance(){return <section id="at-a-glance" className="at-glance section container"><div className="glance-heading"><div><Label num="06">On the record</Label><h2>A few things<br/><em>on the record.</em></h2></div><p>Real projects. Shared achievements.<br/>A foundation for what comes next.</p></div><div className="proof-grid">{proofs.map((p,i)=><a className={`proof-point ${i===4?'proof-award':''}`} key={p.label} href={p.href}><span className="proof-value">{p.value}<em>{p.unit}</em></span><h3>{p.label}</h3><p>{p.note}</p></a>)}</div><ArrowLink href="#recognition">See the evidence</ArrowLink></section>}
