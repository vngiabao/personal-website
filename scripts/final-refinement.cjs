const fs=require('fs');
const edit=(p,fn)=>fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));
edit('app/layout.tsx',s=>s.replace("import './master.css';","import './master.css';\nimport './final.css';").replace('an A Story co-founder','A Story’s Co-founder and COO'));
edit('components/Home.tsx',s=>s.replace("import {WorkTracks} from './WorkTracks';","import {StoryBrand} from './StoryBrand';")
 .replace(/<img className="real-wordmark"[^>]+\/>/,'<StoryBrand/>')
 .replace('Not a memoir to finish.<br/>A living archive to keep building.','Not a memoir to finish.<br/>A Story to keep, and to carry on.')
 .replace('<ArrowLink href="/a-story#my-role">Why I’m building it</ArrowLink>','')
 .replace('Co-founder · Product strategy & operations','Co-founder and COO')
 .replace('<strong>Silicon <span>→</span></strong><span>Faraday · Design to tape-out</span>','<strong>Silicon</strong><span>Faraday · WICS · Engineering & research</span>')
 .replace('<strong>Strategy <span>→</span></strong>','<strong>Strategy</strong>')
 .replace('<strong>Stories <span>→</span></strong>','<strong>Stories</strong>')
 .replace('Engineering and research. Consulting, product, and ventures. Two overlapping tracks, converging in what I’m building now.','A connected chronology of places, people, and work. Follow a year to see how one chapter opened the next.')
 .replace(' <WorkTracks/>','')
 .replace('<WorkIndex/>','<WorkIndex lenses/>')
 .replace('Different problems.<br/><em>The same curiosity.</em>','Make it work.<br/><em>Make it matter.</em>')
 .replace('<main id="main" className="new-home">','<main id="main" className="new-home" data-entrance="first">'));
edit('components/HomeEntrance.tsx',s=>s.replace('useEffect','useLayoutEffect').replace("return()=>{delete home.dataset.entrance}","return()=>{}"));
edit('components/Ledger.tsx',s=>s.replace('data-media={id}','data-media={id} data-frame={[\'portrait\',\'smile\',\'grad\',\'masters-2026\',\'wentzloff\'].includes(id)?\'formal\':[\'peterson\',\'puf-team\',\'circuits-team\',\'faraday\',\'isscc\',\'mackinac\'].includes(id)?\'research\':m.kind===\'real\'?\'personal\':\'artifact\'}')
 .replace('{children}<span aria-hidden="true">↗</span></a>','{children}{(className.includes(\'solid-link\')||href.startsWith(\'https:\'))&&<span aria-hidden="true">↗</span>}</a>'));
edit('content/career.ts',s=>{
 s=s.replace("image:'isscc',secondary:'wentzloff'","image:'mackinac'").replace("image:'puf-team',secondary:'circuits-team'","image:'puf-team'")
 .replace("label:'M.S. + NTT'","label:'M.S. completion'").replace("Co-founder · Product, operations & pilot development","Co-founder and COO");
 const lines=s.split('\n'), entries=lines.filter(l=>l.trim().startsWith('{id:'));
 const order=['michigan','materials','circuits','silicon','medical','strategy','product','mhcc','teaching','masters','aurora','venture'];
 const sorted=order.map(id=>entries.find(l=>l.includes("id:'"+id+"'")));
 const ntt=" {id:'ntt',year:'2026',label:'NTT accelerator',track:'engineering',organization:'University of Michigan · Advanced VLSI',title:'Security, expressed in hardware.',role:'Reconfigurable accelerator · Course project',text:'A radix-2 number-theoretic-transform accelerator for post-quantum cryptography, from parallel butterfly processing and banked memory to physical implementation.',proof:['256 / 1024 polynomial sizes','Banked SRAM + DMA / FIFO integration','Synthesis + physical implementation'],image:'',href:'/archive#ntt-accelerator',book:'masters'},";
 sorted.splice(9,0,ntt);
 return lines.filter(l=>!l.trim().startsWith('{id:')).join('\n').replace('\n];','\n'+sorted.join('\n')+'\n];');
});
edit('content/chapters.ts',s=>s.replace("title:'What happens beyond the lab?',image:'isscc'","title:'What happens beyond the lab?',image:'mackinac'")
 .replace('My focus is product strategy, operations, and pilot development.','As Co-founder and COO, my focus is product strategy, operations, and pilot development.'));
