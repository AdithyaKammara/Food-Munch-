# Food Munch: design specification

The design authority for the Food Munch redesign. When this file and any other document disagree on how something looks, this file wins. Motion lives in `animation-guidelines.md`, component anatomy in `component-guidelines.md`, the build order in `implementation-plan.md`.

**Visual source of truth:** [`docs/design-reference.webp`](docs/design-reference.webp), the redesigned layout supplied by the owner. Colours below were sampled from it, not estimated.

---

## 1. Brand identity

**Food Munch is a Hyderabadi kitchen that delivers.** The brand is rooted in one city and one dish: Hyderabad and its biryani. Every visual decision should feel like it could only belong to this brand, not to a generic delivery app.

- **Personality:** warm, heritage, generous, confident. A family-run kitchen with a sense of occasion, not a startup.
- **Visual signature:** deep forest green and copper on warm cream, a bold serif with one italic copper word, the Charminar as a line-drawn landmark, and food photographed in copper and brass vessels.
- **Wordmark:** "Food Munch" set in the display serif, "Food" in cream or ink and "Munch" in copper, beside a line-drawn Charminar mark. The tagline "Hyderabad food delivery" sits underneath in small sentence-case text. The generic chef-hat icon is retired.

## 2. Design philosophy

1. **The food is the hero.** Photographs of real dishes in their vessels carry each screen. Decoration supports them and never competes.
2. **One landmark, used with restraint.** The Charminar appears as a brand motif in three places only: the logo mark, behind the hero dish, and the footer skyline. It is never scattered.
3. **Warm materials, not effects.** Depth comes from paper-like cream surfaces, forest green bands and copper metal tones. No glow, no glass blur and no purple or blue gradients.
4. **One accent word per heading, at most once per section.** The copper italic word ("*Delivered.*", "*Hyderabad,*") is the brand's voice. It is used in the hero and the story heading only, never in every heading.
5. **Honest content.** Food Munch is a portfolio demo. No invented customer counts, no claims the product cannot back up. Demo values are labelled as demo. See `implementation-plan.md` §3 for where the reference's claims were adjusted.

## 3. Colour

Tokens are defined once in `src/index.css` under `@theme` and used everywhere through Tailwind utilities (`bg-forest-800`, `text-copper-700`). **No raw hex values in components.**

### Core palette

| Token | HEX | Role | Sampled from |
|---|---|---|---|
| `forest-950` | `#082014` | Deepest green: hero panel, overlays | Hero green panel |
| `forest-900` | `#0b2418` | Footer base | Footer |
| `forest-800` | `#143424` | Navbar, dark bands, primary dark surface | Navbar |
| `forest-700` | `#1e4a34` | Hover and pressed state on forest | Derived |
| `copper-500` | `#bc6000` | Display accent word, large icons, rules, decoration only | Italic "Delivered.", button |
| `copper-600` | `#b45c00` | **Primary button fill**, active pills, focus on dark | Button, deepened for contrast |
| `copper-700` | `#a35200` | Copper text under 24px: labels, links, prices on cream | Eyebrow |
| `copper-800` | `#8f4700` | Pressed primary button | Derived |
| `gold-300` | `#f0c27a` | Accent on forest: wordmark "Munch" on dark, footer headings, active nav pill | Footer border pattern, active nav link |
| `gold-400` | `#e0a55a` | Ornament strokes, divider patterns on forest | Footer border pattern |
| `cream-50` | `#fffaf3` | Raised surfaces: cards, popovers, dialogs | Card body |
| `cream-100` | `#fcf4ec` | Section surface, alternate band | Menu section |
| `cream-200` | `#f8ece0` | **Page background** | Hero background |
| `cream-300` | `#fce4c4` | Selected tile, soft highlight, promo band | Active category tile |
| `ink-900` | `#1a120b` | Headings and body text | Headline |
| `ink-600` | `#5f5246` | Secondary text, captions | Body copy |
| `line-200` | `#e6d6c2` | Hairlines and card borders (decorative, not for form edges) | Derived |
| `field-500` | `#8f7a63` | Form control edges (3:1 or better) | Derived |

