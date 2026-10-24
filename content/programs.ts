import {inception} from './inception';

/**
 * The startup programs A Story belongs to, each in its own presentation: NVIDIA's badge as
 * issued, Google's "Google for Startups" wordmark, AssemblyAI's and Deepgram's logos with
 * "Startup Program" set beneath, and Cartesia's unboxed "CARTESIA | Startups" lockup.
 * `scale` sizes each mark against the NVIDIA badge's height so their visible weight matches.
 * `group` splits the row: the platform programs, then the voice AI ones.
 * Claims stay at membership and grant status: never "backed by", "supported by" or "partner".
 */
export const programs={
 home:[
  {id:'nvidia',group:'platform',badge:inception.badge,alt:'NVIDIA Inception Program',width:500,height:216,scale:1},
  {id:'google',group:'platform',badge:'/brand/partners/google-for-startups.webp',alt:'Google for Startups',width:1388,height:176,scale:0.48},
  {id:'assemblyai',group:'voice',badge:'/brand/partners/assemblyai-startup-program-badge.svg',alt:'AssemblyAI Startup Program',width:378,height:139,scale:1},
  {id:'deepgram',group:'voice',badge:'/brand/partners/deepgram-startup-program-badge.svg',alt:'Deepgram Startup Program',width:298,height:131,scale:0.94},
  {id:'cartesia',group:'voice',badge:'/brand/partners/cartesia-startups-lockup-tight.svg',alt:'Cartesia Startups',width:826,height:97,scale:0.58},
 ],
} as const;

export const programsLine={
 member:'A Story is a member of NVIDIA Inception, Google for Startups, and the AssemblyAI and Deepgram startup programs, and a Cartesia Startups grant recipient.',
 proof:'NVIDIA Inception, Google for Startups, AssemblyAI, Deepgram & Cartesia startup programs',
 /** Beside NVIDIA's required line: the other programs' names and marks belong to them. */
 legal:'Other program names and logos belong to their owners.',
};

/** The A Story page's recognition feature: one panel per program, NVIDIA first. */
export const programFeatures=[
 {id:'nvidia',tab:'NVIDIA Inception',label:`Recognition · ${inception.joined}`,
  lead:'A Story is a member of the ',em:'NVIDIA Inception program.',
  about:inception.about},
 {id:'google',tab:'Google for Startups',label:'Recognition · October 2026',
  lead:'A Story is a member of the ',em:'Google for Startups Cloud Program.',
  about:'Google’s program for startups building on Google Cloud gives members cloud credits, technical training and guidance from Google’s experts.'},
 {id:'assemblyai',tab:'AssemblyAI',label:'Recognition · Startup program',
  lead:'A Story is a member of the ',em:'AssemblyAI Startup Program.',
  about:'AssemblyAI builds speech AI models that transcribe and understand spoken audio. Its startup program supports early-stage companies building with voice.'},
 {id:'deepgram',tab:'Deepgram',label:'Recognition · October 2026',
  lead:'A Story is a member of the ',em:'Deepgram Startup Program.',
  about:'Deepgram builds voice AI for real-time speech: transcription, text to speech and voice agents. Its startup program gives early teams credits and support to build with it.'},
 {id:'cartesia',tab:'Cartesia',label:'Recognition · Grant',
  lead:'A Story is a ',em:'Cartesia Startups grant recipient.',
  about:'Cartesia builds real-time voice AI models. Cartesia Startups awards grants to early teams building products with voice.'},
] as const;
