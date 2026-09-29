# Global navigation and Path refinement

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
