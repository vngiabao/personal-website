'use client';
/**
 * A 404 that tries to help: it reads the address that failed, finds the
 * closest real page (case studies, chapters, sections) and offers it, with a
 * search of the Archive for the words in the address.
 */
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {projects,extras} from '@/content/projects';

type Page={href:string;title:string};
const PAGES:Page[]=[
 {href:'/',title:'Home'},{href:'/work',title:'Selected work'},{href:'/a-story',title:'A Story'},{href:'/about',title:'About'},
 {href:'/archive',title:'The Archive'},{href:'/contact',title:'Contact'},{href:'/book',title:'The Book'},
 ...projects.filter(p=>p.href.startsWith('/work/')).map(p=>({href:p.href,title:p.title})),
 ...extras.map(p=>({href:'/archive#'+p.slug,title:p.title})),
];
const words=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function distance(a:string,b:string){
 const d=Array.from({length:a.length+1},(_,i)=>[i,...Array(b.length).fill(0)]);
 for(let j=1;j<=b.length;j++)d[0][j]=j;
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
 return d[a.length][b.length];
}
function closest(path:string){
 const q=words(decodeURIComponent(path));if(!q)return [];
 return PAGES.map(p=>{
  const key=words(p.href.split(/[/#]/).filter(Boolean).pop()||'home'),title=words(p.title);
  const shared=q.split(' ').filter(w=>w.length>2&&(key.includes(w)||title.includes(w))).length;
  return {...p,score:Math.min(distance(q,key),distance(q,title))/Math.max(q.length,1)-shared*.35};
 }).sort((a,b)=>a.score-b.score).slice(0,3);
}

export function LostPage(){
 const [path,setPath]=useState('');
 useEffect(()=>setPath(location.pathname),[]);
 const best=path?closest(path):[];
 const query=words(decodeURIComponent(path));
 return <div className="lost">
  {best[0]&&best[0].score<.75&&<p className="lost-guess">Were you looking for <Link href={best[0].href}>{best[0].title}</Link>?</p>}
  {best.length>0&&<><p className="eyebrow">Close matches</p><ul className="lost-list">{best.map(p=><li key={p.href}><Link href={p.href}>{p.title}</Link><span>{p.href}</span></li>)}</ul></>}
  {query&&<p className="lost-search"><Link href={`/archive?q=${encodeURIComponent(query)}`}>Search the Archive for “{query}”</Link></p>}
  <p className="lost-home">Or start from <Link href="/">the beginning</Link>.</p>
 </div>;
}
