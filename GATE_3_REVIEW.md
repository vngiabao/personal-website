# Gate 2 + Gate 3 — creative and production review

12 September 2026 · Source specification v1.1 · **Ready for Bao's visual review. Stop here; do not advance to Gate 4.**

## Preview and scope

- [Local production preview](http://127.0.0.1:3000/)
- [Composition A](http://127.0.0.1:3000/?composition=a#a-story)
- [Composition B](http://127.0.0.1:3000/?composition=b#a-story)
- [Hero comparison candidate](http://127.0.0.1:3000/?hero=candidate)
- V2 directory: `C:/Users/vngia/OneDrive - Umich/Desktop/My startups/Personal Website/v2`
- Run from that directory: `pnpm build`, then `pnpm start`. For editing, stop the production server and use `pnpm dev`.
- Production build ID: `-VlFPcqWQaR1gIKl6wFfm`. Source fingerprint and individual hashes: [production revision](<C:/Users/vngia/OneDrive - Umich/Desktop/My startups/Personal Website/v2/qa/production-revision.json>).

Implemented: production shell, tokens, typography, desktop navigation, mobile modal sheet, responsive containers and grid, global link/focus/motion behavior; Hero, Silicon, Signal handoff, and both A Story reveal compositions.

Only Home and the not-found state exist. Navigation retains the specified future URLs, so /a-story, /book, /work, /archive, /about and /contact return the not-found state during this proof. Their content and interactions have not been implemented. The comparison controls are an explicitly identified review surface at the bottom of Home.

The three root source-of-truth files were read in full and remain unchanged. Legacy code, all eight image contact sheets, recovered A Story assets, source-document extracts and relevant recovery/audit material were inspected. The final media audit verified all **90 preserved original files unchanged**. Nothing from the legacy site was overwritten.

## Architecture and media

Next.js App Router **16.3.5**, React/React DOM **19.3.0**, TypeScript **5.9.3**, CSS Modules and CSS custom properties. Node **24.18.0** and pnpm **10.11.1** were used. Versions are locked in pnpm-lock.yaml. Prose and media markup are server rendered; Header, SignalPath and ImageReveal are small client islands. No motion framework, CMS, database or editor runtime.

Inter variable Latin WOFF2 and Fraunces variable Latin WOFF2 are self-hosted; Fraunces uses optical sizing with SOFT 0 / WONK 0. Fontsource packages are 5.3.0; their OFL licenses are retained beside the fonts. System monospace supplies metadata.

Sharp 0.34.5 creates AVIF/WebP/JPEG derivatives, normalizes orientation and sRGB, strips metadata, preserves originals and records dimensions, byte counts and source hashes. Playwright 1.63.0 and axe 4.13.0 support browser QA.

Images actually displayed:

- **Hero:** `../images/hero-portrait.jpg` — genuine Bao portrait, 3:4 crop, natural color and Law Quad context.
- **Silicon:** `../images/exp-faraday.jpg` — genuine team photograph, native 4:3. Caption does not imply a tape-out celebration.
- **A and B:** `../v2-planning/recovered/a-story-deck/deck/assets/new/astory_hardcover_book_table.png` — supplied editorial concept, with the visible caption “A possible future keepsake · editorial concept.”

The recovered product flatlay was imported into protected source storage for comparison but is not published or displayed. B's blank mount, paper structure, memory sequence and labels are authored in HTML/CSS. No separate historical photograph, date, handwriting or customer evidence was invented. No image-generation job ran.

Mobile retains the book's full 16:9 image instead of forcing 4:3: the tighter crop would cut the book edges. This follows the media plan's instruction to change the ratio when a safe crop is unavailable.

## A/B and copy decisions

**Current recommendation: A.** All four required A/B screenshots at 390 and 1440 were inspected, along with the other widths. A gives the recovered book more area and lets the question follow immediately on mobile. It is quieter and more emotionally direct. The concept caption remains legible and adjacent.

B makes the archive structure more explicit, and its material vocabulary connects to the Signal handoff. Its weakness is the extra explanatory layer: the blank mount can read as a placeholder before it reads as a deliberate archival surface, and the repeated conversation/photograph/perspective vocabulary delays the main question. It is retained as a complete alternative for Bao's review, not silently removed or automatically promoted.

**Keep the approved hero paragraph.** The shorter candidate was compared at 390 and 1440. It improves brevity and brings the portrait higher on mobile, but it omits what A Story is for. The approved copy identifies the current venture and its human purpose immediately. No automatic copy substitution was made. “A Story” stays together as a linked phrase.

The adjacent-section repetition pass found intentional uses of “work” in navigation/CTAs and “building” in the current-project narrative. No blanket synonym replacement was warranted. B's added vocabulary is a reason to prefer A. The optional A Story page opening was not implemented because that route is outside this gate.

## Creative critique against v1.1

1. **Generic premium portfolio?** The first Signal draft was too generic and was rejected. In the revised proof, no as an overall system: the technical handoff becomes an archival mount, rather than functioning as a scroll indicator. The hero alone deliberately uses a familiar large-type/portrait composition; it does not carry the entire claim to authorship.
2. **Could this plausibly have come from a template?** No for the complete proof. The cream-and-serif pairing is familiar, but the authored three-scene relationship is specific: documented test/timing work, Bao's real Faraday photograph, a route that changes into memory structure, and the carefully framed venture in development. This is the distinguishing moment being submitted for review, not a claim that familiar layout primitives are unique.
3. **At least one moment specific to Bao?** Yes: the Signal's 900ms routed-path-to-archive transformation ties circuits, medical technology and strategy to the current memory venture. It ends in “Keep the voice. Build the record.” This is editorial geometry, not measured engineering data or product evidence.
4. **Michigan Blue + cream luxurious rather than collegiate?** Yes in this proof. Blue acts as a full editorial field; typography, warm neutrals and natural photography do the work. No varsity type, block M or school-color striping was added.
5. **Maize sufficiently rare?** Yes. It appears as punctuation and tiny endpoints. The hero's moving route was reduced in opacity so it cannot compete with the portrait. Maize never becomes a large field or body-text color.
6. **Typography carrying the composition?** Yes. Inter establishes identity and technical hierarchy; Fraunces is reserved for the emotional turn. The A Story question carries weight without a feature-card grid or launch-style promise.
7. **Signal distinctive without noise?** The revised handoff is the signature. One morph/traversal settles; revisiting does not replay it. The hero route is quieter. Native scrolling remains untouched, and the static/reduced-motion state retains the destination and structure. At enlarged text sizes, the container-based fallback prioritizes readable labels.
8. **Silicon technical without sci-fi?** Yes. Real responsibilities, qualified process/timeline figures and a plainly labeled workflow supply technical character. No chip floorplan, measured waveform, glow, fabricated benchmark or animated counter.
9. **A Story the emotional center?** Yes, most clearly in A. It has the largest project title/image relationship, a question about conversation and family memory, and accurate development/pilot language. No public-product or waitlist destination is implied.
10. **Real imagery more authoritative than conceptual imagery?** Yes through treatment and labeling. Portrait and team photograph retain their natural context. The larger A Story image carries emotional scale but is explicitly a concept, never pilot evidence. Its source is not upgraded by placement.
11. **Mobile independently designed?** Yes. The portrait follows the prose and actions; the technical workflow becomes a vertical reading sequence; the sheet uses the whole viewport; A Story stacks title, object, question and role. At enlarged text size, metrics and archive materials wrap independently instead of scaling down the desktop layout.

**Gate decision:** the first generic Signal was iterated within Gate 3. The revised proof is ready for visual review. No later route has been built, and no visual approval is presumed.

## Validation, screenshots and motion

[Complete screenshot index](<C:/Users/vngia/OneDrive - Umich/Desktop/My startups/Personal Website/v2/qa/SCREENSHOT_INDEX.md>) links **47 final PNGs** under `qa/final/`.

At **375 / 390 / 768 / 1440 / 1728**, the set contains first viewport, full Hero, Silicon, Signal handoff, A Story A, A Story B, full Home A and both boundaries. Hero candidate comparisons are additionally captured at 390 and 1440.

Required A/B files:

- [A · 390](<C:/Users/vngia/OneDrive - Umich/Desktop/My startups/Personal Website/v2/qa/final/home-astory-composition-a-390.png>)
- [B · 390](<C:/Users/vngia/OneDrive - Umich/Desktop/My startups/Personal Website/v2/qa/final/home-astory-composition-b-390.png>)
- [A · 1440](<C:/Users/vngia/OneDrive - Umich/Desktop/My startups/Personal Website/v2/qa/final/home-astory-composition-a-1440.png>)
- [B · 1440](<C:/Users/vngia/OneDrive - Umich/Desktop/My startups/Personal Website/v2/qa/final/home-astory-composition-b-1440.png>)

[Signal motion recording](<C:/Users/vngia/OneDrive - Umich/Desktop/My startups/Personal Website/v2/qa/behavior/signal-handoff-1440.webm>) and five captured intermediate frames document the actual change in path geometry and endpoint position. Recorded states were inspected alongside the resting composition; the review did not rely only on a final screenshot. [Reduced-motion capture](<C:/Users/vngia/OneDrive - Umich/Desktop/My startups/Personal Website/v2/qa/behavior/signal-reduced-390.png>) shows the stable mobile state.

Passes:

- Production build and TypeScript validation; route output includes only / and /_not-found.
- No horizontal overflow at all five proof widths, 320px reflow equivalent, or 844×390 landscape.
- Simulated 200% text enlargement at 390 and 1440 reflows without horizontal overflow. This is a computed-font enlargement test, not a claim of testing every browser's native text-zoom behavior.
- Modal Close focus, repeated Tab containment, Escape, return focus and scroll restoration pass at 375/390/768. Earlier focus-cycle failure was fixed.
- Axe WCAG A/AA scans have no violations in the final A view at all five widths, the B mobile view, and tested menu states. This does not establish full WCAG conformance.
- Signal changes shape over time, settles, and does not replay on return. Reduced-motion geometry remains unchanged over the observed interval.
- Main headings, prose, image descriptions and fallback navigation remain available without JavaScript.
- 90 preserved legacy files match their audit hashes; 36 public image derivatives have expected dimensions/bytes and no EXIF. No held/internal asset is exported.

## Performance and remaining issues

Final cold-cache local production lab run: Chrome, 390×844, DPR 3, 4× CPU slowdown, 1.6Mbps down, 150ms latency.

- Initial transfer **361,681 bytes (~353 KiB)**, below 700KB.
- Fonts **169,272 bytes (~165 KiB)**, below 180KB.
- Identified custom client chunks **6,288 bytes gzip**, below the 60KB Home budget.
- Mobile-selected portrait **37,808 bytes AVIF**; largest book derivative **29,052 bytes AVIF**.
- Observed LCP **0.688s** and CLS **0.045** in this run.
- Menu event durations reached **64ms**. This is an observed interaction sample, not field INP.

Open accessibility work: manual NVDA/VoiceOver reading and navigation, native Safari/iOS dialog and focus behavior, actual browser text/page-zoom checks, and physical touch-device verification. Destination-heading focus after navigation remains to be verified when the deferred routes exist. No known overflow or automated contrast violation remains in the tested proof.

Open performance work: no field Core Web Vitals or deployed-host measurements exist; actual INP percentiles and mobile Safari rendering remain unmeasured. Font swapping causes a small observed shift, still within the current CLS target. There is no known transfer-budget breach in this gate.

Missing visual slots: **none blocking the three-scene proof**. Verified A Story application captures, permission-cleared archival family photography and actual pilot photography remain unavailable for later pages. The current proof is complete with the approved object concept and blank code-authored materials; it does not require generation to fill those evidence gaps.

Await Bao's visual review before any further gate.

