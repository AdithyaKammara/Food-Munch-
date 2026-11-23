# Food Munch: project context

Facts about the project as it stands, for anyone (person or agent) picking up the redesign. Design rules are in `design.md`; the plan and decisions are in `implementation-plan.md`.

## Overview

Food Munch is a **frontend portfolio project** by Adithya Kammara: a Hyderabadi food-ordering demo. Visitors browse a 12-dish menu, customise dishes, use promo codes, check out with a simulated UPI or cash payment, track a timed demo delivery, and review past orders. There is **no backend**: nothing is cooked, paid for or delivered, and the site says so.

- **Live:** https://foodmunch-app.vercel.app/ (Vercel, deployed from `main`)
- **Repository:** https://github.com/AdithyaKammara/Food-Munch-
- **Local:** `C:\dev\food-munch`

## Technology stack

| Area | Choice | Version |
|---|---|---|
| Framework | React | 19.3 |
| Language | TypeScript | 6.0 |
| Build tool | Vite (Rolldown) | 8.3 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), tokens in `@theme` | 4.3 |
| State | Zustand, with `persist` to localStorage | 5.0 |
| Dialogs and switches | Radix UI (`react-dialog`, `react-switch`) | 1.x |
| Animation | GSAP + ScrollTrigger + `@gsap/react` | 3.15 |
| Icons | lucide-react | 1.61 |
| Payments (demo) | `qrcode.react` for the UPI QR | 4.2 |
| Fonts | `@fontsource-variable/fraunces` (display), `inter` (body), `caveat` (hero note only) | 5.3 |
| Tests | Vitest + Testing Library + jsdom | 5.0 |
| Lint | ESLint 10 with React hooks and refresh plugins | 10.13 |
| Hosting | Vercel (production from `main`, previews per pull request) | |

### Commands

| Task | Command |
|---|---|
| Install | `npm install` |
| Dev server | `npm run dev` (the session uses `npm run dev -- --port 5233 --strictPort`) |
| Lint | `npm run lint` |
| Unit tests | `npm test` (76 tests in 8 files) |
| Production build | `npm run build` |
| All checks | `npm run check` |

### Unused dependencies

Removed on 2026-11-22 with the owner's go-ahead: `motion`, `react-router`, `recharts`, `leaflet`, `react-leaflet`, `@types/leaflet`, `canvas-confetti`, `@types/canvas-confetti`, `react-hook-form`, `zod`, `@hookform/resolvers`, `@radix-ui/react-select` and `@radix-ui/react-tabs`. `clsx` is now used throughout. Every remaining dependency is imported by the app or its tooling.

## Folder structure

```
food-munch/
  design.md, implementation-plan.md, animation-guidelines.md,
  component-guidelines.md, project-context.md   ← redesign documents
  docs/design-reference.webp                     ← the approved visual reference
  public/images/                                 ← dish and section photos (JPEG)
  src/
    App.tsx                  page composition and dialogs
    main.tsx                 entry, font imports
    index.css                tokens (@theme), base styles, motion CSS
    data/menu.ts             12 dishes, categories, portions, add-ons
    lib/                     pricing, orders, validation, menu filters, GSAP setup, motion helpers
    store/                   cart, favourites, orders, user, ui (Zustand)
    components/
      home/                  Hero, OffersStrip, StorySection, FeatureRow, DeliveryBanner
      menu/                  MenuSection, DishCard, CustomizeDialog
      cart/                  CartDrawer
      checkout/              CheckoutDialog, AuthDialog
      orders/                TrackingDialog, HistoryDialog
      layout/                Navbar, Footer, navbar/*
      ui/                    Modal, Field
```

Local-only folders, not committed: `.claude/` (preview server config) and `.hallmark/` (audit screenshots and restore patches).

## Existing functionality (must keep working)

