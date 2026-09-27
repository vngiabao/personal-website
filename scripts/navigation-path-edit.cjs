const fs=require('fs');
const file='components/CareerMap.tsx';let s=fs.readFileSync(file,'utf8');
const start=s.indexOf('<div className="chronology-stops"');
const end=s.indexOf('<div id="career-stage"',start);
if(start<0||end<0)throw Error('Missing chronology boundary');
s=s.slice(0,start)+`<div className="chronology-route" ref={route}><svg className="chronology-rail" aria-hidden="true"><path d={rail.path}/><path className="rail-directions" d={rail.arrows}/></svg><div className="chronology-stops" role="group" aria-label="Career chronology">{careerChapters.map((chapter,i)=><button key={chapter.id} id={'path-'+chapter.id} data-chapter={chapter.id} aria-pressed={selected===i} aria-controls="career-stage" onClick={()=>select(i)}><span className="milestone-main"><span className="career-year">{chapter.year}</span><strong>{chapter.label}</strong><small>{chapter.id==='venture'?'Current venture':category(chapter.id)}</small></span>{chapter.id==='venture'&&<><span className="chapter-now"><span aria-hidden="true"/>Now</span><span className="venture-destination">A family archive<br/>built through conversation.<span>Co-founder &amp; COO</span></span></>}</button>)}</div></div>`+s.slice(end);
fs.writeFileSync(file,s);
