---
name: G. Bao Vo — GB
description: An editorial portfolio in navy and warm paper, signed with the GB monogram.
colors:
  blue: "#00274c"
  ink: "#0d2238"
  cream: "#f5f1e8"
  paper: "#ece5d6"
  soft: "#fbf8f1"
  stone: "#ddd4c3"
  muted: "#545f6b"
  brass: "#b58420"
  brass-text: "#7a5612"
  maize: "#e8c064"
  line: "rgb(13 34 56/.13)"
  line-strong: "rgb(13 34 56/.24)"
typography:
  display:
    fontFamily: "'Mona Sans', 'Helvetica Neue', Arial, sans-serif"
    fontWeight: 620
    letterSpacing: "-.026em"
  body:
    fontFamily: "'Mona Sans', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "16px"
    lineHeight: 1.7
  label:
    fontFamily: "'Mona Sans', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "11.5px"
    fontWeight: 560
    letterSpacing: ".17em"
  wordmark:
    fontFamily: "'Brygada 1918', 'Iowan Old Style', Georgia, serif"
    fontSize: "23px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: ".17em"
rounded:
  field: "10px"
  panel: "16px"
  project-preview: "18px"
  action: "999px"
spacing:
  brand-gap: "17px"
  brand-gap-compact: "14px"
  brand-gap-mobile: "12px"
components:
  brand-mark:
    textColor: "{colors.blue}"
    height: "34px"
  brand-mark-compact:
    textColor: "{colors.blue}"
    height: "29px"
  brand-wordmark:
    textColor: "{colors.blue}"
    typography: "{typography.wordmark}"
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.soft}"
    rounded: "{rounded.action}"
    padding: "7px 7px 7px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.blue}"
    rounded: "{rounded.action}"
    padding: "7px 7px 7px 24px"
  archive-field:
    backgroundColor: "#fff"
    rounded: "{rounded.field}"
  work-filter:
    backgroundColor: "transparent"
    rounded: "{rounded.action}"
  project-preview:
    backgroundColor: "{colors.soft}"
    rounded: "{rounded.project-preview}"
---

# Design System: G. Bao Vo — GB

## Overview

**Creative North Star: "From silicon to strategy, signed by hand"**

The portfolio's editorial world pairs engineering precision with a human, bookish voice: navy, warm paper, serif turns in signature headlines, evidence-led projects and the tactile Book.

The identity is **GB**: a woven, hand-drawn monogram with a brass period, set beside the name **G. Bao Vo**. A signature-led evolution is in exploration (`output/gb-logo-prompt.md`). Full guide: `BRAND_DIRECTION.md`.

**Key Characteristics:**
- Restrained navy, warm paper, brass and maize.
- Condensed sans-serif display type with expressive serif accents, used sparingly.
- The GB monogram and the widely spaced serif name.
- Section grounds that alternate cream and stone, with navy cloth bands; framed content on mounted plates.

## Colors

The frontmatter records the live root palette in `app/atelier.css`, imported after the earlier site styles by `app/layout.tsx`. `app/tokens.css` supplies the base font stacks and legacy defaults; its earlier color values are not the current palette. The source CSS remains authoritative when updating this snapshot.

- **Ink navy (`blue`)** carries the wordmark, primary actions, and dark sections; `ink` carries body text.
- **Warm grounds (`cream`, `paper`, `soft`, `stone`)** distinguish page, section, reading surface, and supporting material.
- **Brass (`brass`)** marks interactive detail and rules. **Dark brass (`brass-text`)** colors the emblem and serif accents on light surfaces. **Maize (`maize`)** supplies light gold accents on dark surfaces.
- **Muted slate (`muted`)** supports secondary text; `line` and `line-strong` supply hairlines. Root `--rule` aliases `--line`; section-specific overrides still apply.

## Typography

Mona Sans (`--sans`) supplies body copy and the structural display voice. Brygada 1918 (`--serif`) supplies italic accents, quotes, the Book, and the personal wordmark. The base body is 16px/1.7; individual editorial surfaces have their own sizes.

