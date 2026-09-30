'use client';
/**
 * Site-wide scroll scenes, rebuilt on every route.
 *
 * Replaces the IntersectionObserver fade that gave every block the same
 * 18px rise. Motion now has a small vocabulary, each move with one meaning:
 *
 *   rise   — headlines arrive line by line from behind a mask.
 *   open   — photographs open from their centre as you reach them.
 *   expand — navy bands grow from an inset card to the full width, marking
 *            the move from the cream record into a chapter that matters.
 *   fill   — one sentence per page (the testimonial) fills in as it is read.
 *   draw   — the Path's rail is drawn by the reader's scroll.
 *   count  — the numbers on the record count up once.
 *
 * Home and A Story were authored first; about(), workIndex(), archive(),
 * contact() and caseStudy() give every other page the same vocabulary rather
 * than leaving it on everyPage()'s generic rise.
 *
 * Everything is authored inside gsap.matchMedia, so reduced motion gets the
 * complete static page and every tween, pin and split is reverted on route
 * change. Stateful widgets (the Book, the product theatre, the Path's detail
 * panel) own their own motion and are never split or hidden from here — see
 * OWN. The two React-rendered lists in OWN (the Archive's records, the Work
 * browser's rows) are the exception: they arrive once through arriveRowsOnce,
 * which hands the list back to React the moment it re-renders.
 */
import {useLayoutEffect} from 'react';
import {usePathname} from 'next/navigation';
import {gsap,ScrollTrigger,SplitText,MOTION,EASE,riseLines,openMasks,refreshWhenSettled,type Conditions} from '@/lib/motion';
import {introReleased} from './motion/introSignal';

/** Widgets that re-render their own text or run their own transitions. */
const OWN='.reader-shell,.book-map,.story-showcase,.shared-memory-demo,.memory-journey,.voices-object,.experience-object,.career-map,.archive-index,.chapter-nav,.project-browser,.work-lenses,dialog,.identity-hero,.site-intro';
const free=<T extends Element>(els:T[])=>els.filter(e=>!e.closest(OWN));
const all=<T extends Element=HTMLElement>(root:ParentNode,sel:string)=>[...root.querySelectorAll<T & Element>(sel)] as T[];

/** A block rises into place once; inline styles are cleared so hover and selected states keep their own transforms. */
function arrive(targets:Element[],vars:{stagger?:number;y?:number;delay?:number;trigger?:Element|false}={}){
 if(!targets.length)return;
 const {stagger=.08,y=28,delay=0,trigger}=vars;
 gsap.from(targets,{y,opacity:0,duration:1.1,ease:EASE,stagger,delay,clearProps:'transform,opacity',
  scrollTrigger:trigger===false?undefined:{trigger:trigger??targets[0],start:'top 88%',once:true}});
}

/** Many small blocks down a page: each arrives as its own row enters. */
function arriveEach(targets:Element[]){
 if(!targets.length)return;
 gsap.set(targets,{y:24,opacity:0});
 ScrollTrigger.batch(targets,{start:'top 90%',once:true,
  onEnter:batch=>gsap.to(batch,{y:0,opacity:1,duration:1,ease:EASE,stagger:.06,overwrite:true,clearProps:'transform,opacity'})});
}

/**
 * A number counts up once as it is read. Used by the record on home, the
 * teaching figure on About, and a case study's impact table.
 */
function countUp(value:Element,restore:(()=>void)[]){
 const text=[...value.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&/\d/.test(n.textContent??''));
 if(!text)return;
 const original=text.textContent!;
 const match=original.match(/\d+(\.\d+)?/);
 if(!match)return;
 const target=parseFloat(match[0]),places=match[1]?match[1].length-1:0;
 const n={v:0};
 text.textContent=original.replace(match[0],(0).toFixed(places));
 gsap.to(n,{v:target,duration:1.6,ease:'power3.out',scrollTrigger:{trigger:value,start:'top 90%',once:true},
  onUpdate:()=>{text.textContent=original.replace(match[0],n.v.toFixed(places))}});
 // Revert restores the authored figure.
 restore.push(()=>{text.textContent=original});
}