| Feature | Where | Persistence |
|---|---|---|
| Menu: category, text search shared with the nav, veg only, high protein, favourites, six sort orders | `MenuSection`, `lib/menuFilters.ts`, `uiStore` | Favourites: `foodMunchFavsV3` |
| Customise dish: portion, spice, add-ons | `CustomizeDialog`, `lib/pricing.ts` | |
| Cart: add, change quantity, remove, macros total | `CartDrawer`, `cartStore` | `foodMunchCartV3` |
| Promo codes `FIRST50`, `MUNCH10`, `LUCKY60`, `FEAST75` with minimums and first-order rule | `lib/pricing.ts` | |
| Rider tip (toggle ₹20, ₹50, ₹100) and 5% GST | `lib/pricing.ts` | |
| Demo sign-in (name, phone, address) | `AuthDialog`, `userStore` | `foodMunchUserV3` |
| Checkout: validated name, phone and address, delivery slots, UPI QR (demo) or cash | `CheckoutDialog`, `lib/validation.ts` | |
| Order tracking: 30-second timed demo, rating, clears on any close once delivered | `TrackingDialog`, `ordersStore` | `foodMunchOrdersV4` |
| Order history and reorder | `HistoryDialog` | |
| Newsletter form (demo; validates, sends nothing) | `Footer` | |
| Privacy, Terms and Photo Credits dialogs | `Footer` | |
| Active-section nav highlight, reading progress bar, mobile menu | `navbar/*` | |
| Offers strip with copy-to-clipboard codes | `home/OffersStrip.tsx` | |
| Story section and honest feature row (shared delivery facts) | `home/StorySection.tsx`, `FeatureRow.tsx`, `data/facts.ts` | |
| Menu toolbar, filter popover, category tiles, Biryani filter, dish rail | `menu/MenuToolbar.tsx`, `FilterPanel.tsx`, `CategoryTiles.tsx`, `DishRail.tsx`, `lib/menuFilters.ts` | |
| Reduced motion, skip link, focus management | `index.css`, `App.tsx`, Radix | |

## Integrations

None. No API, no analytics, no payment provider. Vercel builds from GitHub. Third-party content is limited to three Wikimedia Commons photos (credited) and the remaining photos, which the site credits to Unsplash (not verified).

## Technical constraints

- **Honesty:** every rating, badge and delivery time is demo data and labelled as such. No invented metrics or capabilities.
- **No backend:** all state is in localStorage; storage keys above must not change, or returning visitors lose their cart and orders.
- **Accessibility:** WCAG 2.2 AA contrast, 44px touch targets, keyboard-operable dialogs and rail, reduced-motion support.
- **Performance:** no image over 200KB; hero LCP under 2.5s on mobile; fonts subset and swapped.
- **Licences:** two of the Wikimedia photos are CC BY-SA, so edited versions stay under the same licence. New fonts must be OFL or similar.
- **Deploys:** merging to `main` publishes to production immediately. Work happens on a branch with a pull request and a Vercel preview.

## Decisions log

| Date | Decision |
|---|---|
| 2026-11-05 | Polish and layout refinements merged (`46b20a4`, `d95720c`, merge `dff2024`). |
| 2026-11-05 | A dark rust-and-gold restyle was tried and reverted at the owner's request. Do not reintroduce it. |
| 2026-11-18 | Redesign direction set: the owner's reference (`docs/design-reference.webp`) is the visual source of truth. Forest green, copper and cream; Fraunces and Inter; the Charminar as the one brand motif. |
| 2026-11-18 | Reference conflicts recorded in `implementation-plan.md` §2 (C1–C14). |
| 2026-11-18 | Owner decisions: keep the Delivery & Payment section, restyled (D1); honest versions of the reference's claims (D2); a freely licensed real photo found online for the story section, approved before use (D3); keep the capital section labels as drawn (D4). |
| 2026-11-18 | Owner asked for Google Chrome's `modern-web-guidance` skill to guide the rebuild. Each phase searches it first and applies the retrieved guides (see `implementation-plan.md` §9). |
| 2026-11-20 | Phase 2 decisions: order history moved into the account dialog (no new dropdown widget); the nav search jumps to the menu's search field; Order now removed from the desktop bar; LUCKY60 left out of the Offers strip (no prize wheel exists); the Why Us section's id is now `about`. |
| 2026-11-22 | Phase 9 decisions: dish photos resized to 800px wide and the hero and story photos regenerated at 1200px and 1000px to keep every image ≤200KB; four dialogs lazy-loaded; the Delivery pin moved to CSS sticky; reveals moved to CSS + IntersectionObserver; `font-size-adjust` replaced by font preloads; the Vite favicon replaced by the Charminar mark; `countUp()` removed. Cleanup approved by the owner the same day: the unused photos (`hero-biryani`, `why-biryani`, `spice-bowls`, `whole-spices`, `footer-spices`) and `public/icons.svg` were deleted, and nine unused packages were uninstalled (leaflet, react-leaflet, @types/leaflet, motion, zod, react-hook-form, @hookform/resolvers, @radix-ui/react-select, @radix-ui/react-tabs). canvas-confetti (and its types), react-router and recharts were found unused and uninstalled too. |
| 2026-11-22 | Phase 8 decisions: an added dish joins the cart when the flying dot lands (instantly under reduced motion); leaving cards are removed at once rather than faded; card hover keeps no lift; no GSAP Flip plugin; found and fixed a ResizeObserver bug that stopped the navbar pill from ever sliding. |
| 2026-11-22 | Phase 7 decisions: dialogs stay on Radix (no native `<dialog>` rewrite); customise, account and history moved onto `Modal`; the account dialog's decorative photos (including a second copy of the hero photo) were removed; "bag" became "cart" everywhere; checkout errors clear on edit. |
| 2026-11-22 | Phase 6 decisions: the menu category moved into `uiStore` so footer links can filter the menu; the footer's sample address and phone were dropped (not real); "Contact" is the project email; the closing motto line was dropped for the single copyright line in the spec. |
| 2026-11-22 | Phase 5 decisions: `WhyUs.tsx` replaced by `StorySection.tsx` + `FeatureRow.tsx` (its count-up stats dropped; the hero already shows the real numbers); delivery facts live in `src/data/facts.ts`; the feature row is 2×2, not four across; the owner picked the Charminar photo (Theanjalivarma, CC BY-SA 4.0) from a Commons shortlist of three; it is credited under the photo and in Photo Credits. |
| 2026-11-22 | Phase 4 decisions: the filter panel is a native popover, not Radix (no new package); Biryani is derived from dish names (C7); the rail shows `RECOMMENDED_IDS` (4, 1, 2, 6, 8, 11) by default, with a "See all 12 dishes" button so the full menu is one press away; the toolbar becomes one row at `lg`; prep time and calories left the cards; the ₹ sign is set in Inter on the page. |
| 2026-11-20 | Phase 3 decisions: the secondary hero action goes to `#delivery` ("See how ordering works"), not the story; steam plays briefly instead of looping (WCAG 2.2.2); `display-xl` lowered to clamp(2.375rem, 4.2vw, 3.375rem); the hero photo is 800w and 1400w copies of `why-biryani.jpg`; the Chef's Pick card was removed. |
| 2026-11-20 | Found and fixed an existing bug: the Contact link could never highlight, because the short footer never reaches the middle of the screen. |
| 2026-11-18 | Vitest excludes `.claude/**` and `.hallmark/**`: an installed skill placed its own test files inside `.claude/skills/`, which made `npm test` fail locally. |

