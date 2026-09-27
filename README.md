# Bao Vo — Personal Website V2

The current version is the September 14, 2026 focused global navigation and Path refinement. Preserve the Michigan-blue / warm-cream identity and “From silicon to strategy.” Active brief: ../v2-planning/NAV_TIMELINE_BRIEF.txt. Earlier restart directions are historical.

## Run locally

Preview: http://127.0.0.1:3000/

From this folder, run pnpm install --frozen-lockfile, pnpm build, then pnpm start. Stop production before rebuilding or starting pnpm dev; both servers use loopback port 3000. No database or external service is required. Stack: Next.js 16.3.5, React 19.3.0, TypeScript 5.9.3.

Current focused evidence: qa/navigation-path/summary.json. Prior whole-site evidence remains in qa/precision.

## Editing map

Motion and A Story pass (September 21, 2026), after the A Story 09212026 site:
- components/motion/Intro.tsx + app/motion.css: first-visit intro (once per session, home only). The inline script in app/layout.tsx paints the navy cover before React and holds the hero; both have timeouts. Click, tap or Esc skips.
- components/ScrollMotion.tsx + lib/motion.ts: GSAP ScrollTrigger/SplitText scenes (headline rise, photo open, navy bands expanding, testimonial fill, Path rail draw, count-up, A Story call). Built in gsap.matchMedia, so reduced motion gets the static page. Stateful widgets are listed in OWN and never split.
- A Story page, second pass (September 22, 2026): Every voice now uses the live site's lake-monster family (content/story.ts `witness`, photo public/media/story/H04-*), replacing Eleanor's Sunday on /a-story; new What's different (the site's five comparison points); My role rebuilt from the business résumé (since Feb 2026; four nursing-home pilots; developers; hospitals in the U.S. and Vietnam); Today states status plainly. MemoryDemo is no longer used on /a-story. The Book cover (BookCover in components/Ledger.tsx, styles in app/book.css) is navy buckram with gold-foil title and the Path stamped as a seven-via trace.
- A Story page, fourth pass: What gets lost is one brief everyday band (collage + three lines); the full sequence stays on astoryapp.com. The conversation sits on cream with navy/white bubbles for legibility. Where it stands (résumé-derived) and all mention of Daniel were removed; Who it's for shows families, care communities and organizations in the A Story site's own words (content/story.ts `audiences`). Book chapter 10 returned to Bao's original role wording. Styles: app/story-sections.css.
- The Book (September 22, 2026): components/BookReader.tsx + content/chapters.ts + app/book.css. A title-and-contents spread opens it (?chapter=contents); each chapter is a spread with running heads, chapter number in words, drop-cap prose, a closing line and folios 1–24; photographs are tipped-in prints with photo corners. One version of the text (`pages` in chapters.ts) serves page, scroll and no-JS reading. Phones show photograph and text on one scrolling page (the Photo/Text toggle is gone). Obsolete `.book-right>p` sizing rules and an old drop-cap rule were removed from the earlier CSS layers.
- app/a-story/page.tsx + content/story.ts + app/story.css: A Story rewritten from the current astoryapp.com build (Pass 11); Joan's call turns are verbatim from its demoScripts.ts. App screens in public/media/story/app/.

- components/Home.tsx: main editorial sequence.
- app/navigation-path.css: final header offsets, continuous chronology rail, double-width A Story and vertical mobile timeline; imported last. Header styling is in components/editorial/Header.module.css.
- app/precision.css: current visual layer, imported after quality.css and earlier layers. Preserve their cascade unless deliberately consolidating it.
- content/career.ts / components/CareerMap.tsx: seven visible major milestones selected from historical source records; multi-row chronology and current A Story marker.
- components/Discovery.tsx: edition navigation and 16-entry Work browser; 11 engineering/research and five consulting/product/venture entries. Phone selection brings its preview into view.
- components/BookReader.tsx / content/chapters.ts: twelve condensed chapters, Contents overlay, native modal, edge drag, keyboard/history and full-text scrolling mode. Original prose remains in the content source.
- app/work/[slug]/page.tsx, components/CaseNav.tsx, content/case-design.json and case-copy.json: eight case studies with hero facts, active navigation, takeaways and evidence.
- components/MemoryDemo.tsx: persistent five-stage memory object and three simultaneous voices, with Perspectives / Shared memory modes. StoryShowcase.tsx composes supplied product designs with contextual artifacts in five stable-height scenes.
- content/story-demo.ts: shared fictional Eleanor / Daniel / Maya family and Sunday event. content/precision-sources.json records the verified four-nursing-home pilot claim and distinctions between illustrative examples and supplied product designs.
- app/contact/page.tsx: portrait-led Contact, email, LinkedIn, conversation starters and résumés.
- app/about/page.tsx: photographic biography, grounded How I work, research, teaching, consulting, community and education.
- content/current-story-sources.json: actual A Story brand/product provenance.
- content/generated-story-memory.json: exact prompt and provenance for public/media/story/sunday-table.webp.
- content/supplied-media.json, ledger-media.json, evidence-media.json: real-photo and source-exhibit provenance.
- public/documents: allowlisted public PDFs. Parent source folders are not publication folders.

Book links support /book?chapter=masters&mode=pages and ?mode=scroll. Previous chapter aliases resolve. Work and Archive filters remain shareable. Alternate portrait composition: /?composition=a.

## Validation

Current evidence: qa/precision. qa/quality, qa/final and qa/master are historical. pnpm build includes TypeScript validation.

- node scripts/precision-links.cjs: routes, local assets and internal destinations.
- node scripts/precision-media-audit.cjs: protected-original hashes and derivatives.
- node scripts/precision-review-server.cjs: port 3105 /__review; full route/width/state checks. Add ?focused for Home, About and A Story. Accessibility measurements use settled visual states; interaction checks retain motion.
- node scripts/precision-navigation-server.cjs: port 3107 /__navigation; history, keyboard, filters and fallbacks.
- node scripts/precision-interactions-server.cjs: port 3109; focused product/voice/memory continuity and layout checks. Open the fixture URL printed by the script.
- node scripts/precision-capture-server.cjs: port 3108; screenshot-only proxy with settled animations and sticky content in normal flow.
- node scripts/precision-stitch.cjs: combine saved actual-browser viewport tiles.
- node scripts/precision-summarize.cjs: consolidate the latest route/width results and fail on unresolved recorded errors.

Fixtures are local tools, not application routes. One-shot prepare/edit/polish scripts are development history, not setup commands. See RELEASE_REPORT.md and CREATIVE_DIRECTION.md. Source backup: ../v2-planning/before-final-ux-2026-09-14.zip; unchanged public assets remain in place.