### Functional colours

| Token | HEX | Role |
|---|---|---|
| `veg` | `#1f7a3d` | Vegetarian marker |
| `nonveg` | `#b3261e` | Non-vegetarian marker, error text |
| `star` | `#c96d04` | Rating star icon (an icon, so 3:1 suffices) |
| `success` | `#1f7a3d` | Success messages on cream (5.17:1 on `cream-50`) |
| `veg-300` | `#9fdcb2` | Success messages on forest (10.43:1 on `forest-900`) |
| `nonveg-300` | `#f6b1a8` | Error messages on forest (9.20:1 on `forest-900`) |

### Measured contrast (WCAG 2.2)

| Pair | Ratio | Use allowed |
|---|---|---|
| `ink-900` on `cream-200` | 15.91 | All text |
| `ink-600` on `cream-200` | 6.49 | All text |
| white on `copper-600` | 4.70 | Button labels at any size |
| `copper-700` on `cream-200` | 4.80 | Small copper text |
| `copper-500` on `cream-200` | 3.75 | **Large text only (24px+ or 18.66px bold)** |
| `cream-200` on `forest-800` | 11.68 | All text on dark |
| `gold-300` on `forest-800` | 8.21 | Accent text on dark |
| `copper-500` on `forest-800` | 3.11 | Decoration only, never text |
| `field-500` on `cream-50` | 3.76 | Form control edges |
| `veg` / `nonveg` on `cream-100` | 4.93 / 6.00 | Markers and text |

### Balance

Per screen at 1280×800: cream about 70%, forest green about 20%, copper under 5% (buttons, one accent word, small labels), photography for the rest. Copper is a signal and becomes noise if it spreads.

## 4. Typography

| Role | Family | Package |
|---|---|---|
| Display (headings, wordmark, prices) | **Fraunces Variable**, roman and italic | `@fontsource-variable/fraunces` (OFL) |
| Body and interface | **Inter Variable** | `@fontsource-variable/inter` (installed) |
| Handwritten note (one use, hero only) | **Caveat Variable** | `@fontsource-variable/caveat` (OFL) |

Fraunces replaces Plus Jakarta Sans, which is removed. Caveat is used for the single hero annotation and nowhere else.

### Scale

Desktop sizes at 1280 wide; fluid values use `clamp()` between 375 and 1440 wide.

| Token | Size | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|
| `display-xl` | `clamp(2.375rem, 4.2vw, 3.375rem)` (lowered in Phase 3 so each hero line fits beside the photo from 1024 to 2560) | Fraunces 700 | 1.02 | -0.02em | Hero heading |
| `display-lg` | `clamp(2rem, 3.4vw, 2.875rem)` | Fraunces 700 | 1.08 | -0.015em | Section headings |
| `display-md` | 1.5rem | Fraunces 650 | 1.2 | -0.01em | Sub-headings, dialog titles |
| `title` | 1.125rem | Fraunces 650 | 1.3 | 0 | Dish names, feature titles |
| `price` | 1.375rem | Fraunces 700 | 1 | 0 | Prices (tabular) |
| `body-lg` | 1.125rem | Inter 400 | 1.6 | 0 | Hero sentence, story body |
| `body` | 1rem | Inter 400 | 1.6 | 0 | Default text |
| `body-sm` | 0.875rem | Inter 400/500 | 1.5 | 0 | Card descriptions, meta |
| `label` | 0.8125rem | Inter 600, capitals | 1.2 | 0.12em | Section labels (see below) |
| `caption` | 0.75rem | Inter 500 | 1.4 | 0 | Small meta, footnotes |
| `note` | 1.375rem | Caveat 600 | 1.15 | 0 | Hero annotation only |

