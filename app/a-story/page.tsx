import {StoryBrand} from '@/components/StoryBrand';
import {SectionNav} from '@/components/SectionNav';
import {pageMetadata} from '@/content/metadata';
import {ArrowLink,Label} from '@/components/Ledger';
import {story} from '@/content/story';
import '../pages.css';

export const metadata=pageMetadata('A Story — Most of a life goes undocumented','Bao Vo’s current venture. A Story calls someone you love, listens, and follows up the way someone who knows them would — and what they say becomes a private archive the whole family can add to.','/a-story');

/** A phone with one of A Story's real Figma screens; tall screens are cropped from the top. */
function Screen({src,alt,className=''}:{src:string;alt:string;className?:string}){
 return <figure className={`st-phone ${className}`}><img src={src} alt={alt} width={786} height={1704} loading="lazy" decoding="async"/></figure>;
}

export default function Page(){const w=story.witness;return <main id="main" className="story-page">
 <header className="new-story-hero">
  <div className="container">
   <div className="new-story-top"><StoryBrand/><a className="status-tag st-site" href={story.site} target="_blank" rel="noopener"><i/>{story.siteLabel} · Waitlist open <span aria-hidden="true">↗</span></a></div>
   <div className="new-story-intro">
    <div>
     <Label>The venture I’m building now · Co-founder and COO</Label>
     <h1>Most of a life<br/>goes <em>undocumented.</em></h1>
     <p>A Story calls someone you love, listens, and follows up the way someone who knows them would. What they say becomes a private archive the whole family can add to.</p>
     <div className="st-actions"><ArrowLink className="solid-link" href={story.site}>Visit {story.siteLabel}</ArrowLink><ArrowLink className="outline-link" href="#listen">Hear a conversation</ArrowLink></div>
     <p className="venture-brandline">Not a memoir to finish.<br/>A Story to keep, and to carry on.</p>
    </div>
    <div className="story-hero-product st-hero-product">
     <div className="hero-memory-note st-call-note">
      <span className="small">A STORY · CALLING JOAN</span>
      <p>“What did you<br/>notice first<br/><em>about him?</em>”</p>
      <span className="hero-memory-rule"/>
     </div>
     <Screen src="/media/story/app/home.webp" alt="The A Story app: the home screen with the question of the day and recent memories"/>
     <span className="small">The A Story app · In development</span>
    </div>
   </div>
  </div>
 </header>

 <SectionNav label="A Story sections" items={[['problem','What gets lost'],['listen','The conversation'],['how','How it works'],['voices','Every voice'],['different','What’s different'],['for','Who it’s for']]}/>

 <section id="problem" className="st-everyday blue" aria-labelledby="everyday-title">
  <div className="st-collage" aria-hidden="true">{story.everyday.map(([id,x,y,w,r])=><img key={id} src={`/media/story/everyday/${id}-640.webp`} alt="" loading="lazy" decoding="async" style={{left:`${x}%`,top:`${y}%`,'--w':w,'--r':`${r}deg`} as React.CSSProperties}/>)}</div>
  <div className="st-everyday-copy">
   <Label num="01">What gets lost</Label>
   <div className="st-everyday-pre">The wedding, the graduation, the first house — the milestones usually survive.</div>
   <h2 id="everyday-title">It’s the <em>everyday.</em></h2>
   <div className="st-everyday-post">Those slip away quietly. <b>A Story exists to catch what the photograph can’t.</b></div>
  </div>
 </section>

 <section id="listen" className="st-listen section">
  <div className="container">
   <div className="st-listen-head">
    <div><Label num="02">The conversation</Label><h2>Three calls.<br/>Nobody changes<br/>the <em>subject.</em></h2></div>
    <p>Some stories only appear because somebody asks twice. When someone lets something slip on the way to answering a different question, A Story drops its own question and goes after it.</p>
   </div>
   <div className="st-call">
    <p className="st-call-setup"><span className="st-call-dot" aria-hidden="true"/>{story.callSetup}</p>
    <ol className="st-steps-call">{story.callSteps.map((step,n)=><li key={step.verb} className="st-step">
     <div className="st-step-label"><span>{String(n+1).padStart(2,'0')}</span><b>{step.verb}</b><p>{step.note}</p></div>
     <div className="st-bubbles">{step.turns.map(t=>{const turn=story.call.turns[t];const teller=turn.who===story.call.name;
      const text=step.mark&&turn.text.includes(step.mark)?<>{turn.text.slice(0,turn.text.lastIndexOf(step.mark))}<mark>{step.mark}</mark></>:turn.text;
      return <div key={t} className={`st-bubble ${teller?'is-teller':'is-astory'}`}><i aria-hidden="true">{teller?'J':'A'}</i><div><b>{turn.who}</b><p>{text}</p></div></div>})}</div>
    </li>)}</ol>
    <p className="st-note st-note-dark">Illustrative, scripted call from the A Story website. Names are fictional.</p>
   </div>
  </div>
 </section>

 <section id="how" className="section container st-how">
  <div className="section-heading"><div><Label num="03">How it works</Label><h2>You do step one.<br/><em>That’s the whole job.</em></h2></div><p>No typing, nothing to open or save. The storyteller only has to answer the phone.</p></div>
  <ol className="st-steps">
   {story.steps.map((s,i)=><li key={s.n}>
    <Screen src={s.screen} alt={s.alt} className={i===1?'st-lift':''}/>
    <div className="st-step-n"><span>{s.n}</span><small>{s.who}</small></div>
    <h3>{s.title}</h3>
    <p>{s.text}</p>
   </li>)}
  </ol>
  <div className="st-terms"><div className="st-terms-line">Start with three days of full access, no card required. After that it falls back to Free, <em>never a lockout.</em></div><ArrowLink className="outline-link" href={`${story.site}/pricing`}>See plans on {story.siteLabel}</ArrowLink></div>
 </section>

 <section id="voices" className="section st-voices">
  <div className="container">
   <div className="section-heading"><div><Label num="04">Everyone who was there</Label><h2>Every memory has<br/><em>more than one witness.</em></h2></div><p>Invite the people who were there. Their photos, voices and versions become part of the same story, through one link with no account needed. Nothing replaces anything else, and nothing appears until the storyteller says yes.</p></div>
   <div className="st-witness">
    <article className="st-memory" aria-label={`${w.title}, a memory in the A Story app`}>
     <img src={w.photo} srcSet={`${w.photoSmall} 640w, ${w.photo} 1200w`} sizes="(max-width:767px) 92vw, 560px" width={1200} height={900} alt={w.alt} loading="lazy" decoding="async"/>
     <div className="st-memory-body">
      <p className="st-memory-date">{w.date}{w.tags.map(t=><span key={t}>{t}</span>)}</p>
      <h3>{w.title}</h3>
      <div className="st-voice st-voice-teller"><i aria-hidden="true">{w.teller.initial}</i><div><b>{w.teller.name}</b><small>Told in a call</small><p>“{w.told}”</p></div></div>
      <div className="st-pending"><span>{w.added.length} additions waiting for Walt</span><b>Review</b></div>
     </div>
    </article>
    <ol className="st-additions" aria-label="What the family added">
     {w.added.map((a,n)=><li key={a.name} style={{'--n':n} as React.CSSProperties}>
      <div className="st-voice"><i aria-hidden="true">{a.initial}</i><div><b>{a.name}</b><small>{a.role}</small><p>“{a.quote}”</p></div></div>
      <span className="st-kind">+ {a.kind}</span>
     </li>)}
    </ol>
   </div>
   <p className="st-note">Illustrative family and memory, from the A Story website. Names are fictional.</p>
  </div>
 </section>

 <section className="st-takeaway blue" aria-label="One life. Many witnesses.">
  <div className="container">
   <div className="st-takeaway-title"><span>One life.</span><span className="st-orn" aria-hidden="true"><i/></span><em>Many witnesses.</em></div>
   <div className="st-motto">Not a diary. <b>A documentary.</b></div>
  </div>
 </section>

 <section id="different" className="section container st-different">
  <div className="section-heading"><div><Label num="05">Not a memoir</Label><h2>Built for the whole family,<br/><em>not one storyteller.</em></h2></div><p>The mistake is thinking a life becomes worth recording only when it’s nearly over. You’re already living the part you’ll miss later.</p></div>
  <ol className="st-diff">{story.different.map(([title,line],n)=><li key={title}><span>{String(n+1).padStart(2,'0')}</span><h3>{title}</h3><p>{line}</p></li>)}</ol>
  <ArrowLink className="outline-link" href={`${story.site}/compare`}>How A Story compares</ArrowLink>
 </section>

 <section id="for" className="st-for blue section">
  <div className="container">
   <div className="section-heading"><div><Label num="06">Who it’s for</Label><h2>Every family has<br/><em>more to tell.</em></h2></div><p>The same conversation serves different people: a family keeping its stories, a care team getting to know a resident, and an organization holding on to what its people know.</p></div>
   <ol className="st-for-list">{story.audiences.map((a,n)=><li key={a.label}>
    <p className="st-for-label"><span>{String(n+1).padStart(2,'0')}</span>{a.label}</p>
    <h3>{a.phrase}</h3>
    <p className="st-for-lead">{a.lead}</p>
    <p className="st-for-why">{a.why}</p>
    <ArrowLink href={`${story.site}${a.href}`}>{`For ${a.label.toLowerCase()} on ${story.siteLabel}`}</ArrowLink>
   </li>)}</ol>
   <div className="st-actions st-for-actions"><ArrowLink className="solid-link" href={`${story.site}/start`}>Join the waitlist</ArrowLink><ArrowLink className="outline-link" href="/contact?topic=a-story">Talk with me about A Story</ArrowLink></div>
  </div>
 </section>

 <section className="story-ending story-final-note">
  <div className="container">
   <Label>The current chapter</Label>
   <h2>Some stories deserve better<br/>than <em>“we meant to ask.”</em></h2>
   <ArrowLink href={story.site}>Visit {story.siteLabel}</ArrowLink>
   <ArrowLink href="/work">Back to Bao’s work</ArrowLink>
   <ArrowLink href="/contact?topic=a-story">Start a conversation</ArrowLink>
  </div>
 </section>
</main>}