Atelier's general main headings use weight 620, width 86%, and tight tracking; main labels use weight 560, width 116%, 11.5px type, and .17em tracking. Hero and individual page overrides remain local. Do not turn a single headline's dimensions into a global scale.

The name, **G. Bao Vo**, is regular-weight Brygada 1918, uppercase via CSS, with normal kerning, 1.2 line height, and 2px optical top padding. Desktop uses 23px and .17em tracking; compact uses 20px; mobile uses 20px and .15em tracking. It remains live text, not lettering embedded into the SVG.

## Layout

The existing site alternates editorial columns, ruled indexes, full-width bands, and responsive stacks. Retain each surface's existing grid and breakpoints. Base layout variables originate in `app/tokens.css` but are overridden by later site layers; inspect the complete cascade before changing gutters or header height.

The identity is an inline-flex lockup. Desktop: the mark 34px tall (690 × 462 viewBox), 17px gap. Compact footer: 29px, 14px gap. At viewport widths up to 767px: 29px and a 12px gap for both variants.

## Elevation & Depth

The mark itself is flat and solid, with no shadow, texture, or gradient (the Book cover's gilt foil is the one material exception). Existing surfaces combine hairlines and warm tonal changes with restrained shadows on previews and hovered actions. Cloth, paper, and the dimensional Book belong to their established surfaces; they are not treatments to apply to the logo.

Atelier supplies the motion curves recorded in the sidecar. Pointer hover is gated on applicable surfaces, and reduced-motion rules suppress movement. The identity moves in one place only: the closing band's signature traces the GB (DrawSVG).

## Shapes

The GB monogram is one evenodd path (G, B and the sweep through both, `components/brand/gbPaths.ts`) on a 690 × 462 viewBox, plus the brass period. Site fields use 10px corners, representative panels 16px, project previews 18px, and action pills 999px; these are observed component values, not a replacement for all existing shapes.

## Components

**Personal identity.** `components/brand/Brand.tsx` owns `BrandMark` and `Brand`; `Brand.module.css` owns lockup dimensions. Header and navigation sheet use the full lockup; footer uses `compact`. The decorative SVG is `aria-hidden` and non-focusable. Its surrounding home link supplies the accessible name “G. Bao Vo, home”. Preserve the containing link's usable target and focus treatment.

**Native assets.** `public/brand/gb-mark.svg` is the standalone mark. `public/icon.svg` is a heavier cut of the same geometry in cream on a navy tile, with the brass period. `app/apple-icon.png` and `app/favicon.ico` are deterministic rasterizations of that icon source with provenance recorded alongside the assets. Keep all variants synchronized; use the simplified icon without the wordmark at favicon sizes.

**Actions.** Primary and outline actions share a pill with a separate 40px circular arrow capsule, 54px minimum height, and 7px 7px 7px 24px padding. Primary is navy on light grounds; outline is transparent with a stronger hairline. Dark-band variants invert the foreground and ground. Pointer hover shifts the arrow 3px; active feedback scales to .97. Compact actions use their existing 46px/34px treatment.

**Fields, filters, and previews.** Archive fields use white fill, a stronger hairline, 10px corners, and navy border plus a brass-tinted focus halo. Work filters are restrained pills; selected filters become navy with a soft foreground. Project previews use soft paper, an 18px corner, a hairline, and a low diffuse shadow.

**Navigation.** Existing section navigation uses near-opaque cream (no backdrop blur, for scroll performance), hairlines, and a brass position indicator. Preserve its location state and reduced-motion treatment. Header and footer navigation keep their own component styles; the new identity does not replace their interaction model.

## Do's and Don'ts

### Do:
- Do use the existing navy, paper, and brass tokens through CSS variables.
- Do preserve the GB path, the brass period and the desktop, compact, and mobile lockup proportions.
- Do keep the live serif wordmark, accessible home-link name, and synchronized native icon variants.
- Do preserve factual copy, project evidence, navigation, and the surrounding editorial theme.

### Don't:
- Don't restore the rejected BV monogram or the retired "The Turn" emblem.
- Don't add divider lines, tiny descriptors, badge lettering or effects to this lockup. The brass period is the only dot.
- Don't generalize identity-specific decisions into a site-wide redesign or claim a whole-site review.
