import type {CSSProperties} from 'react';
import {programs} from '@/content/programs';

/** The membership sentence with each program's name set in bold. */
export function ProgramsMember(){return <>A Story is a member of <strong>NVIDIA Inception</strong>, <strong>Google for Startups</strong>, and the <strong>AssemblyAI</strong> and <strong>Deepgram</strong> startup programs, and a <strong>Cartesia Startups</strong> grant recipient.</>}

/** Every program's artwork, unaltered, in two groups that wrap as units: the platform programs
 * (NVIDIA Inception, Google for Startups), then the voice AI ones (AssemblyAI, Deepgram, Cartesia). */
export function ProgramBadges({className=''}:{className?:string}){
 const group=(g:string)=><span className="program-group">{programs.home.filter(p=>p.group===g).map(p=><img key={p.id} className={p.id==='nvidia'?'inception-badge':'program-mark'} src={p.badge} alt={p.alt} width={p.width} height={p.height} decoding="async" style={{'--s':p.scale} as CSSProperties}/>)}</span>;
 return <span className={`program-badges ${className}`}>{group('platform')}{group('voice')}</span>;
}
