# Food Munch: implementation plan

The execution roadmap for the redesign. It follows `design.md` (how things look), `component-guidelines.md` (how components are built) and `animation-guidelines.md` (how things move). Facts about the codebase are in `project-context.md`.

- **Branch:** `redesign-heritage`, cut from `main` at `dff2024`.
- **Reference:** [`docs/design-reference.webp`](docs/design-reference.webp).
- **Status:** Phases 0–9 complete (Phase 9 on 2026-11-22). Open: owner review on a real phone, the phone LCP target (needs prerendering, see Phase 9).

---

## 1. Assessment of the current site

An honest audit of what is live at `foodmunch-app.vercel.app` today, commit `dff2024`. Earlier rounds fixed real defects (wrong photos, contrast, layout bugs), but the design underneath is still a generic template.

### What works and must survive
- The ordering engine: cart, customise, promo codes, tip, checkout validation, simulated UPI and cash on delivery, order tracking, history, reorder and rating. It is complete, tested (48 unit tests) and honest about being a demo.
- Accessible foundations: focus rings, 44px tap targets on phones, reduced-motion handling, a skip link and labelled dialogs.
- Real menu data: 12 dishes with prices, macros, prep times and veg markers.
- The scroll-trigger plumbing in `src/lib/gsap.ts`, `motion.ts` and `useReveal.ts`.

### What reads as generic
| Area | Problem |
|---|---|
| **Brand** | No identity. A Lucide chef-hat icon in a yellow square and the name in Plus Jakarta Sans. Swap the name and it could be any food app. |
| **Palette** | Cream and saturated yellow-gold (`#ffbf00`) is the default "warm food site" palette. Gold buttons, gold badges and gold underlines everywhere, so nothing is emphasised. |
| **Typography** | One sans family at heavy weights for everything. No contrast between voice (headings) and information (body). Section headings are interchangeable. |
| **Hero** | "Headline left, photo right, stat row below", the most common landing-page composition. The photo is a plain rectangle with no relationship to the brand. |
| **Menu** | Twelve near-identical white cards in a grid. Grouping by course helped, but the rhythm is still a spreadsheet of cards. |
| **Why Us** | Six icon-and-sentence rows of generic claims ("Fresh Ingredients", "Authentic Flavours") that any restaurant could make. |
| **Delivery** | The pinned dark scroll section is impressive once, but it is visually disconnected from the rest of the page and costs 1,300px of scrolling for three facts. |
| **Footer** | A standard four-column dark footer. |
| **Motion** | Mostly fade-and-rise reveals. Nothing expresses the brand: no steam, no reveal of the dish, no satisfying add-to-cart moment. |
| **Imagery** | Mixed photo styles: bright white plates beside dark, heavily processed shots. |
| **Copy** | Generic lines: "Made for your kind of day", "More Than Just Food, A Better Experience", "Find Your Next Favourite". |

### Usability and conversion issues
- The primary action ("Explore Menu") scrolls, but there is no quick path to the signature dish.
- The menu toolbar shows nine controls at once on desktop: categories, search, two toggles, favourites and sort.
- Footer text links are 19–20px tall, below the 44px tap guideline.
- Desserts row leaves an empty slot at three columns.

## 2. The reference: what it gets right and what it cannot be built as drawn

### Strengths to preserve
- A real brand: forest green, copper and cream, a heritage serif, and the Charminar as a landmark.
- A signature hero: a copper handi of biryani on a torn, deep-green panel with steam.
- A category row with food imagery, and a curated "Chef's Recommendations" rail.
- A story section that gives the brand a reason to exist.
- A green footer with a city skyline and an ornamental border, a finished edge to the page.

### Conflicts and the smallest adjustment for each

The reference is the visual authority, but several of its contents cannot be shipped truthfully or do not exist. Each conflict gets the smallest change that keeps the design intact.

