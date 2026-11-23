# Food Munch: animation and interaction guidelines

The motion authority for the redesign. Visual values come from `design.md`; where each animation lives in code is in `component-guidelines.md`.

## 1. Principles

1. **Every animation answers a question.** What changed, where did it go, what can I do here, is it working. If it answers none, it is cut.
2. **Food moves like food.** Steam rises slowly, a lid lifts, a dish settles onto the table. Nothing bounces like a toy.
3. **Content is never held hostage.** Text and buttons are usable immediately. Entrances never delay interaction, and everything is visible with scripting off.
4. **One moment per screen.** Each section has at most one featured motion. The rest is quiet. The kept Delivery & Payment section (owner decision D1) is the page's one scroll-pinned story; nothing else pins.
5. **Cheap to render.** Only `transform` and `opacity` (plus `clip-path` for image reveals). Never `width`, `height`, `top`, `left` or `transition: all`.

## 2. Timing and easing standards

Defined once in `src/lib/motion.ts` (GSAP) and mirrored as CSS custom properties in `src/index.css`.

| Token | Duration | Use |
|---|---|---|
| `instant` | 120ms | Colour and border changes on hover, focus |
| `quick` | 240ms | Buttons, toggles, chips, small state changes |
| `base` | 400ms | Cards, popovers, dialog content, tile selection |
| `entrance` | 600ms | Section reveals |
| `hero` | 900ms | Hero image reveal and heading lines |
| `ambient` | 2.2s, a few times | Steam only, then still (no endless loop; see §4) |

| Token | Curve | Use |
|---|---|---|
| `ease-out` | `power2.out` / `cubic-bezier(0.22, 1, 0.36, 1)` | Things arriving: reveals, dialogs opening |
| `ease-in` | `power2.in` / `cubic-bezier(0.4, 0, 1, 1)` | Things leaving: dialogs closing, toasts |
| `ease-in-out` | `power3.inOut` | Things moving between two places: rail scroll, tile highlight |
| `settle` | `back.out(1.4)` | Small confirmations only: cart badge, added tick |

**Stagger:** 70ms between siblings, at most 6 items staggered; anything beyond appears with the sixth.
**Distance:** reveals travel 16–24px. Nothing travels further than 40px.

## 3. Page entrance

On first load, in one coordinated timeline, total under 1.4s:
1. The navbar fades in from 8px above (400ms).
2. Hero heading lines rise and unmask one after another (see §4).
3. The hero sentence, actions and stats fade up with a 70ms stagger.

The navbar and actions are clickable from the first frame. There is no preloader or splash screen.

## 4. Hero

| Element | Motion | Duration and timing |
|---|---|---|
| Heading lines | Each line slides up from 100% inside an overflow mask | 900ms `ease-out`, 90ms stagger |
| Accent word "*Delivered.*" | Arrives with its line, then the copper flourish draws beneath it (`stroke-dashoffset`) | Flourish 600ms, starting 200ms after the line lands |
| Dish panel | The torn green panel reveals with `clip-path` from right to left | 900ms `ease-in-out`, starts with the heading |
| Dish photo | Scales from 1.06 to 1 inside the panel as it reveals | 1100ms `ease-out` |
| Charminar line art | Fades to its resting opacity (0.18) after the dish lands | 600ms |
| Steam | Three soft wisps rise and fade above the handi, twice each, then rest | 2.2s per rise, from 1.2s, offset 0.5s per wisp, opacity 0.35 or less; all done by about 6.5s |
| Handwritten note | Fades in last, with its arrow drawing in | 400ms + 400ms |
| Parallax | Over the first 900px of scroll, the photo drifts down 6% of its height and the Charminar 4%, desktop only | CSS scroll-driven animation (`animation-timeline: scroll(root)`), inside `@supports`; no script |

**Since the prerender follow-up** the entrance (heading lines, flourish, fades, panel, photo, art, note) is CSS keyframes in `src/index.css` (`[data-hero=…]`, staggered by `--i` from `Hero.tsx`), with the same durations, delays and order as the GSAP timeline it replaced. The hero is in the prerendered HTML, so a script timeline would have hidden painted content until the scripts ran; CSS starts with the first paint. Under reduced motion nothing moves.

Steam is not a loop (changed in Phase 3): anything that moves for more than five seconds alongside other content needs a pause control (WCAG 2.2.2), so the wisps play a few times on load and stop. They never run under reduced motion.

