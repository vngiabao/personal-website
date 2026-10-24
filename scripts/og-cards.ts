/**
 * Share cards for every page (1200 × 630), written to public/og/.
 * Rendered with the site's own fonts and the GB mark, from the same content
 * the pages use. Re-run after changing a page's title or image:
 *   pnpm og
 * content/metadata.ts points each route at its card (home keeps social-card.png).
 */
import {chromium} from 'playwright';
import {readFileSync,existsSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import copy from '../content/case-copy.json';
import designs from '../content/case-design.json';
import media from '../content/ledger-media.json';
import {projects} from '../content/projects';
import {GB_VIEWBOX,GB_LETTERS,GB_DOT} from '../components/brand/gbPaths';

const ROOT=process.cwd(),OUT=join(ROOT,'public/og');
const b64=(f:string)=>readFileSync(join(ROOT,f)).toString('base64');
const img=(f:string)=>`data:image/${f.endsWith('.png')?'png':'webp'};base64,${b64(f)}`;
const fonts=`@font-face{font-family:Mona;src:url(data:font/woff2;base64,${b64('public/fonts/mona-sans-latin-wdth-normal.woff2')}) format('woff2');font-weight:200 900;font-stretch:75% 125%}
@font-face{font-family:Brygada;src:url(data:font/woff2;base64,${b64('public/fonts/brygada-1918-normal.woff2')}) format('woff2');font-weight:400 700}
@font-face{font-family:Brygada;font-style:italic;src:url(data:font/woff2;base64,${b64('public/fonts/brygada-1918-italic.woff2')}) format('woff2');font-weight:400 700}`;

const mark=(ink:string,dot:string,h:number)=>`<svg viewBox="${GB_VIEWBOX}" style="height:${h}px;width:auto;display:block"><path d="${GB_LETTERS}" fill="${ink}" fill-rule="evenodd"/><circle cx="${GB_DOT.cx}" cy="${GB_DOT.cy}" r="${GB_DOT.r}" fill="${dot}"/></svg>`;

/** The largest web image of a ledger photo, or an evidence cover. */
function picture(id:string){
 const m=(media as {id:string;derivatives:{src:string;width:number;format:string}[]}[]).find(x=>x.id===id);
 if(m){const d=m.derivatives.filter(x=>x.format==='webp').sort((a,b)=>b.width-a.width)[0];if(d)return 'public'+d.src}
 const ev=`public/media/evidence/${id}.webp`;return existsSync(join(ROOT,ev))?ev:null;
}

type Card={name:string;label:string;title:string;line?:string;image?:string|null;dark?:boolean;fit?:'cover'|'contain';pos?:string;paper?:boolean};
const esc=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');

function html(c:Card){
 const ink=c.dark?'#fbf8f1':'#0d2238',muted=c.dark?'rgb(251 248 241/.75)':'#545f6b',brass=c.dark?'#e8c064':'#7a5612';
 const size=c.title.length>44?64:c.title.length>30?76:88;
 const ground=c.dark?'background:#00274c;background-image:repeating-linear-gradient(0deg,rgb(255 255 255/.018) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgb(255 255 255/.014) 0 1px,transparent 1px 3px)':'background:#f5f1e8';
 const visual=c.image?`<div style="margin:56px 56px 56px 0;border-radius:14px;overflow:hidden;background:${c.dark?'#0b2f55':c.paper?'#fff':'#fbf8f1'};box-shadow:inset 0 0 0 1px rgb(13 34 56/.12),0 30px 60px -40px rgb(13 34 56/.6)"><img src="${img(c.image)}" style="width:100%;height:100%;object-fit:${c.fit||'cover'};object-position:${c.pos||'50% 30%'};display:block"/></div>`:'';
 return `<html><head><style>${fonts}*{box-sizing:border-box;margin:0}</style></head><body>
 <div style="width:1200px;height:630px;${ground};display:grid;grid-template-columns:${c.image?'1fr 440px':'1fr'};overflow:hidden">
  <div style="padding:56px 64px 54px 72px;display:flex;flex-direction:column">
   <div style="display:flex;align-items:center;gap:16px">${mark(ink,c.dark?'#e8c064':'#b58420',38)}<span style="font:400 23px/1 Brygada;letter-spacing:.17em;color:${ink}">G. BAO VO</span></div>
   <p style="margin-top:auto;font:560 15px/1.3 Mona;font-stretch:116%;letter-spacing:.17em;color:${brass}">${esc(c.label.toUpperCase())}</p>
   <h1 style="margin-top:18px;font:640 ${size}px/.98 Mona;font-stretch:86%;letter-spacing:-.025em;color:${ink};max-width:${c.image?'640px':'960px'}">${esc(c.title)}</h1>
   <div style="margin-top:28px;width:64px;height:1.5px;background:${c.dark?'#e8c064':'#b58420'}"></div>
   ${c.line?`<p style="margin-top:24px;font:450 21px/1.45 Mona;color:${muted};max-width:${c.image?'600px':'860px'}">${esc(c.line)}</p>`:''}
  </div>${visual}
 </div></body></html>`;
}

const cards:Card[]=[
 {name:'a-story',label:'A Story · Co-founder, COO & CTO',title:'Family stories, in the voices that lived them.',line:'An AI biographer that calls the people you love and helps them tell their stories in their own voice.',image:'public/media/story/app/home.webp',fit:'cover',pos:'50% 0%'},
 {name:'about',label:'About G. Bao Vo',title:'I started in engineering. I kept looking around it.',line:'Co-founder, COO & CTO of A Story. Strategy consulting before that. Vietnam to Michigan.',image:picture('smile')},
 {name:'work',label:'Selected work',title:'Ventures, strategy and product.',line:'A Story, healthcare commercialization and case work, built on an engineering foundation.'},
 {name:'archive',label:'The Archive',title:'Everything else, kept on file.',line:'Early projects, reports and community work, searchable in one index.'},
 {name:'contact',label:'Contact',title:'Let’s talk.',line:'If you are building something difficult, whether a market or a product a family will trust, I’d like to hear about it.',image:picture('portrait'),pos:'50% 20%'},
 {name:'book',label:'A personal record · 12 chapters',title:'The Path, So Far.',line:'Michigan, strategy, and the chapter that became A Story, as a book you can page through.',dark:true},
 ...copy.map(c=>{
  const p=projects.find(x=>x.slug===c.slug)!;const d=(designs as Record<string,{thesis:string}>)[c.slug];
  // Competition decks are landscape title slides: shown whole, on white.
  const doc=['aurora-market-entry','cagrisema-launch-strategy'].includes(c.slug);
  const image=doc?`public/media/evidence/${c.slug==='aurora-market-entry'?'aurora':'cagrisema'}-cover.webp`:picture(p.image);
  return {name:'work--'+c.slug,label:`${p.category} · ${p.year}`,title:c.title,line:d?.thesis,image,fit:(doc?'contain':'cover') as 'cover'|'contain',pos:'50% 40%',paper:doc};
 }),
];

(async()=>{
 mkdirSync(OUT,{recursive:true});
 const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1200,height:630}});
 for(const c of cards){await page.setContent(html(c));await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(150);await page.screenshot({path:join(OUT,c.name+'.png')});console.log('og/'+c.name+'.png')}
 await browser.close();
})();