/** One sentence fills in as it is read: the site's signature for a claim it stands behind. */
function fillWords(quote:Element){
 const words=SplitText.create(quote,{type:'words'});
 gsap.fromTo(words.words,{opacity:.16},{opacity:1,ease:'none',stagger:.1,
  scrollTrigger:{trigger:quote,start:'top 82%',end:'bottom 52%',scrub:.6}});
}

/**
 * A React-rendered list arrives once, on the reader's first pass. Re-renders
 * (the Archive's filters, the Work browser's lenses) are repeated actions, so
 * they resolve instantly: the first mutation clears the entrance and the
 * observer stops. Nothing can be left hidden by a row that never scrolled in.
 */
function arriveRowsOnce(list:Element,selector:string){
 const rows=[...list.querySelectorAll(selector)];
 if(!rows.length)return()=>{};
 gsap.set(rows,{y:22,opacity:0});
 const batch=ScrollTrigger.batch(rows,{start:'top 92%',once:true,
  onEnter:group=>gsap.to(group,{y:0,opacity:1,duration:.9,ease:EASE,stagger:.05,overwrite:true,clearProps:'transform,opacity'})});
 const stop=()=>{batch.forEach(t=>t.kill());gsap.set(rows,{clearProps:'transform,opacity'})};
 const observer=new MutationObserver(()=>{stop();observer.disconnect()});
 observer.observe(list,{childList:true});
 return()=>{observer.disconnect();stop()};
}

