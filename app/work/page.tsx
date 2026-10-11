import {pageMetadata} from '@/content/metadata';
import {PageIntro,ArrowLink} from '@/components/Ledger';import {WorkIndex} from '@/components/Discovery';
import {projects,extras} from '@/content/projects';

const ENGINEERING=['Engineering','Research','Teaching'];
// The same set the Work browser lists: the selected projects plus the engineering extras.
const portfolio=[...projects,...extras.filter(p=>ENGINEERING.includes(p.category))];
const engineering=portfolio.filter(p=>ENGINEERING.includes(p.category)).length;
const years=portfolio.flatMap(p=>p.year.match(/\d{4}/g)??[]).map(Number);

/** A contents plate for the page: how much work, over what span, in which halves. */
function WorkContents(){return <div className="plate work-contents"><p className="eyebrow">Contents</p><p className="work-contents-total"><b>{portfolio.length}</b> projects<span>{Math.min(...years)}–{Math.max(...years)}</span></p><dl><div><dt>Engineering & research</dt><dd>{engineering}</dd></div><div><dt>Consulting, product & ventures</dt><dd>{portfolio.length-engineering}</dd></div></dl></div>}
export const metadata=pageMetadata("Selected work","Product, strategy, engineering and venture-building. Engineering, research, and commercial chapters from A Story to healthcare commercialization and real silicon work.","/work");
export default async function Page({searchParams}:{searchParams:Promise<{track?:string}>}){const q=await searchParams;const track=['engineering','commercial'].includes(q.track||'')?q.track:'all';return <main id="main"><PageIntro title="Selected work." aside={<WorkContents/>}><p>Engineering and research, alongside consulting, product, and ventures. Two overlapping bodies of work, with A Story bringing them together.</p></PageIntro><section className="section container"><WorkIndex lenses full initialTrack={track}/><div className="section-end"><ArrowLink href="/archive">Early projects, reports & the complete Archive</ArrowLink></div></section></main>}
