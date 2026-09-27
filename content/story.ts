/**
 * A Story copy for this site, taken from the current A Story website build
 * (A Story - W Daniel/Web App Ver Daniel/09212026, Pass 11, 21 September 2026).
 *
 * - Messaging: src/pages/site/home/{Hero,WhatGetsLost,ThreeCalls,EveryVoice,StepOne}.tsx
 * - The call: src/lib/demoScripts.ts, scenario "love" (Joan). Turns are verbatim;
 *   the script is an illustrative example, not a real family.
 * - App screens: public/app/*.webp (the founder's Figma), copied to
 *   public/media/story/app/.
 * Re-check against astoryapp.com when the product copy changes.
 */
export const story={
 site:'https://astoryapp.com',
 siteLabel:'astoryapp.com',
 call:{
  name:'Joan',
  label:'A Story · calling Joan',
  teller:'Joan, 84 — about fifty-one years of marriage',
  turns:[
   {who:'A Story',text:'You don’t start with the fifty-one years. You start with one thing. What did you notice first about him?'},
   {who:'Joan',text:'His handwriting. I knew his handwriting a year and a half before I properly knew his face — he was posted out to Aden and we wrote. I’ve still got them all in a biscuit tin. All but one.'},
   {who:'A Story',text:'All but one. So you’ve counted them. What happened to the one, Joan?',pivot:true},
   {who:'Joan',text:'I put it on the fire. Nineteen seventy-one. It was the one where he asked me to marry him, and that year I couldn’t have it in the house.'},
   {who:'A Story',text:'We’ll come back to 1971, and we don’t have to rush at it. First — the tin. Where does it live?'},
  ] as {who:string;text:string;pivot?:boolean}[],
 },
 /** The everyday collage behind "It’s the everyday.": [id, left%, top%, width%, rotate°]. Decorative. */
 everyday:[['05',3,8,15,-4],['09',20,4,19,3],['11',41,6,13,-2],['14',58,3,20,4],['17',80,9,17,-3],['07',1,48,14,3],['13',83,50,15,-4],['20',6,76,19,-2],['25',28,70,16,4],['06',48,74,13,-3],['10',64,68,11,2],['12',80,76,13,-5]] as [string,number,number,number,number][],
 /**
  * The call, annotated. Each A Story turn carries one of the site's four verbs
  * (It asks · It listens · It follows · It remembers); the notes follow the
  * script's own commentary in demoScripts.ts (scenario "love").
  */
 callSetup:'A Story calls Joan, 84. Her son Paul set up the call. Here is how it goes.',
 callSteps:[
  {verb:'It asks.',note:'One question, not a list of them.',turns:[0]},
  {verb:'It listens.',note:'Joan answers, then adds three words she didn’t have to.',turns:[1],mark:'All but one.'},
  {verb:'It follows.',note:'It drops its next question and goes after those three words.',turns:[2,3]},
  {verb:'It remembers.',note:'It keeps 1971 for later and doesn’t push. Every call picks up where the last one stopped.',turns:[4]},
 ] as {verb:string;note:string;turns:number[];mark?:string}[],
 /** Who it is for — each audience in the A Story site's own words (Families, Care, Organizations; sitePages.json). */
 audiences:[
  {label:'Families',phrase:'For the people who have everything.',lead:'Nobody loses the wedding photos. They lose everything around them — the story he tells every Thanksgiving, and why everyone in that photograph is laughing.',why:'Help them set up once, choose a comfortable hour, and let the conversation find its own way.',href:'/for-families'},
  {label:'Care communities',phrase:'Every resident has a life worth knowing. A Story helps you learn it.',lead:'The work they did. The music in the house. The way they made Sunday lunch. Give those stories somewhere to stay — and give the people caring for them a way to learn them.',why:'What they did for a living, who they miss, the song that settles them. The kind of detail that turns care into conversation.',href:'/care-communities'},
  {label:'Organizations',phrase:'The knowledge people carry should not leave with them.',lead:'The decision that changed direction. The colleague who made it work. The knowledge that never reached a handover document.',why:'Put firsthand accounts beside documents and photographs. Keep who said what, and when.',href:'/organizations'},
 ],
 /** Every voice: one memory begun on a call, then the family's versions arrive (homeExamples.ts, LAKE_MONSTER). */
 witness:{
  title:'The lake monster',
  date:'Sat, 17 Aug 2024',
  tags:['Family','Camping'],
  photo:'/media/story/H04-1200.webp',
  photoSmall:'/media/story/H04-640.webp',
  alt:'A grandfather telling a story by a campfire at a lake at dusk, with his granddaughter, her mum, and his son holding a paddle behind them',
  teller:{name:'Grandpa Walt',initial:'W'},
  told:'I told Lily there was a monster in that lake. I never thought she’d believe me for three whole summers.',
  added:[
   {name:'Sarah',initial:'S',role:'Lily’s mum',kind:'12 photos',quote:'She didn’t sleep. She kept watch at the tent door with a flashlight.'},
   {name:'Lily, 11',initial:'L',role:'Walt’s granddaughter',kind:'Voice note',quote:'There WAS a monster. I heard it breathing.'},
   {name:'Uncle Ben',initial:'B',role:'Walt’s son',kind:'Written',quote:'The monster was me. With a paddle. Sorry, Lily.'},
  ],
 },
 /** How A Story compares (home/WhereWeSit.tsx and the live site, September 2026): what it is built to do. */
 different:[
  ['Asks, then follows up','Questions that follow what was actually said, not a fixed list.'],
  ['The whole family, one record','Relatives add to the same memories, each in their own name.'],
  ['Every version kept','When people remember it differently, both accounts stay, side by side.'],
  ['Today counts too','Built for the life being lived now, not only the past.'],
  ['Keeps growing','A living archive that carries on after anything is printed.'],
 ] as [string,string][],
 steps:[
  {n:'I',who:'You',title:'Set it up once.',text:'A couple of minutes on their phone or tablet, and the hour A Story should ring. You can do it while they’re in the next room.',screen:'/media/story/app/home.webp',alt:'The A Story app home screen'},
  {n:'II',who:'Them',title:'They answer the phone.',text:'No typing, nothing to open or save. Twenty minutes is a real conversation, and the next call picks up where the last one stopped.',screen:'/media/story/app/player.webp',alt:'The A Story app playing back a recorded conversation'},
  {n:'III',who:'Everyone',title:'The family keeps it.',text:'Invite anyone to read, correct and add their own memories. Inviting fifteen people costs the same as inviting nobody.',screen:'/media/story/app/memory.webp',alt:'A memory page in the A Story app, with photographs and the story as told'},
 ],
};