| # | Reference shows | Problem | Adjustment |
|---|---|---|---|
| C1 | "10k+ Happy Customers", "4.8 Avg. Rating", "< 30 mins Fast Delivery" | Invented metrics. The real menu average is 4.7 (demo data) and the demo delivery estimate is about 22 min. | Same three-stat row with real values: **12** signature dishes, **4.7** demo rating, **~22 min** demo delivery. |
| C2 | "Watch the Experience" play button | No video exists. A play button with nothing behind it is a broken promise. | Replace with a secondary text link, "See how ordering works", that scrolls to the story and features. |
| C3 | Nav: Home, Menu, **Offers**, **About**, Contact | No Offers or About pages exist. | **Offers** scrolls to a new offers strip built from the four real promo codes. **About** scrolls to the story section. |
| C4 | Profile photo avatar in the nav | No user photos exist. | Keep the round slot: signed-in initials on `cream-300`, or the account icon when signed out. |
| C5 | Footer links: Careers, Partner with Us, Blog, Help Center, Order Issues, FAQs, Refund Policy, Cookie Policy; Instagram and YouTube icons | None of these pages or accounts exist. Dead links fail users. | Same footer composition with real links only: menu sections, Privacy, Terms, Photo Credits, project contact, GitHub and LinkedIn. |
| C6 | Feature claims: "24/7 Delivery", "Live Tracking real-time", "cards & wallets" | False for this demo. | Same four-feature row, honest copy: delivery in about 22 min (demo), quality-checked recipes, simulated order tracking, UPI (demo) or cash on delivery. |
| C7 | A "Biryani" category | The data has four courses; biryanis sit in Mains. | Add Biryani as a derived filter (dishes whose name contains "Biryani"), with a unit test. No data change. |
| C8 | Only four "Chef's Recommendations" | The site has 12 dishes plus search, filters and sort that must keep working. | The rail **is** the menu: it shows the four recommendations by default and every dish once a category, search or filter is used. The secondary filters (veg only, high protein, favourites, sort) move into the toolbar's **Filter** popover. |
| C9 | Story photo of diners at the Charminar | No such photo. Stock or AI-generated people would read as fake. | **D3:** a freely licensed real photo found online (see §6). |
| C10 | Hand-drawn Charminar illustration | Must be drawn. | Draw one original single-stroke SVG and reuse it in three places (logo mark, hero, footer skyline). Not traced from the reference or any third-party artwork. |
| C11 | Category tiles with cut-out illustrated food | No cut-out illustrations exist. | Circle-cropped photos of the matching dish on a `cream-100` tile. |
| C12 | No Delivery & Payment section | The current pinned section has no place in the reference. | **D1:** kept, after the story, restyled to this design (see §6). |
| C13 | Copper `#bc6000` button with white text | 4.36:1, under the 4.5:1 minimum. | Buttons use `copper-600` (`#b45c00`, 4.70:1), visually almost identical. |
| C14 | Tracked-capital section labels ("HYDERABAD SPECIALS", "OUR MENU") | The reference's style, but also a common template tell the brief asks to avoid. | **D4:** kept as drawn, with limits (see §6). |

## 3. Content map

How existing content moves into the reference's sections. Nothing functional is lost.

| Reference section | Built from | New content |
|---|---|---|
| Navbar | `NavbarSection`, `NavLinks`, `CartButton`, `ProfileButton`, `MobileMenu` | Charminar wordmark; Offers and About links (C3) |
| Hero | `Hero.tsx` | New composition; honest stats (C1); secondary link (C2) |
| Search and filter toolbar | Search and filter controls from `MenuSection` | Filter popover (C8) |
| Category tiles | `CATEGORIES` in `MenuSection` | Biryani filter (C7); photo tiles (C11) |
| Chef's Recommendations rail | `MenuSection`, `DishCard`, `CustomizeDialog` | Rail with arrows and swipe; four recommended dishes by default (C8) |
| Offers strip (new, short) | `PROMOS` in `pricing.ts` | Four real codes with copy-to-clipboard |
| Story and features | `WhyUs.tsx` content | Story copy; four honest features (C6) |
| Delivery & Payment (kept, D1) | `DeliveryBanner.tsx` | Same pinned scroll and tracking capture, restyled in forest and copper |
| Footer | `Footer.tsx` | Skyline, ornamental border; real links only (C5) |
| Dialogs and drawer | Cart, checkout, auth, tracking, history, customise, policies | Restyled with the new tokens; behaviour unchanged |