## 5. Scroll reveals

- **Default reveal:** fade up 20px, 600ms `ease-out`, triggered when an element's top passes 85% of the viewport. Once only.
- **Section headings:** the label's rule (`data-rule`) draws in from the left (300ms) as the heading block rises.
- **Images:** a `clip-path: inset()` reveal from bottom to top with the image scaling from 1.04 to 1, 800ms. This is used for the story photo and category tiles, not for every image.
- **Groups:** cards and tiles stagger at 70ms, up to six.
- Reveals hide content only from the moment the script runs. With scripting off, or before hydration, everything is visible.
- Elements already on screen at load are not hidden and re-revealed (`useReveal` skips anything above the 88% line when it starts).
- Built in `src/lib/useReveal.ts`: `data-reveal` fades up; `data-reveal="image"` opens with the clip-path reveal (the story photo and each category tile photo). **Since Phase 9** the motion is CSS transitions on `.reveal-*` classes, switched on by an IntersectionObserver, and set up on the frame after first paint: per-element GSAP tweens and ScrollTriggers cost seconds of main-thread time on a slow phone.
- The Delivery & Payment pin is CSS `position: sticky` inside a track one screen plus 1300px tall, scrubbed by one ScrollTrigger. GSAP's own pin switched to `position: fixed`, which Chrome counted as a full-screen layout shift.

## 6. Image hover

Hover interactions apply only to devices with a fine pointer (`@media (hover: hover)`).

- **Dish card photo:** scales to 1.04 over 400ms inside its fixed frame, so the card itself never changes size.
- **Category tile photo:** rotates 4° and scales to 1.05 over 400ms `ease-out`, like a plate turned towards you.
- **Story photo:** no hover. It is not interactive.

Non-interactive images never react to the pointer.

## 7. Food cards

| State | Treatment |
|---|---|
| Hover | Shadow moves from `shadow-card` to `shadow-lift` and the photo scales to 1.04 (motion allowed only). **Changed in Phase 4:** the card no longer rises, because the card itself is not a link or button; lifting it would suggest it can be clicked. |
| Focus within | Same as hover, plus the focus ring on the focused control |
| Press on "+ Add" | Button scales to 0.96 for 120ms |
| Added | Label changes to "Added" with a tick icon on a `forest-800` fill for 1.4s, then returns (forest, so it reads as done rather than as the copper action). See §11 for the cart. |
| Favourite | Heart scales 1.35 → 1 with `settle` and fills in the non-veg red (`pop()`), motion allowed only |

## 8. Buttons

| Button | Hover | Press | Focus |
|---|---|---|---|
| Primary | Fill to `copper-700` (120ms); the hero arrow moves 3px right | Scale 0.97, fill `copper-800` | Ring appears instantly |
| Secondary | Fill `cream-300` (120ms) | Scale 0.97 | Ring appears instantly |
| Quiet (icon) | Border to `copper-600` (120ms) | Scale 0.94 | Ring appears instantly |

Focus rings never animate in. Disabled buttons do not react to hover.

## 9. Navigation

- **Active link:** the `gold-300` pill slides between links (GSAP Flip, 400ms `ease-in-out`) as sections change while scrolling or on click.
- **Scroll state:** after 8px of scroll the nav bar gains `shadow-lift` (240ms). It never shrinks or hides, so the cart stays reachable.
- **Anchor scroll:** smooth scroll to sections, offset by the nav height. Instant under reduced motion.
- **Mobile menu:** a sheet slides in from the right (400ms `ease-out`) over a scrim fading to 50%. Links stagger in at 50ms. Closes in 240ms `ease-in`.

## 10. Menu, categories and filters

