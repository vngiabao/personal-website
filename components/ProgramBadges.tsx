import type {CSSProperties} from 'react';
import {programs} from '@/content/programs';

/** NVIDIA Inception, Cartesia Startups and AssemblyAI Startup Program artwork in one row, each unaltered. */
export function ProgramBadges({set='home',className=''}:{set?:keyof typeof programs;className?:string}){
 return <span className={`program-badges program-badges-${set} ${className}`}>{programs[set].map(p=><img key={p.id} className={p.id==='nvidia'?'inception-badge':'program-mark'} src={p.badge} alt={p.alt} width={p.width} height={p.height} decoding="async" style={{'--s':p.scale} as CSSProperties}/>)}</span>;
}