## 4. Architecture

### Keep as is (logic)
`src/store/*`, `src/lib/pricing.ts`, `src/lib/orders.ts`, `src/lib/validation.ts`, `src/lib/menuFilters.ts` (extended for Biryani), `src/data/menu.ts`, `src/components/ui/Modal.tsx` and `Field.tsx`, all dialog logic, and the GSAP setup in `src/lib/gsap.ts`.

### New and changed components
```
src/components/
  brand/
    CharminarMark.tsx        logo mark (small) and line art (large), one SVG source
    Wordmark.tsx             mark + "Food Munch" + tagline, light and dark variants
    TornEdge.tsx             SVG mask for the torn-paper edge
    Flourish.tsx             copper underline stroke
    OrnamentBorder.tsx       footer pattern band
  ui/
    Button.tsx               primary, secondary, quiet variants (replaces ad-hoc classes)
    SectionHeading.tsx       optional label + heading + optional accent word
    IconButton.tsx           moved from navbar/, shared
  home/
    Hero.tsx                 rebuilt
    OffersStrip.tsx          new
    StorySection.tsx         replaces WhyUs.tsx
    DeliveryBanner.tsx       kept (D1); restyled, behaviour unchanged
    FeatureRow.tsx           four features
  menu/
    MenuToolbar.tsx          search + category pills + Filter popover
    CategoryTiles.tsx        five photo tiles
    DishRail.tsx             horizontal rail with arrows, snap, keyboard support
    DishCard.tsx             restyled; same props and behaviour
    MenuSection.tsx          composes toolbar, tiles and rail; state stays here
  layout/
    Footer.tsx               rebuilt layout, same modals and subscribe logic
    navbar/*                 restyled; links.ts updated
```

`WhyUs.tsx` is deleted only after its content is in place in `StorySection.tsx`. `DeliveryBanner.tsx` stays.

### State and data flow
- Menu state stays in `MenuSection`: category, query (shared with the navbar search through `uiStore`), veg, protein, favourites and sort. The rail and tiles receive props.
- The new `'biryani'` category value is handled in `filterMenu`, not in components.
- Recommendations come from a list of dish ids in `src/data/menu.ts` (`RECOMMENDED_IDS`).
- No new global state. No router.

## 5. Phases

Before each phase, re-read `design.md`, this file and the phase's guideline file. Each phase ends with the checks in §7 passing.