- **Category selection:** each group moves its own highlight (400ms `ease-in-out`): the copper fill slides between toolbar pills, and the cream fill with copper border slides between tiles. Choosing in one group updates the other, so the two always agree. **Built in Phase 8** without the Flip plugin: the pills use the navbar technique (a copper copy of the row on top, clipped with `clip-path` to the chosen pill, so a white label is never seen on cream mid-move); the tiles move one highlight box with `x`, `y`, `width` and `height`. From "All" the tile highlight appears in place rather than flying in from nowhere.
- **Filter results:** cards that stay keep their place; arriving cards fade up 14px with a 70ms stagger, at most six. Leaving cards go at once: fading them out would mean keeping removed dishes in the list for 200ms, which screen readers and the result count would report wrongly. The rail returns to its start instantly when the results change.
- **Result count:** "Showing N dishes" updates its number with a 240ms crossfade and is announced politely to screen readers.
- **Rail arrows:** scroll by one card with the browser's smooth scrolling (instant under reduced motion); scroll snap handles swipe and trackpad. An arrow fades to 40% and is disabled when the rail can't scroll that way.
- **Filter popover:** fades and rises 8px (240ms) from the Filter button, with CSS `@starting-style` (Phase 4). Under reduced motion it only fades.
- **Empty result:** a friendly message and a "Clear filters" button fade in. No illustration.

## 11. Cart feedback

1. **Add:** a small copper dot (12px) flies from the "+ Add" button to the nav cart icon on a curved path (600ms; different easings on x and y bend it into an arc). It is created in a fixed layer and removed after landing (`flyToCart()` in `src/lib/motion.ts`). For dishes with options it starts from the card's button once the customise dialog is confirmed.
2. **Badge:** the line joins the cart as the dot lands, so the count changes and pops on arrival (300ms `settle`). Under reduced motion it is added at once.
3. **Toast:** "Paneer Tikka added to cart" fades in at the bottom, rising 10px when motion is allowed (240ms), stays 2.2s and then goes. It is announced to screen readers.
4. **Drawer:** slides in from the right (420ms `ease-out`). Line items appear with a 60ms stagger. Quantity changes pop the number; a removed line collapses its height with `transform: scaleY` on a wrapper plus opacity.
5. Under reduced motion: no flying dot; the badge and toast change instantly.

## 12. Loading and transition states

- **Images:** dish and tile photos sit on a `cream-300` placeholder of their exact aspect ratio, then fade in over 300ms on `load` (`.img-fade`; already-loaded images show at once, and with scripting off they are visible). No layout shift.
- **Fonts:** `font-display: swap`, with fallback metrics tuned so text doesn't jump when Fraunces loads.
- **Checkout payment step:** the demo UPI button shows a spinner and "Confirming…" for 900ms, then the tracking view opens. The spinner only turns when motion is allowed; the text says the same either way.
- **Dialogs:** open with a 320ms fade and 12px rise; close with a 180ms fade. This is the current behaviour, kept.
- **No skeleton screens:** all content is local and instant, so a skeleton would only add a fake delay.

## 13. Reduced motion

Under `prefers-reduced-motion: reduce`:
- All entrances, reveals, parallax, steam, flying dots, Flip movements and hover lifts are **off**.
- Content appears in its final state immediately.
- Colour and opacity changes of 120ms or less remain, so hover and focus are still visible.
- Smooth scrolling becomes instant.
- The rail still scrolls by arrow, without easing.

This is implemented with `gsap.matchMedia()` and with case-by-case CSS in `src/index.css`: every CSS animation that moves something sits inside `@media (prefers-reduced-motion: no-preference)`. The old global rule that cut every animation and transition to 0.01ms was removed in Phase 3. Fades stay for everyone, so dialogs and drawers fade without sliding. Every new GSAP animation is registered under the `MOTION_OK` condition from `src/lib/gsap.ts`.

Code that waits for `animationend` must not depend on it: the cart's line removal also finishes on a 300ms timer.

## 14. Performance rules

- Animate `transform`, `opacity` and `clip-path` only.
- No more than one scrubbed scroll animation running per viewport.
- The Delivery & Payment pin keeps its current timeline (`DeliveryBanner.tsx`); only its colours change in the redesign.
- `will-change` only during an animation, removed afterwards.
- No endless ambient loops. Anything that must loop for more than five seconds gets a visible pause control.
- After changing layout (filters, images), refresh scroll triggers through the existing ResizeObserver in `src/lib/gsap.ts`.
- **Target:** 60fps on a mid-range phone; no long tasks over 50ms from animation code.

## 15. Libraries

- **GSAP 3** (installed) with ScrollTrigger, through `@gsap/react`'s `useGSAP`. This is the only animation library. The Flip plugin turned out not to be needed (see §10).
- `motion` (Framer Motion) was installed but unused; it was uninstalled in Phase 9.
- CSS keyframes for dialogs, toasts, steam and the hero entrance, and CSS scroll-driven animations for the hero parallax, where a timeline adds nothing.
