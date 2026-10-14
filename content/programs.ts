import {inception} from './inception';

/**
 * The startup programs A Story belongs to. Two sets of artwork:
 * - boxed: every badge in NVIDIA's 216-unit frame (white card, black keyline, transparent clear
 *   space), so at one height they read as a matched row. Used on the A Story page.
 * - home: each program's own presentation. NVIDIA's badge as issued, AssemblyAI's logo with
 *   "Startup Program" set beneath it, and Cartesia's unboxed "CARTESIA | Startups" lockup.
 *   `scale` sizes each mark against the NVIDIA badge's height so their visible weight matches.
 * Claims stay at membership and grant status: never "backed by", "supported by" or "partner".
 */
export const programs={
 boxed:[
  {id:'nvidia',badge:inception.badge,alt:'NVIDIA Inception Program',width:500,height:216,scale:1},
  {id:'cartesia',badge:'/brand/partners/cartesia-startups-lockup-boxed.svg',alt:'Cartesia Startups',width:1090,height:216,scale:1},
  {id:'assemblyai',badge:'/brand/partners/assemblyai-startup-program-lockup-boxed.svg',alt:'AssemblyAI Startup Program',width:1077,height:216,scale:1},
 ],
 home:[
  {id:'nvidia',badge:inception.badge,alt:'NVIDIA Inception Program',width:500,height:216,scale:1},
  {id:'assemblyai',badge:'/brand/partners/assemblyai-startup-program-badge.svg',alt:'AssemblyAI Startup Program',width:378,height:139,scale:1},
  {id:'cartesia',badge:'/brand/partners/cartesia-startups-lockup-tight.svg',alt:'Cartesia Startups',width:826,height:97,scale:0.58},
 ],
} as const;

export const programsLine={
 member:'A Story is a member of the NVIDIA Inception program, the AssemblyAI Startup Program, and a Cartesia Startups grant recipient.',
 proof:'NVIDIA Inception, AssemblyAI & Cartesia startup programs',
};

/** The A Story page's recognition feature: one panel per program, NVIDIA first. */
export const programFeatures=[
 {id:'nvidia',tab:'NVIDIA Inception',label:`Recognition · ${inception.joined}`,
  lead:'A Story is a member of the ',em:'NVIDIA Inception program.',
  about:inception.about},
 {id:'assemblyai',tab:'AssemblyAI',label:'Recognition · Startup program',
  lead:'A Story is a member of the ',em:'AssemblyAI Startup Program.',
  about:'AssemblyAI builds speech AI models that transcribe and understand spoken audio. Its startup program supports early-stage companies building with voice.'},
 {id:'cartesia',tab:'Cartesia',label:'Recognition · Grant',
  lead:'A Story is a ',em:'Cartesia Startups grant recipient.',
  about:'Cartesia builds real-time voice AI models. Cartesia Startups awards grants to early teams building products with voice.'},
] as const;