| Phase | Scope | Done when |
|---|---|---|
| **0. Documentation** | These five documents | Done; §6 answered |
| **1. Foundations** | Tokens in `index.css`; Fraunces and Caveat installed; Plus Jakarta Sans removed; `Button`, `SectionHeading`; brand SVGs | **Done.** Old token names: 0 left; no hex in components; 56 tests, lint and build pass |
| **2. Navbar** | Wordmark, forest pill bar, active pill, Offers and About links, mobile menu restyle | **Done.** Fits 320–1440 with 8px to spare; scrollspy covers all five links (Contact via page end); 64 tests pass. The Offers strip was built here so its link is never dead. |
| **3. Hero** | Composition, torn panel, forest blob, Charminar art, steam, annotation, honest stats, actions | **Done.** Heading, sentence, actions and stats all above the fold at 1280×800 (stats end at 627px); three heading lines with at least 24px clear of the photo from 1024 to 2560; no horizontal scroll from 320. |
| **4. Menu** | Toolbar, filter popover, category tiles, Biryani filter, dish rail, restyled cards, customise flow | **Done.** Search, categories, veg, protein, favourites and all six sorts still work; 72 tests pass, including the Biryani filter and six new menu component tests; rail shows 4, 3, 2 and 1.2 cards at 1280, 1024, 768 and phones; no horizontal scroll from 320. The Flip highlight slide between pills and tiles is left for Phase 8 (motion). |
| **5. Offers, story, features and delivery** | Offers strip; story section with the licensed photo; feature row; Delivery & Payment restyle | **Done.** Honest copy, with the delivery facts in one shared file (`src/data/facts.ts`) so both sections match word for word; pinned scroll measured working at 1440; no horizontal scroll at 375. Story photo: the owner chose "Charminar-Hyderabad-Telangana-001.jpg" by Theanjalivarma (CC BY-SA 4.0) from a three-photo Commons shortlist; resized to 800w and 1200w, credited under the photo and in Photo Credits. |
| **6. Footer** | Skyline, border, link groups, newsletter, policy and credit dialogs | **Done.** Only real links (tested: every nav link is `#menu` or `mailto:`); every target is 44px on touch screens (measured at 320 and 375), 31px with a mouse; the Menu links open the menu filtered; 76 tests pass. |
| **7. Dialogs and drawer** | Cart, checkout, auth, tracking, history, customise, toasts restyled | **Done.** The full order flow passed end to end in headless Chrome at 1280 and 375: customise, add, promo FIRST50 (₹512 total), tip, checkout errors then valid details, cash on delivery, tracking, account and order history. Every dialog fits the screen, no target is under 40px, there are no console errors, and the Fraunces Latin-extended file never loads. |
| **8. Motion** | Everything in `animation-guidelines.md` | **Done.** Added the cart flight with arrival pop, sliding pill and tile highlights, label-rule draw, clip-path image reveals, photo fade-in, count crossfade, toast entrance and the UPI "Confirming…" state. Verified in headless Chrome: highlights caught mid-slide, the cart count changes only on landing, nothing stays hidden after scrolling, every loaded photo is shown; under reduced motion adds are instant, there is no dot and no press-scale. Fixed a bug where the navbar pill never actually slid. **Open for Phase 9:** the 60fps / long-task target, measured on a production build (the dev server is not representative). |
| **9. Quality assurance** | §7 in full, reference comparison, fixes | **Done, with one target missed.** Green: lint, 76 tests, build; no overflow, errors or navbar clipping at 14 widths (320–2560); every touch target 44px on phones except inline credit links (exempt); keyboard-only order works end to end; contrast passes everywhere checked; one `h1`, no skipped headings, every control named and field labelled; reduced motion verified; CLS 0 on phone and desktop (was 2 on desktop); no image over 200KB (largest 193KB); desktop LCP 0.4–1.5s. **Missed:** hero LCP under 2.5s on the mid-range mobile profile (4× CPU, slow 4G): first paint is 7–8s there and about 3s even at full CPU speed, because the page renders only after ~400KB of script, fonts and photo download and run. The fix is prerendering the HTML at build time (a new build step), proposed as a follow-up. **Fixed along the way:** layout shift from the GSAP pin (now CSS sticky), repeated ScrollTrigger refreshes, a hidden navbar pill measuring on every scroll, reveal setup reading styles element by element, `font-size-adjust` doubling style cost, measurements forcing layouts during the first render, hover and switch transitions that never animated (Tailwind v4 `scale`/`rotate`/`translate` properties), missing focus rings on two icon inputs, the default Vite favicon and an old theme colour. |

## 6. Owner decisions (answered 2026-11-18)

