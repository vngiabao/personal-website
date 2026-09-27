const fs=require('fs');
const report=`# Global navigation and Path refinement

Date: September 14, 2026. Production build: QygSHc3N4NeI8PVMys0SJ.
Preview: http://127.0.0.1:3000/

## Delivered

Focused implementation of the latest NAV_TIMELINE_BRIEF. The existing site, Book, content and photography are preserved.

- Global navigation: cream fixed header, 74px desktop height shrinking to 64px, reserved layout space, serif wordmark with static brass period, readable links, active route underline and primary navy Contact. Mobile has a 64px header, 46px menu control and full-width cream navigation sheet.
- Path: four chapters across the first row, WICS then miLEAD on the reverse lower row, and a double-width A Story destination. One continuous SVG rail makes a rounded right-side turn, with two restrained direction cues.
- Selection: stable card and rail geometry, navy selected state, brass lower edge, persistent NOW marker and pale-sage A Story resting state. One-time entrance motion respects reduced motion.
- Below 1024px: a vertical chronological stack, readable dates/titles/categories and an expanded phone A Story card. The existing chapter detail panel, links and history remain connected.

## Verification

Production build and TypeScript passed. 623 focused checks passed with zero failures across seven routes and five widths (390, 768, 1024, 1440, 1728). These cover active routes including nested Work, header target sizes, stable content during shrink, menu operation, all seven timeline selections at each width, fixed rail/card geometry, current-state visibility, text bounds and settled axe WCAG A/AA checks within the changed surfaces.

Manual browser checks confirmed chronological Tab order, Enter selection, browser Back restoration, mobile focus cycling in both directions, Escape and trigger-focus restoration, automatic menu closing on desktop resize, and Book opening, keyboard page turn and closing.

Live link audit: 15 routes, 48 local assets and 18 internal destinations; zero failures. Media was not modified in this pass.

## Visual evidence

All requested 40 route/state/width views were captured and compared side by side: five navigation views at four widths and four timeline states at five widths. Vertical timelines use two viewport tiles, producing 48 primary PNGs, plus a mobile menu view. Nine review boards and individual captures are in qa/navigation-path.

The local screenshot proxy adds only capture navigation/readiness helpers; production motion and sticky behavior remain enabled. Transition-frame captures were replaced with settled captures before review. Keyboard focus outlines visible in some screenshots are intentional. An initial phone A Story height override was corrected before the final build and all 623 checks were rerun.

Current evidence: qa/navigation-path/summary.json, checks.json, manual.json, links.json and board-*.png. Prior whole-site evidence remains in qa/precision; those broader checks are historical, not claimed as rerun for this focused pass.

## Scope and handoff

No public deployment. Preview remains on loopback port 3000. Source backup: ../v2-planning/before-nav-timeline-2026-09-14.zip. Authoritative brief: ../v2-planning/NAV_TIMELINE_BRIEF.txt.

Changed production files: components/editorial/Header.tsx, Header.module.css, components/CareerMap.tsx, app/navigation-path.css and app/layout.tsx. The new navigation-path.css is imported last. Review helper scripts do not ship in the application.
`;
fs.writeFileSync('RELEASE_REPORT.md',report);
let readme=fs.readFileSync('README.md','utf8').replace('September 14, 2026 final UX and A Story product-demo refinement','September 14, 2026 focused global navigation and Path refinement').replace('Active brief: ../v2-planning/FINAL_UX_BRIEF.txt.','Active brief: ../v2-planning/NAV_TIMELINE_BRIEF.txt.');
readme=readme.replace('## Editing map','Current focused evidence: qa/navigation-path/summary.json. Prior whole-site evidence remains in qa/precision.\n\n## Editing map').replace('- app/precision.css:', '- app/navigation-path.css: final header offsets, continuous chronology rail, double-width A Story and vertical mobile timeline; imported last. Header styling is in components/editorial/Header.module.css.\n- app/precision.css:');fs.writeFileSync('README.md',readme);
let direction=fs.readFileSync('CREATIVE_DIRECTION.md','utf8').replace('# Bao Vo — final UX refinement, September 14, 2026','# Bao Vo — navigation and Path refinement, September 14, 2026').replace('The header uses 72px desktop / 64px phone height, stronger branding, readable navigation, an active rule and scroll-only shadow.','The cream header uses 74px desktop height shrinking to 64px, with a constant layout reserve; mobile stays 64px. The serif wordmark has a static brass period. Five readable destinations use a brass active rule, with Contact as the primary navy button and a soft scrolled shadow.').replace('A Story has a restrained NOW marker.','A Story spans two desktop columns, with pale sage resting fill, a persistent NOW marker and concise founder context. A single slate rail turns broadly at the right edge, with two direction cues. Below 1024px the chronology is vertical.');fs.writeFileSync('CREATIVE_DIRECTION.md',direction);
const intro=`<!-- NAV-PATH-REFINEMENT -->
# Current version: global navigation and Path refinement — September 14, 2026

The active application is v2. Preview: http://127.0.0.1:3000/. Read v2/README.md, v2/CREATIVE_DIRECTION.md and v2/RELEASE_REPORT.md first. Active brief: v2-planning/NAV_TIMELINE_BRIEF.txt.

Completed: polished cream global navigation, stable 74px-to-64px desktop header, mobile menu sheet, one continuous snake chronology rail, double-width A Story destination with persistent NOW, and vertical phone/tablet timeline. Preserve the rest of the current website.

623 focused checks passed across seven routes and five widths. All requested screenshot comparisons, manual keyboard checks and live link audit completed. Current evidence: v2/qa/navigation-path/summary.json. No public deployment. Source backup: v2-planning/before-nav-timeline-2026-09-14.zip.

All sections below are historical and superseded where they conflict.

---
`;
fs.writeFileSync('../V2_START_HERE.md',intro+fs.readFileSync('../V2_START_HERE.md','utf8'));
const checks=JSON.parse(fs.readFileSync('qa/navigation-path/checks.json')),links=JSON.parse(fs.readFileSync('qa/navigation-path/links.json'));
fs.writeFileSync('qa/navigation-path/summary.json',JSON.stringify({date:'2026-09-14',build:fs.readFileSync('.next/BUILD_ID','utf8').trim(),scope:'Global header and Home chronology',checks:checks.checks,failures:checks.failures,routeWidthCombinations:35,timelineStates:35,requiredVisualViews:40,primaryScreenshots:48,reviewBoards:9,manual:'manual.json',linkAudit:links,publicDeployment:false},null,2));
