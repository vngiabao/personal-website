import type {CSSProperties} from 'react';
import {programs} from '@/content/programs';

/** The membership sentence with each program's name set in bold. */
export function ProgramsMember(){return <>A Story is a member of the <strong>NVIDIA Inception program</strong>, the <strong>AssemblyAI Startup Program</strong>, and a <strong>Cartesia Startups</strong> grant recipient.</>}

/** NVIDIA Inception, Cartesia Startups and AssemblyAI Startup Program artwork in one row, each unaltered. */
export function ProgramBadges({set='home',className=''}:{set?:keyof typeof programs;className?:string}){
 return <span className={`program-badges program-badges-${set} ${className}`}>{programs[set].map(p=><img key={p.id} className={p.id==='nvidia'?'inception-badge':'program-mark'} src={p.badge} alt={p.alt} width={p.width} height={p.height} decoding="async" style={{'--s':p.scale} as CSSProperties}/>)}</span>;
}
