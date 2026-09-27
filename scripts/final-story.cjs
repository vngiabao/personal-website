const fs=require('fs');const p='app/a-story/page.tsx';let s=fs.readFileSync(p,'utf8');
s=s.replace("import {StoryShowcase}","import {StoryBrand} from '@/components/StoryBrand';\nimport {SectionNav} from '@/components/SectionNav';\nimport {StoryShowcase}")
 .replace("@/components/StoryInteractions","@/components/MemoryDemo")
 .replace(/<img className="real-wordmark"[^>]+\/>/,'<StoryBrand/>')
 .replace('Co-founder · Active development & pilots','Co-founder and COO · In development')
 .replace('<ArrowLink href="#my-role">Why I’m building it</ArrowLink>','<p className="venture-brandline">Not a memoir to finish.<br/>A Story to keep, and to carry on.</p>')
 .replace(/<figure className="story-overview-art">.*?<\/figure>/,'<div className="story-hero-product"><div className="hero-memory-note"><span className="small">ONE CONVERSATION AT A TIME</span><p>“What do you<br/>remember<br/><em>about home?</em>”</p><span className="hero-memory-rule"/></div><img src="/media/story/home.webp" width="530" height="1242" alt="A Story Home product design" fetchPriority="high"/><span className="small">Product design · In development</span></div>')
 .replace(/<nav className="route-jumps container".*?<\/nav>/,'<SectionNav label="A Story sections" items={[[\'problem\',\'The problem\'],[\'experience\',\'The experience\'],[\'voices\',\'Multiple voices\'],[\'keepsake\',\'The archive\'],[\'my-role\',\'My role\'],[\'pilots\',\'Today\']]}/>')
 .replace('<details className="concept-walkthrough"><summary>Try a sample memory journey <span aria-hidden="true">＋</span></summary><Experience/></details>','<div className="memory-demo-heading"><Label>Try a memory journey</Label><h3>From a question<br/><em>to something shared.</em></h3></div><Experience/>')
 .replace('<Photo id="flatlay" sizes="(max-width:767px) 100vw, 55vw"/>','<figure className="keepsake-payoff"><img src="/media/story/book.webp" width="700" height="950" alt="Teal A Story keepsake concept"/><figcaption>Future keepsake concept</figcaption></figure>')
 .replace('<Label num="05">Why I’m building it</Label>','<Label num="05">Co-founder and COO</Label>')
 .replace('<Label>What I own</Label>','<Label>What I own / Co-founder and COO</Label>');fs.writeFileSync(p,s);
