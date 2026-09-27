const fs=require('fs');
function edit(file,from,to){const s=fs.readFileSync(file,'utf8');if(!s.includes(from))throw Error(file+': target missing');fs.writeFileSync(file,s.replaceAll(from,to));}
edit('components/Discovery.tsx','onClick={()=>setSelected(i)}','onClick={()=>{setSelected(i);if(matchMedia("(max-width:767px)").matches)requestAnimationFrame(()=>document.getElementById("work-preview")?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"instant":"smooth",block:"start"}))}}');
edit('components/AtGlance.tsx','<span className="proof-arrow" aria-hidden="true">↗</span>','');
edit('components/ArchiveIndex.tsx','{label} ↗','{label}');
edit('components/ArchiveIndex.tsx','Public reports and selected competition excerpts are linked in their records. Client deliverables, private A Story planning documents, and personal case material stay private.','Public reports and selected competition excerpts are linked in their records, alongside the people and context behind the work.');
edit('app/a-story/page.tsx','Our nursing-home pilots are real validation work. They help us understand the experience in care settings and identify what needs to change. They are an early learning process, not a broadly available product.','Our nursing-home pilots help us understand the experience in care settings: what makes a conversation inviting, where a person needs support, and what gives them a reason to return.');
edit('app/quality.css','.about-principles>div','.thinking-principles>article');
edit('app/quality.css','.about-principles h3','.thinking-principles h3');
edit('app/quality.css','.about-principles p','.thinking-principles p');
fs.appendFileSync('app/quality.css',`\n/* Final fit corrections from desktop and phone review. */
.project-preview{scroll-margin-top:155px}
.book-theatre[data-mode=pages] .book-right>.arrow-link{margin-top:auto}
@media(min-width:768px){.book-theatre[data-mode=pages] .book-modal{display:flex;align-items:center}.book-theatre[data-mode=pages] .book-modal .open-reader{height:min(100%,810px)}.book-theatre[data-mode=pages] .book-short-copy{display:flex;flex-direction:column;justify-content:space-between;flex:1;max-height:360px}.book-theatre[data-mode=pages] .book-short-copy>blockquote{max-width:22ch;margin-block:30px 25px}}
@media(max-width:767px){.book-theatre .reader-controls{grid-template-rows:20px 48px;gap:7px}.book-theatre[data-mode=pages] .book-right>.arrow-link{margin-bottom:0}.thinking-principles>article{padding:25px}.thinking-principles h3{font-size:30px}}
`);