/** Photographs open from the centre while the print settles from a slight zoom. */
function openPhoto(figure:Element){
 const picture=figure.querySelector('picture'),img=figure.querySelector('img');
 if(!picture||!img)return;
 const st={trigger:figure,start:'top 86%',once:true};
 gsap.fromTo(picture,{clipPath:'inset(14% 12% 14% 12%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.5,ease:'expo.inOut',clearProps:'clipPath',scrollTrigger:st});
 gsap.fromTo(img,{scale:1.22},{scale:1,duration:1.9,ease:EASE,clearProps:'transform',scrollTrigger:st});
}

function home(main:HTMLElement,c:Conditions){
 const q=(sel:string)=>all(main,sel);
 const restore:(()=>void)[]=[];

 // ── Hero. Built paused behind the intro (or the hold class on repeat
 // visits) and played the moment the cover starts to lift.
 const hero=main.querySelector('.identity-hero');
 if(hero){
  const h1=hero.querySelector('h1')!;
  const split=SplitText.create(h1,{type:'lines',mask:'lines'});
  // Set this tight (line-height .9), Brygada's italic g and y reach well below the line box.
  openMasks(split.masks,'.46em');
  const frame=hero.querySelector('.arch-frame');
  // Once the entrance has settled, the hero answers the pointer: the arch
  // tilts a few degrees with the portrait moving against it (depth), and the
  // headline's weight gathers toward the pointer. Mouse only; decorative.
  const respond=()=>{
   if(!c.wide||!matchMedia('(hover: hover) and (pointer: fine)').matches||!frame)return;
   const img=frame.querySelector('img');
   gsap.set(frame,{transformPerspective:1200,transformOrigin:'50% 60%'});
   if(img)gsap.set(img,{scale:1.07});
   const rx=gsap.quickTo(frame,'rotationX',{duration:1,ease:'power3'}),ry=gsap.quickTo(frame,'rotationY',{duration:1,ease:'power3'});
   const ix=img?gsap.quickTo(img,'x',{duration:1.2,ease:'power3'}):null,iy=img?gsap.quickTo(img,'y',{duration:1.2,ease:'power3'}):null;
   const weight=gsap.quickTo(h1,'fontWeight',{duration:.8,ease:'power2'});
   const move=(e:PointerEvent)=>{
    const box=hero.getBoundingClientRect();if(box.bottom<0)return;
    const nx=e.clientX/innerWidth-.5,ny=e.clientY/innerHeight-.5;
    ry(nx*7);rx(-ny*5);ix?.(-nx*16);iy?.(-ny*12);
    const r=h1.getBoundingClientRect(),d=Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2));
    weight(640+gsap.utils.clamp(0,1,1-d/650)*70);
   };
   window.addEventListener('pointermove',move,{passive:true});
   restore.push(()=>window.removeEventListener('pointermove',move));
  };
  const tl=gsap.timeline({paused:true,onComplete:respond});
  tl.from(all(hero,'.identity-copy > .eyebrow, .hello-line'),{y:16,opacity:0,duration:1,ease:EASE,stagger:.08},0)
   .from(split.lines,{yPercent:115,duration:1.35,ease:EASE,stagger:.11},.12)
   // Unmask as soon as the lines have landed, not when the whole entrance
   // ends: the masks would otherwise clip the italic descenders while the
   // weight is still settling.
   .add(()=>split.revert(),1.6)
   // "From silicon" is deposited: it rises as a hairline, narrow cut and
   // settles into its full weight. It only ever grows toward its authored
   // width, so the line masks never clip it. The serif "strategy." keeps
   // its own weight and is untouched.
   .fromTo(h1,{fontWeight:260,fontStretch:'75%'},{fontWeight:640,fontStretch:'86%',duration:2.1,ease:'expo.out',clearProps:'fontWeight,fontStretch'},.12)
   .from(all(hero,'.identity-description, .identity-actions, .hero-discovery, .current-note'),{y:22,opacity:0,duration:1.1,ease:EASE,stagger:.08,clearProps:'transform,opacity'},.5);
  if(frame){
   tl.fromTo(frame,{clipPath:'inset(100% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.5,ease:'expo.inOut',clearProps:'clipPath'},0)
    .from(frame.querySelector('img'),{scale:1.3,duration:2.1,ease:EASE,clearProps:'transform'},.1)
    .from(hero.querySelector('.identity-caption'),{y:12,opacity:0,duration:.9,ease:EASE},1);
  }
  tl.from(main.querySelector('.chapter-nav'),{opacity:0,duration:.8},1.1);
  // The hero is now held by its from() states, not by the class.
  document.documentElement.classList.remove('hero-hold');
  introReleased.then(()=>tl.play());
  if(c.wide)gsap.to(hero.querySelector('.identity-image'),{yPercent:9,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});
 }

 // ── The Path. The rail is drawn by the reader; the stops arrive in order.
 const route=main.querySelector('.chronology-route');
 if(route){
  const rail=route.querySelector<SVGPathElement>('.chronology-rail path:not(.rail-directions)');
  if(rail)gsap.fromTo(rail,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:route,start:'top 78%',end:'bottom 62%',scrub:.8}});
  gsap.from(route.querySelector('.rail-directions'),{opacity:0,duration:.6,scrollTrigger:{trigger:route,start:'center 62%',toggleActions:'play none none reverse'}});
  arrive(all(route,'.chronology-stops > button'),{stagger:.07,trigger:route});
  arrive(q('.career-stage, .career-controls'),{stagger:.1});
 }

 // ── The Book: the closed volume lifts toward the reader as the band opens.
 const book=main.querySelector('.home-book-section .book-object');
 if(book&&c.wide)gsap.from(book,{y:90,rotation:-5,ease:'none',scrollTrigger:{trigger:book,start:'top bottom',end:'center 55%',scrub:1}});

 // ── A Story. The product theatre arrives as one object; its tabs are its own.
 arrive(q('.venture-kicker > *'),{stagger:.1});
 arrive(q('.venture-intro > :not(h2)'),{stagger:.07});
 arrive(q('.venture-feature > .story-showcase'),{y:60});
 arrive(q('.venture-principles > div'),{stagger:.1});

 // ── Selected work: the lenses, then the list row by row.
 restore.push(workIndex(main));

 // ── On the record: each figure counts up once, in place.
 q('.proof-value').forEach(value=>countUp(value,restore));
 arriveEach(q('.proof-point'));

 // ── Recognition: the testimonial fills in as it is read.
 const quote=main.querySelector('.recognition blockquote');
 if(quote)fillWords(quote);
 const award=main.querySelector('.recognition-photo');
 if(award){
  gsap.from(award,{y:120,rotation:'-=9',opacity:0,duration:1.6,ease:EASE,clearProps:'transform,opacity',scrollTrigger:{trigger:award,start:'top 88%',once:true}});
  gsap.from(award.querySelector('.award-sticker'),{scale:.4,rotation:-24,opacity:0,duration:1,ease:'back.out(2)',delay:.7,clearProps:'transform,opacity',scrollTrigger:{trigger:award,start:'top 88%',once:true}});
 }
 arrive(q('.recognition-records > a'),{stagger:.1});

 // ── Archive: the three prints are dealt onto the table.
 const cards=q('.archive-cards > a');
 if(cards.length)gsap.from(cards,{y:140,x:(i:number)=>(1-i)*60,rotation:(i:number)=>(i-1)*-10,opacity:0,duration:1.4,ease:EASE,stagger:.13,clearProps:'transform,opacity',scrollTrigger:{trigger:cards[0].parentElement,start:'top 82%',once:true}});

 // ── Off the clock: the four prints drift at their own depths.
 if(c.wide)q('.personal-grid > .photo').forEach((p,i)=>gsap.fromTo(p,{y:[50,-20,70,10][i%4]},{y:[-40,30,-50,-10][i%4],ease:'none',scrollTrigger:{trigger:p.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));

 return()=>restore.forEach(r=>r());
}

function story(main:HTMLElement){
 const q=(sel:string)=>all(main,sel);
 // What gets lost: the everyday collage drifts at its own depths behind the words.
 q('.st-collage img').forEach((img,n)=>gsap.fromTo(img,{y:[60,-30,90,20][n%4]},{y:[-50,40,-70,-20][n%4],ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
 arrive(q('.st-everyday-pre, .st-everyday-post'),{stagger:.2,delay:.2});
 // The call plays step by step: the verb, then each line of the exchange.
 arrive(q('.st-call-setup'));
 q('.st-step').forEach(step=>{
  const st={trigger:step,start:'top 78%',once:true};
  gsap.from(step.querySelector('.st-step-label'),{y:24,opacity:0,duration:1,ease:EASE,clearProps:'transform,opacity',scrollTrigger:st});
  gsap.from(step.querySelectorAll('.st-bubble'),{y:26,opacity:0,duration:.9,ease:EASE,stagger:.45,delay:.3,clearProps:'transform,opacity',scrollTrigger:st});
 });
 // Who it's for: the three audiences step in.
 arrive(q('.st-for-list > li'),{stagger:.12,y:40});
}

/**
 * The Work browser, on home and on /work alike. The lenses and filters set
 * the frame, the list arrives row by row, and the preview follows. The list
 * is React's, so it arrives once and then answers the filters instantly.
 */
function workIndex(main:HTMLElement){
 arrive(all(main,'.work-lenses > *'),{stagger:.1});
 arrive(all(main,'.work-filters'));
 const selectors=main.querySelector('.project-selectors');
 const undo=selectors?arriveRowsOnce(selectors,':scope > *'):()=>{};
 arrive(all(main,'.project-preview'),{y:50});
 return undo;
}

/**
 * About. The page argues that one discipline runs through different problems,
 * so its three methods are counted out one at a time, the pull quote fills in
 * as the claim it is, and the teaching figure counts up beside it.
 */
function about(main:HTMLElement,c:Conditions){
 const q=(sel:string)=>all(main,sel);
 const restore:(()=>void)[]=[];

 // The hero portrait rides a little against the scroll, so the opening has depth.
 if(c.wide)gsap.to(main.querySelector('.about-portrait > .photo'),{yPercent:7,ease:'none',
  scrollTrigger:{trigger:main.querySelector('.about-hero'),start:'top top',end:'bottom top',scrub:true}});
 arrive(q('.portrait-note'),{delay:.5,y:14});

 // How I work: each method steps forward with its own index.
 q('.work-methods > article').forEach((article,i)=>{
  const st={trigger:article,start:'top 82%',once:true};
  gsap.from(article,{y:34,opacity:0,duration:1.1,ease:EASE,delay:i*.06,clearProps:'transform,opacity',scrollTrigger:st});
  gsap.from(article.querySelector('.method-index'),{opacity:0,x:-14,duration:1,ease:EASE,delay:.22+i*.06,clearProps:'transform,opacity',scrollTrigger:st});
 });

 // The path: the two chapters of the essay, then the claim they add up to.
 arrive(q('.path-essay > article'),{stagger:.14,y:34});
 const pullquote=main.querySelector('.about-pullquote');
 if(pullquote)fillWords(pullquote);

 // Research: the keywords are set like index terms, in order.
 arrive(q('.research-keywords > span'),{stagger:.05,y:12});

 // Teaching: four hundred students, counted.
 q('.about-numeral').forEach(value=>countUp(value,restore));

 // Outside work: the prints drift at their own depths, as they do on home.
 if(c.wide)q('.outside-composition .photo').forEach((p,i)=>
  gsap.fromTo(p,{y:[40,-20,55][i%3]},{y:[-35,25,-45][i%3],ease:'none',
   scrollTrigger:{trigger:p.closest('.outside-composition'),start:'top bottom',end:'bottom top',scrub:true}}));

 // Education: the two records, then the people behind them.
 arrive(q('.education-spread > div'),{stagger:.14,y:36});
 arrive(q('.mentorship-note > *'),{stagger:.12,y:30});

 return()=>restore.forEach(r=>r());
}

/** The Archive. A ruled index sets itself line by line as the reader arrives. */
function archive(main:HTMLElement){
 arrive(all(main,'.archive-controls'),{y:24});
 arrive(all(main,'.archive-results-line'),{y:14,delay:.15});
 const records=main.querySelector('.archive-records');
 const undo=records?arriveRowsOnce(records,':scope > .archive-record'):()=>{};
 arrive(all(main,'.archive-source-note > *'),{stagger:.1});
 return undo;
}

/** Contact. The page is one invitation, so it opens rather than assembles. */
function contact(main:HTMLElement,c:Conditions){
 const q=(sel:string)=>all(main,sel);
 arrive(q('.contact-primary > *'),{stagger:.08,delay:.5,y:20});
 arrive(q('.contact-direct > *'),{stagger:.08,delay:.7,y:16});
 arrive(q('.contact-current'),{delay:.6,y:20});
 if(c.wide)gsap.to(main.querySelector('.contact-portrait > .photo'),{yPercent:6,ease:'none',
  scrollTrigger:{trigger:main.querySelector('.contact-hero'),start:'top top',end:'bottom top',scrub:true}});
 // The three ways in, dealt out in order.
 arrive(q('.contact-invitations > .container > div > a'),{stagger:.1,y:38});
 arrive(q('.contact-resumes > div'),{stagger:.12,y:26});
}

/**
 * A case study. The impact table is the evidence, so it is set out fact by
 * fact; the takeaway fills in as it is read, the way the home page's
 * testimonial does.
 */
function caseStudy(main:HTMLElement){
 const q=(sel:string)=>all(main,sel);
 arrive(q('.case-thesis'),{delay:.3,y:20});
 // The impact table is evidence: each fact is set down in turn, not counted
 // (these are process names and places, not quantities).
 const impact=main.querySelector('.case-impact');
 if(impact)arrive(all(impact,':scope > div'),{stagger:.08,y:22,trigger:impact});
 // The contents list finds its place before the reader starts the first chapter.
 arrive(q('.case-navigation a'),{stagger:.05,y:14});
 // The spec sheet reads as a report: a row at a time.
 arrive(q('.spec-sheet dl > div'),{stagger:.07,y:16});
 q('.case-takeaway').forEach(fillWords);
 arrive(q('.case-curated-artifact, .artifact-links > *'),{stagger:.08,y:22});
}

function everyPage(main:HTMLElement,c:Conditions){
 // Page titles rise on arrival; everything else in their opening block follows.
 free(all(main,'h1')).filter(h=>!h.classList.contains('sr-only')).forEach(h1=>{
  riseLines(h1,{delay:.1,trigger:false,stagger:.1});
  arrive([...h1.parentElement!.children].filter(e=>e!==h1&&e.tagName!=='H1'),{delay:.35,stagger:.07,trigger:false});
 });
 free(all(main,'h2')).forEach(h2=>riseLines(h2));

 // Photographs open; source exhibits (artifacts) stay as documents.
 free(all(main,'figure.photo')).filter(f=>f.getAttribute('data-kind')!=='concept').forEach(openPhoto);

 // Reading blocks arrive as their row enters, skipping the ones home already
 // choreographed and anything nested in another arriving block.
 const handled='.st-everyday-copy, .st-for-list, .st-call-setup, .st-steps-call, .st-transcript, .st-margin, .st-steps, .st-memory, .st-additions, .st-diff, .st-own, .new-venture, .proof-point, .recognition blockquote, .recognition-records, .archive-cards, .work-filters';
 const opening=new Set(free(all(main,'h1')).map(h=>h.parentElement));
 const blocks=free(all(main,'p, ul, ol, blockquote, table, .arrow-link, .eyebrow')).filter(el=>
  !el.closest('h1, h2, h3, '+handled)&&
  !opening.has(el.parentElement)&&
  !el.parentElement!.closest('p, ul, ol, blockquote, table, .arrow-link'));
 arriveEach(blocks);

 // Navy bands grow from an inset card to the full width as they arrive.
 if(c.wide)all(main,'section.blue, .home-book-section').forEach(band=>{
  gsap.fromTo(band,{clipPath:'inset(0% 3% 0% 3% round 40px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',
   scrollTrigger:{trigger:band,start:'top 96%',end:'top 18%',scrub:.6,
    // At rest the band is not clipped at all, so nothing inside it is cut.
    onLeave:()=>{band.style.clipPath='none'},onEnterBack:()=>{band.style.clipPath=''}}});
 });
}

export function ScrollMotion(){
 const pathname=usePathname();
 useLayoutEffect(()=>{
  document.documentElement.dataset.hydrated='true';
  const main=document.querySelector<HTMLElement>('main');
  if(!main)return;
  const mm=gsap.matchMedia();
  mm.add(MOTION,context=>{
   const c=context.conditions as Conditions;
   if(!c.motion)return;
   // One scene set per page, chosen the way the page identifies itself.
   const undo:(()=>void)[]=[];
   const add=(u?:(()=>void)|void)=>{if(u)undo.push(u)};
   if(main.classList.contains('new-home'))add(home(main,c));
   if(main.classList.contains('story-page'))story(main);
   if(main.classList.contains('about-editorial'))add(about(main,c));
   if(main.classList.contains('contact-editorial'))contact(main,c);
   if(main.classList.contains('case-page'))caseStudy(main);
   if(main.querySelector('.archive-index'))add(archive(main));
   // /work runs the same browser home does, without home's other scenes.
   if(!main.classList.contains('new-home')&&main.querySelector('.project-browser'))add(workIndex(main));
   everyPage(main,c);
   return()=>undo.forEach(u=>u());
  });
  // Without motion the hero is never held.
  if(!matchMedia(MOTION.motion).matches)document.documentElement.classList.remove('hero-hold');
  const settle=refreshWhenSettled();
  return()=>{settle();mm.revert()};
 },[pathname]);
 return null;
}