| # | Question | Decision | What it means for the build |
|---|---|---|---|
| **D1** | The pinned Delivery & Payment section is not in the reference. | **Keep it.** | It stays after the story section, with its pinned scroll and real tracking capture. It is restyled to this design: `forest-950` card, copper accents, Fraunces headings, cream text. The feature row still carries short versions of the same facts, so both must use identical wording and numbers. |
| **D2** | The reference's invented claims. | **Honest versions.** | Same layout, true content: the replacements in C1, C2, C3, C5 and C6. |
| **D3** | The story photo of diners. | **Find a real photo online and use it.** | Search only free-licence sources (Wikimedia Commons, public domain, CC BY or CC BY-SA). Subject: people sharing a meal, ideally Hyderabadi food or the Charminar. No AI-generated or watermarked images, nothing with an unclear licence. Show the shortlist to the owner before use; credit it in the Photo Credits dialog; resize to 1600px or less. Until approved, the copper-pot biryani photo holds the slot. |
| **D4** | Tracked-capital section labels. | **Keep, as drawn.** | Copper capitals with a short rule, at most one per section, in four sections only (hero, menu, story, delivery), each naming something real. |

## 7. Testing and validation

After every phase:
1. `npm run check`: lint, all unit tests (48 today, more as filters grow) and the production build.
2. A headless browser run (Puppeteer, from the scratch folder, outside the project) at 320, 375, 768, 1024, 1280, 1440 and 1920 wide: no horizontal overflow, no console errors, nav fits, tap targets 44px or larger on phones.
3. Section screenshots compared side by side with `docs/design-reference.webp` at 1440.
4. Functional pass on the phases touched: search, category, filters, sort, favourites, add to cart, customise, promo, tip, checkout, payment, tracking, history, reorder, rating, auth, policies.

At the end (Phase 9), additionally:
- Reduced motion with `prefers-reduced-motion: reduce` emulated.
- Layout shift: CLS under 0.05 from a throttled load.
- Image weight: no image over 200KB served; hero LCP under 2.5s on a mid-range mobile profile.
- Keyboard-only pass through the whole order flow.
- A real phone check by the owner on the Vercel preview.

## 8. Risks

| Risk | Mitigation |
|---|---|
| Fraunces plus Caveat add font weight | Variable fonts, subset to Latin, `font-display: swap`. **Measured in Phase 1:** Inter 47KB + Fraunces 66KB, plus a 58KB Fraunces "Latin extended" file that loads only because prices use the rupee sign (U+20B9). **Fixed in Phases 4 and 7:** `Price` sets ₹ in Inter everywhere (page and dialogs), whose Latin-extended file already loads for the offer titles, so the 58KB Fraunces file never downloads (measured through the whole order flow). Italic (79KB) loads only where an accent word appears. |
| SVG masks (torn edge) render differently across browsers | Test in Chrome and Firefox; fall back to a straight edge |
| A rail hides dishes that a grid showed | Arrows, swipe, keyboard, a visible "N dishes" count, and the full list whenever a filter or search is active |
| Scope creep beyond the reference | Any section not in the reference needs an entry in §6 first |

## 9. Modern web guidance

By owner request, every phase starts by searching Google Chrome's `modern-web-guidance` guides for the features it builds and applies what they require. On Windows run it from PowerShell: `npx -y modern-web-guidance@latest search "<query>"`, then `retrieve "<id>"`.

