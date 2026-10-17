/**
 * The latest, on a slow wire under the hero (after United Carriers' news
 * ticker). Public facts only. Pauses under the pointer; without motion it is
 * a plain row that scrolls sideways.
 */
import Link from 'next/link';

const NEWS:[string,string][]=[
 ['October 2026 · A Story joins the NVIDIA Inception program','/a-story'],
 ['A Story is a Cartesia Startups grant recipient','/a-story'],
 ['A Story joins the AssemblyAI Startup Program','/a-story'],
 ['A Story is in private beta, with the App Store release in review','/a-story'],
];

export function NewsWire(){
 const row=(hidden:boolean)=><ul className="wire-row" aria-hidden={hidden||undefined}>{NEWS.map(([text,href])=><li key={text}><Link href={href} tabIndex={hidden?-1:undefined}>{text}</Link></li>)}</ul>;
 return <aside className="news-wire" aria-label="Latest news">
  <span className="wire-label"><span className="live-dot" aria-hidden="true"/>Latest</span>
  <div className="wire-track"><div className="wire-belt">{row(false)}{row(true)}</div></div>
 </aside>;
}