edit('content/projects.ts',s=>s.replace("role:'Co-founder',","role:'Co-founder and COO',").replace("image:'isscc',href:'/work/implantable","image:'mackinac',href:'/work/implantable"));
edit('components/Discovery.tsx',s=>s.replace("import {projects}","import {projects,extras}")
 .replace("['two-sides','Two sides'],",'')
 .replace("<span>{String(i).padStart(2,'0')}</span>{label}",'{label}')
 .replace("export function WorkIndex({full=false,initialTrack='all'}:{full?:boolean;initialTrack?:string}){","export function WorkIndex({full=false,initialTrack='all',lenses=false}:{full?:boolean;initialTrack?:string;lenses?:boolean}){")
 .replace("const list=(full?projects:projects.slice(0,6)).filter", "const portfolio=[...projects,...extras.filter(p=>['Engineering','Research','Teaching'].includes(p.category)).map(p=>({...p,role:p.slug==='semiconductor-characterization'?'Undergraduate researcher · Peterson Lab':p.slug==='teaching'?'Graduate Student Instructor · EECS 215':'Engineering coursework / research',href:'/archive#'+p.slug}))];const list=(full||lenses?portfolio:projects.slice(0,6)).filter")
 .replaceAll("['Engineering','Research'].includes(p.category)","['Engineering','Research','Teaching'].includes(p.category)")
 .replace("history.pushState(null,'',t==='all'?'/work':`/work?track=${t}`)","if(full)history.pushState(null,'',t==='all'?'/work':`/work?track=${t}`)")
 .replace('return <>{full&&','return <>{lenses&&<div className="work-lenses"><button aria-pressed={track===\'engineering\'} onClick={()=>filter(\'engineering\')}><span className="eyebrow">Engineering & Research</span><strong>Make it <em>work.</em></strong><p>Circuits, silicon, and systems. Start with the constraints that make the problem real.</p><span>Peterson · Faraday · WICS · NTT</span></button><button aria-pressed={track===\'commercial\'} onClick={()=>filter(\'commercial\')}><span className="eyebrow">Consulting, Product & Ventures</span><strong>Make it <em>matter.</em></strong><p>Markets, adoption, and experience. Give the technology a direction people can believe in.</p><span>miLEAD · ARTiculate · A Story</span></button></div>}{(full||lenses)&&')
 .replace('<span aria-hidden="true">↗</span></button>','</button>')
 .replace(':<Photo id={project.image}', ':!project.image?<div className="technical-artifact"><span className="eyebrow">{project.category} / {project.year}</span><strong>{project.slug===\'ntt-accelerator\'?\'256 / 1024\':project.slug===\'teaching\'?\'400+\':project.slug===\'rf-front-end\'?\'I + Q\':project.slug===\'energy-harvesting\'?\'μW\':project.slug===\'ripple-carry-adder\'?\'8 bit\':\'Gain × BW\'}</strong><p>{project.title}</p><span className="small">Résumé-documented work</span></div>:<Photo id={project.image}')
 .replace('{workOutcomes[project.slug]}','{workOutcomes[project.slug]||project.status}')
 .replace(/\{full&&track==='engineering'&&<div className="engineering-more">.*?<\/div>\}/,'') );
edit('app/work/page.tsx',s=>s.replace('Nine selected chapters','Engineering, research, and commercial chapters').replace('<WorkIndex full','<WorkIndex lenses full'));