| Phase | Guides applied | What they changed |
|---|---|---|
| 1 | `visually-stable-font-fallbacks` | `font-size-adjust: from-font` on `html`, so text keeps its size while Fraunces and Inter load. **Replaced in Phase 9:** it doubled the cost of every style recalculation on a slow phone; the two first-screen fonts are now preloaded from `index.html` instead, so they arrive before first paint (measured CLS 0). |
| 1 | `complex-shapes` | The torn-paper edge uses `mask-image` with the `-webkit-` prefix (not `clip-path`); without mask support it stays a plain rectangle |
| 1 | `icons` | The Charminar is drawn once as a `<symbol>` and reused with `<use>` in the skyline; decorative SVGs are `aria-hidden` |
| 1 | `natural-interactions` | Buttons show distinct hover (colour), press (scale) and focus (ring) states; focus rings meet 3:1 |
| 2 | `scrollspy` | Sections carry `tabindex="-1"` so a nav jump lands focus inside them. The active link uses a pill, bold text and `aria-current`, not colour alone. `scroll-target-group` is Chromium-only, so the guide's IntersectionObserver fallback is the single implementation for every browser. |
| 2 | `state-aware-sticky-headers` | The bar's lifted shadow comes from `@container site-header scroll-state(stuck: top)`; the JavaScript scroll listener is gone. Browsers without it keep the resting shadow, the guide's recommended fallback. |
| 2 | `copy-button` | Offer codes copy with the Clipboard API; the confirmation is a `role="status"` region beside (not inside) the button, shown with opacity; the button is never disabled; repeat presses restart the timer; failures are shown too. |
| 2 | `navbar` | One `<nav aria-label="Main">` on desktop. Deviation, recorded: the guide's measured collapse and native popover are not used. The phone menu stays the slide-in sheet from `design.md` (a Radix dialog, which `navigation-drawer` also supports), and the switch happens at the `lg` breakpoint, measured to fit at every width from 320. |
| 2 | `menu` | Checked, not applied: a three-item account dropdown would need popover and focusgroup fallbacks. Order tracking and history moved into the existing account dialog instead. |
| 3 | `optimize-image-priority` | The hero photo is the LCP image: `fetchpriority="high"`, explicit width and height, no lazy loading, and an 800w/1400w `srcset` (108KB and 266KB). |
| 3 | `motion` | The global 0.01ms reduced-motion override is gone. Movement is opt-in per rule inside `prefers-reduced-motion: no-preference`; fades stay; smooth scrolling is opt-in. Steam plays a few times and stops instead of looping, so it needs no pause control. |
| 3 | `parallax-scroll-effects` | The photo and Charminar drift with `animation-timeline: scroll(root)`, inside `@supports` and the motion query, desktop only. No scroll listener and no GSAP for it. |
| 3 | `improve-text-layout-and-legibility` | `display-xl` lowered so each heading line fits; the hero sentence is held to 34rem; the stats keep the label (`dt`) first in reading order and show the value on top with grid placement. |
| 4 | `carousel` | The dish rail is a native horizontal scroller with mandatory snap and `overscroll-behavior-x: contain`; smooth scrolling only without reduced motion. Previous and next are real buttons that move one card, build on a pending target for quick presses, disable at the ends (finite navigation, as the design asks) and hand focus to the other button when they disable. A polite status says "Showing dishes 2 to 5 of 6" after scrolling settles (`scrollend`, with a debounced fallback). The track is focusable and its ring is drawn on its frame. **Deviation, recorded:** no slide markers or `aria-roledescription="carousel"`; this is a list of products, each with its own controls, not a set of slides, so it stays a labelled `<ul>`. |
| 4 | `declarative-dialog-popover-control` | The filter panel is a native `popover="auto"` opened by the Filter button with `popovertarget`, so light dismiss, Escape, the expanded state and focus return are the browser's. CSS anchor positioning places it under the button and flips it above when needed; a short script places it where anchor positioning is missing. The "Done" button inside returns focus to the trigger by hand, as the guide warns. It opens with `@starting-style` and `allow-discrete` transitions. **Deviations, recorded:** `popovertarget` instead of `commandfor` (same behaviour, wider support, no invokers polyfill), and no popover polyfill: in a browser without popovers the panel simply shows under the toolbar, still usable. This replaces the Radix popover the guidelines first named, so no new package was added. |
| 4 | `toolbar` | Checked, not applied: `role="toolbar"` suits controls that act on something else, but this one holds a text field, where arrow keys must move the caret. The category pills are a `radiogroup` instead (one tab stop, arrows and Home/End choose, wrapping at the ends). |
| 9 | `performance` | Hero photo preloaded with `imagesrcset` and `fetchpriority="high"` (React renders it, so the preload scanner could not see it); Inter and Fraunces preloaded; checkout, account, tracking and history split into lazy chunks fetched when idle (main bundle 520KB → 430KB); images capped at 200KB; CLS 0. Not met: the mobile LCP target, which needs prerendered HTML. |
| 9 | `accessibility` | Contrast, names, labels, ids, headings, landmarks and focus rings checked across the page at 1280 and 375; a keyboard-only order from "+ Add" to tracking passes. Two icon-wrapped inputs gained a visible 2px ring (`has-[:focus-visible]`). |
| 9 | `motion` (reveals) | Scroll reveals are now CSS transitions toggled by an IntersectionObserver instead of per-element GSAP tweens and ScrollTriggers; the Delivery pin uses CSS `position: sticky`. Same look, far less main-thread work. |
| 8 | `motion` | The last movements that ignored reduced motion are now opt-in: every press-scale (`motion-safe:active:scale-*`) and the loading spinner's rotation. Fades stay for everyone (photo fade-in, result count, toast). Nothing waits on `animationend`; the cart line still has its timer fallback. |
| 8 | `natural-interactions` | Motion opens from its trigger: the cart dot starts at the pressed button, highlights move from the old choice to the new one. A ResizeObserver's first report no longer cancels these slides (this also fixed the navbar pill). |
| 7 | `dialog` | **Deviation, recorded:** the dialogs stay on Radix Dialog rather than native `<dialog>`. Radix already supplies the modal semantics, focus kept inside, Escape and outside click, focus return and a page scroll lock. The dialogs open from shared store state, and the phase was a restyle with behaviour unchanged. Applied from the guide: `overscroll-behavior: contain` on dialog and drawer content, a visible 44px close button on every dialog, and no extra focus trap or Escape handler. |
| 7 | `navigation-drawer` | Checked for the cart sheet: it slides from the right, dismisses with Escape, the close button or a tap outside, and has its own close control. Swipe-to-close is not added; it would be new behaviour. |
| 7 | `forms` (dialogs) | All dialog fields use 16px text (no iOS zoom), 44px height and `autocomplete`; the promo field turns off autocorrect; checkout errors clear as soon as the field is edited, while the check still runs on submit. |
| 6 | `forms` | The demo newsletter keeps its check on submit and its messages. Added: a failed submit moves focus back to the field; typing clears the error and `aria-invalid`; `autocorrect="off"`, `autocapitalize="none"`, `spellcheck=false` and `enterkeyhint="send"` on the email field; the field is 44px tall. |
| 6 | `accessibility` | The footer link groups sit in one `<nav aria-label="Footer">`, laid out as a real grid cell (not `display: contents`, which some screen readers drop as a landmark). Track order and Order history are buttons (they open dialogs); Contact is a `mailto:` link. Headings are `h2`. |
| 5 | `performance` | Below-the-fold photos (story, offers, delivery phone) keep explicit width and height and `loading="lazy"`; the story photo has 800w and 1200w copies with `srcset` and `sizes`. |
| 5 | `carousel` (offers strip) | On phones the three offer codes are a native snap strip with scroll padding; the strip is `relative`, which fixed a real bug: the hidden "Copy code FIRST50" labels escaped the scroller and widened the page by 266px. |
| 5 | `scrollytelling` | Checked, not applied: the guide drives effects with CSS view timelines, but the Delivery & Payment pinned scroll is kept as built (owner decision D1), on GSAP ScrollTrigger with its plain fallback for phones and reduced motion. |
| 4 | `natural-interactions` | Cards no longer lift on hover (the photo zooms only with motion allowed); every menu control is at least 44px; touch targets use `touch-action: manipulation`. |

