'use client';
/**
 * The footer's job: say where to go next. Three destinations chosen for the
 * page being read, never the page itself. Case studies already end on their next
 * project, so here they offer the wider routes. Plain rows, one rule each, an arrow that moves on hover.
 */
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {projects} from '@/content/projects';

type Place={href:string;title:string;note:string};
const PLACES:Record<string,Place>={
 story:{href:'/a-story',title:'A Story',note:'The venture I’m building now.'},
 work:{href:'/work',title:'Selected work',note:'Engineering, research, consulting and product.'},
 book:{href:'/book',title:'The Book',note:'The same path, told in twelve chapters.'},
 about:{href:'/about',title:'About',note:'How I work, and the path here.'},
 archive:{href:'/archive',title:'The Archive',note:'Everything on the record.'},
 contact:{href:'/contact',title:'Start a conversation',note:'Email, LinkedIn and résumés.'},
};
const NEXT:Record<string,(keyof typeof PLACES)[]>={
 '/':['story','work','book'],
 '/a-story':['work','about','contact'],
 '/about':['story','work','book'],
 '/work':['story','archive','contact'],
 '/archive':['work','about','contact'],
 '/contact':['story','work','book'],
 '/book':['story','work','about'],
};
const cases=projects.filter(p=>p.href.startsWith('/work/'));

export function FooterNext(){
 const pathname=usePathname();
 let list:Place[];
 const at=cases.findIndex(p=>p.href===pathname);
 if(at>=0){
  // The case page already closes on its next project; offer the wider routes.
  list=[PLACES.work,PLACES.story,PLACES.contact];
 }else list=(NEXT[pathname]??NEXT['/']).map(k=>PLACES[k]);
 return <nav className="footer-next" aria-label="Where to go next">
  <p className="footer-next-title">Where to <em>next.</em></p>
  <ul>{list.map(p=><li key={p.href}><Link href={p.href}><strong>{p.title}</strong><span>{p.note}</span></Link></li>)}</ul>
 </nav>;
}
