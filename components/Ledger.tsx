import Link from 'next/link';
import {LocalTime} from './LocalTime';
import {FooterNext} from './FooterNext';
import originalMedia from '@/content/ledger-media.json';
import suppliedMedia from '@/content/supplied-media.json';
const media=[...originalMedia,...suppliedMedia];
export function Photo({id,priority=false,className='',caption=true,sizes='(max-width:767px) 100vw, 50vw'}:{id:string;priority?:boolean;className?:string;caption?:boolean;sizes?:string}){
 const m=media.find(m=>m.id===id);if(!m)throw Error(`Unknown media ${id}`);
 const srcset=(f:string)=>m.derivatives.filter(d=>d.format===f).map(d=>`${d.src} ${d.width}w`).join(', ');
 return <figure className={`photo ${className}`} data-kind={m.kind} data-media={id} data-frame={['portrait','smile','grad','masters-2026','wentzloff'].includes(id)?'formal':['peterson','puf-team','circuits-team','faraday','isscc','mackinac'].includes(id)?'research':m.kind==='real'?'personal':'artifact'} data-presentation={m.presentationMode} style={{'--focal-x':`${m.focalPoint.x}%`,'--focal-y':`${m.focalPoint.y}%`} as React.CSSProperties}><picture>{srcset('avif')&&<source type="image/avif" srcSet={srcset('avif')} sizes={sizes}/>}<img src={m.derivatives.find(d=>d.format==='webp')?.src} srcSet={srcset('webp')} sizes={sizes} width={m.width} height={m.height} alt={m.alt} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} decoding="async"/></picture>{(caption||m.kind==='concept')&&<figcaption>{m.caption}</figcaption>}</figure>;
}
export function Label({children,num}:{children:React.ReactNode;num?:string}){return <p className="eyebrow">{num&&<span className="chapter-number">{num}</span>}{children}</p>}
/** Pages inside the site navigate in place (and transition); files, anchors and other sites load normally. */
const inSite=(href:string)=>href.startsWith('/')&&!/^\/(documents|media)\//.test(href);
export function ArrowLink({href,children,className=''}:{href:string;children:React.ReactNode;className?:string}){const inner=<>{children}{href.startsWith('https:')&&<span aria-hidden="true">↗</span>}</>;return inSite(href)?<Link className={`arrow-link ${className}`} href={href}>{inner}</Link>:<a className={`arrow-link ${className}`} href={href}>{inner}</a>}
export function PageIntro({label,title,children}:{label:string;title:string;children?:React.ReactNode}){return <header className="page-intro container"><Label>{label}</Label><h1>{title}</h1>{children&&<div className="intro-copy">{children}</div>}</header>}
export function ContactClose(){return <section id="contact" className="contact-close blue"><div className="container"><Label num="09">The next conversation</Label><div className="contact-layout"><h2>Let’s <em>talk.</em></h2><div><p>I’m interested in ambitious products, difficult technology, and the strategy that turns one into the other.</p><ArrowLink className="solid-link" href="mailto:gbao.n.vo@gmail.com">Email Bao</ArrowLink><ArrowLink href="/contact">More ways to connect</ArrowLink></div></div><p className="small closing-note">Currently building A Story from Michigan.</p></div></section>}
export function Footer(){return <footer className="site-footer">
<div className="container">
<FooterNext/>
<div className="footer-top">
<p className="footer-line">Product. Strategy. <em>A chapter still being written.</em></p>
<nav aria-label="Footer">
<Link href="/archive">Archive</Link>
<Link href="/contact">Contact & résumés</Link>
<a href="mailto:gbao.n.vo@gmail.com">gbao.n.vo@gmail.com</a>
<a href="https://www.linkedin.com/in/gbaovo">LinkedIn ↗</a>
</nav>
</div>
<div className="footer-base">
<LocalTime/>
<span className="small">© {new Date().getFullYear()} Bao Vo</span>
<a className="footer-up" href="#main">Back to top</a>
</div>
</div>
</footer>}
/**
 * The Book's cover: navy buckram with a linen weave, a blind-stamped double
 * frame, the title in gold foil, and the Path stamped as a brass trace with a
 * via for each of its seven chapters, the last one lit (A Story, now). Outer
 * classes stay as they were: the reader's open/close animation drives them.
 */
export function BookCover({small=false}:{small?:boolean}){return <div className={`book-object bc ${small?'compact':''}`} aria-hidden="true"><div className="book-spine"><span className="bc-spine-band"/>BAO VO · THE PATH, SO FAR.<span className="bc-spine-band"/></div><div className="book-face"><span className="bc-author">Bao Vo</span><span className="bc-title">The Path,<br/><em>So Far.</em></span><svg className="bc-trace" viewBox="0 0 260 24"><line x1="8" y1="12" x2="252" y2="12"/>{[0,1,2,3,4,5,6].map(n=><circle key={n} cx={8+n*244/6} cy="12" r={n===6?4.2:3} className={n===6?'now':undefined}/>)}<circle cx="252" cy="12" r="8.5" className="halo"/></svg><span className="bc-years">Michigan · 2019 — 2026</span><span className="bc-sub">A personal record</span></div><span className="book-ribbon"/></div>}