## Progress

| Phase | Status |
|---|---|
| 0. Documentation | **Done**; D1–D4 answered |
| 1. Foundations | **Done** 2026-11-18: tokens, fonts, `Button`, `SectionHeading`, brand SVGs; every component migrated to the new token names; 56 tests passing |
| 2. Navbar | **Done** 2026-11-20: forest bar, sliding active pill, Offers strip, account-dialog order shortcuts, scrollspy fix for Contact; 64 tests passing |
| 3. Hero | **Done** 2026-11-20: new heading and copy, torn forest photo panel behind the navbar, faint Charminar, handwritten note, steam, honest stats, CSS parallax; per-case reduced motion replaces the global override |
| 4. Menu | **Done** 2026-11-22: toolbar with radio-group pills and a native filter popover, category tiles, Biryani filter, dish rail with the chef's recommendations, restyled cards, `Price` component; 72 tests passing |
| 5. Offers, story, features, delivery | **Built** 2026-11-22: offers snap strip on phones, new story section replacing Why Us, honest 2×2 feature row, delivery restyle with shared facts; story photo of the Charminar (Commons, CC BY-SA 4.0, chosen by the owner) |
| 6. Footer | **Done** 2026-11-22: forest-900 band, Charminar skyline, ornament border, real-links-only groups (menu filters, help, legal), demo newsletter with focus and error fixes; 76 tests passing |
| 7. Dialogs | **Done** 2026-11-22: one shared `Modal` shell for six dialogs and the policies, cart drawer restyle (hairline lines, toolbar-style promo and tip, pinned total), shared field style, `Price` everywhere; full order flow verified at 1280 and 375 |
| 8. Motion | **Done** 2026-11-22: cart flight and arrival pop, sliding category highlights, rule draw and image reveals, photo fade-in, toast and count transitions, UPI confirming state; reduced motion checked; performance measurement moved to Phase 9 |
| 9. QA | **Done** 2026-11-22: all functional, layout, keyboard, contrast and reduced-motion checks green; CLS 0; images ≤200KB; desktop LCP 0.4–1.5s. **Not met:** mobile LCP under 2.5s on the slow-phone profile (needs prerendered HTML). Many performance fixes; see `implementation-plan.md` Phase 9. **2026-11-23:** page prerendered at build time and hydrated; slow-phone LCP median 8.4s → 2.4–2.9s across batches, CLS 0; under 2.5s in 5 of 7 runs in the quietest batch. |