### Rules

- **The accent word:** a heading may set one word in Fraunces italic `copper-500`. Allowed in the hero heading and the story heading only.
- **Section labels:** the reference opens sections with a small copper capital label and a short rule ("OUR MENU ——"). Kept by owner decision D4, under three conditions: the label names something real (never "Explore" alone), it uses `copper-700` for contrast, and it appears once per section in four sections only (hero, menu, story, delivery).
- Body text is never below 16px; captions and meta may use 13–14px.
- Prices and figures use `font-variant-numeric: tabular-nums`.
- Maximum line length: 64ch for body text, 18ch for headings.
- `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.

## 5. Spacing and layout

- **Base unit 4px.** Spacing steps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- **Container:** `max-width: 1240px`, centred, with 16px side padding below 640, 24px from 640 and 32px from 1024. The navbar, sections and footer share this one container.
- **Section rhythm:** 96px vertical padding at desktop, 64px at tablet, 48px on phones. Hero top padding is tighter (32px under the nav).
- **Grids:**
  - Category tiles: 5 columns on desktop; a horizontal scroll strip with snap on phones.
  - Dish rail: 4 cards visible at 1280, 3 at 1024, 2 at 768 and 1.2 on phones, so the next card peeks.
  - Story: image 6 columns and text 6 columns at desktop, stacked below 1024.
  - Footer: brand, three link groups and newsletter at desktop; two columns on tablet; one on phones.
- **Breakpoints:** Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280.
- Image-bearing grid tracks use `minmax(0, 1fr)`.
- `overflow-x: clip` on `html` and `body`.

## 6. Shape, depth and treatments

| Token | Value | Use |
|---|---|---|
| `radius-sm` | 8px | Inputs inside panels, small chips |
| `radius-md` | 12px | Dish cards, category tiles, dialogs |
| `radius-lg` | 16px | Large panels, story image frame |
| `radius-full` | 9999px | Buttons, pills, nav bar, search field |

One radius per nesting level: a card is 12px and the image inside it follows the card's top corners, never its own radius.

| Token | Value | Use |
|---|---|---|
| `shadow-card` | `0 1px 2px rgb(26 18 11 / 0.06), 0 8px 24px -12px rgb(26 18 11 / 0.18)` | Dish cards, tiles at rest |
| `shadow-lift` | `0 2px 4px rgb(26 18 11 / 0.08), 0 18px 36px -14px rgb(26 18 11 / 0.28)` | Hover, popovers |
| `shadow-dialog` | `0 24px 64px -20px rgb(8 32 20 / 0.45)` | Dialogs, drawer |

**Signature treatments.** Each one is built once as a component and reused:

- **Torn-paper edge:** the hero photo panel and the story photo have an irregular torn edge where they meet cream, built with an SVG mask. Used twice only.
- **Forest blob:** the organic green shape behind the hero dish (`forest-950`), an SVG path.
- **Charminar line art:** a single-stroke illustration in `ink-900` at low opacity behind the hero dish, and as a skyline along the footer top in `gold-400`.
- **Copper flourish:** a short hand-drawn underline under the hero accent word and beside section labels. SVG, 2px stroke, `copper-500`.
- **Ornamental border:** a repeating geometric band in `gold-400` along the footer's bottom edge.
- **Paper grain:** a very subtle noise texture on cream (opacity 0.035 or less) to avoid flat digital cream. Optional; dropped if it costs performance.

## 7. Components (visual rules)

Anatomy, states and behaviour live in `component-guidelines.md`. Visual rules:

- **Primary button:** `copper-600` fill, white Inter 600 16px label, pill, 48px tall, 24px horizontal padding. Hover `copper-700`, pressed `copper-800`. An arrow icon is allowed only on the hero's main action.
- **Secondary button (outline):** 1.5px `copper-600` border, `copper-700` label, transparent fill. Used for "+ Add" on dish cards.
- **Quiet button:** a round 44px icon button, cream-50 with a `line-200` border. Used for carousel arrows and the favourite heart.
- **Nav bar:** a full-width pill in `forest-800`, cream links, and a `gold-300` pill with `ink-900` text for the active link.
- **Search field:** a `cream-50` pill with a `field-500` edge, 48px tall, with a search icon on the left.
- **Dish card:** `cream-50`, `radius-md`, `shadow-card`, photo on top (4:3), a rating chip on the photo, name in `title`, a two-line description, the price in `price`, and an outline "+ Add" button.
- **Category tile:** a `cream-100` tile with the dish photo cut into a circle, the label in Fraunces 600 underneath. Selected: `cream-300` fill with a 1.5px `copper-500` border.
- **Category pill (toolbar):** `cream-50` with `ink-900` label; selected pill is `copper-600` with a white label, as in the reference.
- **Feature item:** a 56px copper outline icon in a soft `cream-300` square, a title and two lines of body. No coloured coins.
- **Delivery & Payment section (kept, D1):** a `forest-950` card on cream, cream and `gold-300` text, Fraunces headings, copper badges on the phone. The phone shows the real tracking capture.

## 8. Imagery

- **Subject:** Hyderabadi dishes in their vessels (copper handi, brass bowls, steel thalis), shot close and warm.
- **Light:** warm, directional, soft shadows. No harsh flash, no over-saturation and no crushed blacks.
- **Hero:** biryani in a copper handi (`public/images/why-biryani.jpg` matches this best). It sits on the forest blob with steam rising.
- **Dish photos:** one consistent crop (4:3), centred on the food. Photos that clash in light or style are flagged for replacement in `implementation-plan.md`.
- **People:** the reference shows diners in front of the Charminar. By owner decision D3, this is a real, freely licensed photo found online (Wikimedia Commons or similar), approved by the owner and credited. Never AI-generated, never watermarked stock.
- **Format:** JPEG at quality 80–85, 1600px wide at most, with explicit `width` and `height` to prevent layout shift. `loading="lazy"` below the fold; `fetchpriority="high"` on the hero image only.
- **Credits:** every Creative Commons photo is credited in the Photo Credits dialog.

## 9. Responsive principles

- **Desktop (1024 and up):** the reference composition as drawn: the hero split 50/50 with the dish panel bleeding to the right edge, the toolbar as one row, five category tiles and a four-card rail.
- **Tablet (768–1023):** the hero stacks with the dish panel first at a reduced height. The toolbar wraps into two rows. Tiles scroll horizontally. The rail shows two cards and a peek.
- **Phone (under 768):**
  - The nav collapses to the logo, cart and menu button.
  - The hero heading and sentence come first, then a full-width dish image, then the hero stats in a compact row.
  - The toolbar becomes a sticky search field with category pills in a scroll strip.
  - The rail shows a card and a peek, with swipe and snap.
  - Every tap target is 44px or larger.
- No horizontal page scroll at any width from 320 up.

## 10. Rules and anti-patterns

**Always**
- Use tokens. Add a token here before using a new value.
- Give every interactive element a visible `:focus-visible` ring: `copper-600` on cream, `gold-300` on forest, 3px and offset 2px.
- Label demo data as demo.
- Keep the hero's heading, sentence and primary action visible at 1280×800.

**Never**
- Glassmorphism, glow, neon or purple-blue gradients.
- More than one accent italic word per heading, or accent words in every section.
- Emoji as icons. Use Lucide icons at 1.75px stroke.
- Coloured circles behind every icon.
- Invented metrics, testimonials, logos or claims (24/7, live GPS, card payments).
- Arrows glued to every button label, middle-dot separated meta strings, or decorative status dots.
- Cards nested inside cards.
- Animating `width`, `height`, `top` or `left`, or `transition: all`.
- A second Charminar illustration, scattered leaves, or floating decorative dots.
