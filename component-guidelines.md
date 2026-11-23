# Food Munch: component guidelines

How each reusable component is built. Colours, type, spacing, radii and shadows are tokens defined in `design.md` §3–§6 and are referenced here by name only. Motion for each component is specified in `animation-guidelines.md`.

## 1. Shared rules

- **One component, one job.** Logic (stores, pricing, filters) stays in `src/store` and `src/lib`; components receive data and callbacks.
- **Tokens only:** no hex values, `font-family` strings or ad-hoc shadows in components.
- **Accessible by default:** semantic elements first (`button`, `a`, `nav`, `dialog` via Radix), a visible label or `aria-label` on every control, and 44px minimum tap targets on touch screens.
- **Eight states** for every control: default, hover, focus-visible, active (pressed), disabled, loading (where it applies), selected (where it applies) and error (inputs).
- **Variants by prop, not by copy-pasted classes:** `variant="primary" | "secondary" | "quiet"`, `size="md" | "lg"`.
- **Class merging:** a small `cx()` helper in `src/lib/cx.ts` (or `clsx`, already installed).
- **Files:** one component per file, named after the component, in its feature folder.

## 2. Design tokens in code

`src/index.css` holds all tokens in one `@theme` block, generating Tailwind utilities:

```css
@theme {
  --color-forest-950: #082014;
  --color-forest-900: #0b2418;
  --color-forest-800: #143424;
  --color-forest-700: #1e4a34;
  --color-copper-500: #bc6000;
  --color-copper-600: #b45c00;
  --color-copper-700: #a35200;
  --color-copper-800: #8f4700;
  --color-gold-300: #f0c27a;
  --color-gold-400: #e0a55a;
  --color-cream-50: #fffaf3;
  --color-cream-100: #fcf4ec;
  --color-cream-200: #f8ece0;
  --color-cream-300: #fce4c4;
  --color-ink-900: #1a120b;
  --color-ink-600: #5f5246;
  --color-line-200: #e6d6c2;
  --color-field-500: #8f7a63;
  --color-veg: #1f7a3d;
  --color-nonveg: #b3261e;
  --color-star: #c96d04;

  --font-display: "Fraunces Variable", Georgia, serif;
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  --font-note: "Caveat Variable", cursive;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  /* shadows: see design.md §6 */
}
```

Old token names (`cream`, `gold`, `ink`, `surface`, `muted`) are removed in Phase 1, with every use migrated in the same commit, so no component can fall back to the old palette.

## 3. Brand components (`src/components/brand/`)

| Component | Props | Notes |
|---|---|---|
| `CharminarMark` | `variant: 'mark' \| 'art' \| 'skyline'`, `className` | One original SVG drawing. `mark` is the 28px logo version; `art` is the large line drawing behind the hero dish; `skyline` repeats it with simple domes for the footer. `aria-hidden`. |
| `Wordmark` | `tone: 'light' \| 'dark'`, `showTagline` | Mark + "Food" + copper "Munch" (gold on dark) + "Hyderabad food delivery". It is a link to `#home` with the accessible name "Food Munch, home". |
| `TornEdge` | `side: 'left' \| 'right' \| 'top'`, `children` | Wraps an image panel and applies the torn mask. Falls back to a straight edge if masks are unsupported. |
| `Flourish` | `width`, `drawn` | The copper underline stroke. `drawn` animates `stroke-dashoffset`. |
| `OrnamentBorder` | none | Repeating footer band, `aria-hidden`. |

## 4. Buttons (`src/components/ui/Button.tsx`)

| Variant | Use | Size |
|---|---|---|
| `primary` | One per view: Order now, Place order, Pay | `lg` 52px (hero), `md` 48px |
| `secondary` | + Add, Apply, See how ordering works | `md` 44px |
| `quiet` | Icon buttons: arrows, heart, close | 44px square |

- Renders a `<button>` by default or an `<a>` when given `href`.
- `loading`: shows a spinner, keeps the width, sets `aria-busy` and disables the button.
- `icon` / `iconPosition`: the trailing arrow is allowed only on the hero's primary action (`design.md` §10).

## 5. Navbar (`src/components/layout/navbar/`)

**Anatomy:** a full-width pill in `forest-800` inside the shared container: `Wordmark` (light), `NavLinks`, then search, cart and profile.

| Part | Rule |
|---|---|
| Links | Home, Menu, Offers, About, Contact. Inter 500 15px, cream. The active link sits in a `gold-300` pill with `ink-900` text; one moving highlight element (Flip). |
| Search | An icon button that scrolls to the menu and focuses the menu's own search field, so the page never shows two search boxes. The mobile sheet keeps its own search field (shared query through `uiStore`). |
| Cart | Quiet icon button with a copper count badge; the badge is hidden at zero. |
| Profile | A 40px circle: initials on `cream-300` when signed in, otherwise the user icon. It opens the account dialog. |
| Order history | Lives in the account dialog ("Track your order", "Order history (n)"), opened from the profile circle, which shows a green dot while an order is on its way. |
| Order now | Not in the desktop bar, matching the reference; the hero carries the main action. The mobile sheet keeps an "Order now" button. |
| Sticky | Sticks to the top with 12px inset; gains `shadow-lift` after scrolling. |

**Responsive:** below 1024, the links move into the mobile sheet (`MobileMenu`), leaving the wordmark, cart and a menu button. The mobile sheet lists the same links plus Track order and Order history.

## 6. Hero (`src/components/home/Hero.tsx`)

**Anatomy, desktop:** a two-column grid in the container.
- **Left:** section label ("Hyderabad specials", per D4), the `display-xl` heading in three lines with the italic copper "*Delivered.*" and its flourish, the `body-lg` sentence, the primary action "Order now" (to `#menu`), the secondary "See how ordering works" (to `#delivery`), and the three-stat row. The column ends 3rem before the panel at every width (its width subtracts the centred container's offset), and each heading line stays on one line from 1024 up.
- **Right, bleeding to the viewport edge:** a `TornEdge` panel (torn left edge, 50vw) holding the handi photo, the steam layer and the handwritten note "Authentic Hyderabadi biryani" top right, with its arrow pointing at the dish. It starts at the top of the page, behind the navbar. The Charminar `art` sits on the cream just behind the torn edge at 0.18 opacity.
- **Removed:** the old Chef's Pick card; the menu now introduces dishes.

**Stat row:** three items, each an icon in `copper-600` (no coin), a value in Fraunces 700 22px and a label in `caption`. Demo values are labelled ("Demo rating").

**Rules:** the heading, sentence and primary action are visible at 1280×800. The dish image has `fetchpriority="high"`, explicit dimensions and no lazy loading.

**Responsive:** below 1024, the text comes first, then the dish panel at full width (aspect 4:3, torn top edge), then the stats. Below 640 each stat stacks its icon, value and label. `TornEdge` takes `side="top" lgSide="left"` for this switch.

## 7. Menu toolbar (`src/components/menu/MenuToolbar.tsx`)

**Anatomy:** one white (`cream-50`) pill bar, `shadow-card`: the search field on the left, a divider, then category pills (All, Biryani, Starters, Mains, Desserts, Drinks), a divider, and a Filter button.

| Part | Rule |
|---|---|
| Search field | `aria-label="Search dishes"`, clear button when not empty, shared query |
| Category pills | `role="radiogroup"` with roving tab index; selected pill in `copper-600` with white text |
| Filter button | Opens a native popover (`FilterPanel.tsx`) with three switches (Veg only, High protein (20g+), Favourites (count)), the Sort select, "Clear filters" and "Done". It shows a copper dot and the hidden text "(filters on)" when any of these is active. |

**Responsive:** one row from 1024. Below that, the search sits on its own row and the pills become a horizontal scroll strip with Filter as the last pill; below 768 the toolbar also sticks under the nav. (The single row needs about 880px, so it starts at `lg`, not `md`.)

## 8. Category tiles (`src/components/menu/CategoryTiles.tsx`)

- Five tiles: Biryani, Starters, Mains, Desserts, Drinks. Each is a `button` with `aria-pressed`, a circular photo crop of a matching dish and the label in Fraunces 600 18px.
- Selected: `cream-300` fill with a 1.5px `copper-500` border. Selecting a tile sets the same category as the toolbar pill, and both stay in sync.
- Selecting the active tile again returns to All.
- **Responsive:** five columns from 1024; a horizontal snap strip with 112px tiles on smaller screens.

## 9. Dish rail and cards (`DishRail.tsx`, `DishCard.tsx`)

**Rail**
- A `section` with heading "Chef's recommendations" by default. When a category, search or filter is active, the heading becomes the category name or "Search results", with the count.
- A horizontal scroll container with `scroll-snap-type: x mandatory`, keyboard focusable, arrow keys scroll by one card.
- Previous and next quiet buttons in the heading row, disabled at the ends.
- The shown list is `RECOMMENDED_IDS` when nothing is filtered, otherwise every matching dish.
- Empty state: "No dishes match. Clear filters", with a secondary button.
- With nothing filtered, a secondary "See all 12 dishes" button under the rail shows every dish (heading "All dishes"), and toggles back to "Show the chef's picks". Added in Phase 4 so the full menu stays one press away now that the default view shows six dishes.
- The heading row carries the "Our menu" label. A count line under the rail reads "Showing n dishes. Ratings are demo data."

**Card**
- `article` with `id="dish-{id}"` (anchor target from the hero) and `data-id` (used by filter animations).
- Photo 4:3 with a rating chip top-left (star icon + value, `cream-50` at 92%) and the favourite quiet button top-right.
- Veg or non-veg marker, then the name in `title`, a two-line description in `body-sm`, then a row with the price (`Price`, which sets ₹ in Inter) and a secondary "+ Add" button. The photo has empty alt text, because the name is right below it. Prep time and calories are no longer shown on the card.
- Dishes with options open `CustomizeDialog`; others add directly with the "Added" feedback (`animation-guidelines.md` §7).
- Badges (Bestseller and so on) are not shown on cards; the rail heading already marks these as recommendations.

## 10. Offers strip (`src/components/home/OffersStrip.tsx`)

- A short band in `cream-300` with the heading "Offers", after the menu. It lists three real codes from `PROMOS` (FIRST50, MUNCH10, FEAST75), each with its title and a "Copy code" outline button that confirms "Copied" or "Copy failed" for 2s. `LUCKY60` is not listed: its title calls it a wheel reward, and the site has no wheel. The code still works in the cart.
- On phones, a horizontal snap strip of bordered code cards (82% wide, so the next one peeks); from 640px, three columns with hairlines.

## 11. Cart components

- **Cart button:** see §5.
- **Cart drawer (`CartDrawer.tsx`):** keeps all behaviour. Restyle: `cream-50` panel; heading in `display-md`; line items without inner cards (hairline dividers instead); promo field and tip chips in the same style as the toolbar; the total in `price`; a primary "Place order" button pinned to the bottom.
- **Toast:** `forest-800` pill with cream text, bottom centre, `role="status"`.

## 12. Story and features (`StorySection.tsx`, `FeatureRow.tsx`)

- **Story:** the photo in a `TornEdge` frame on the left (per D3), and on the right the section label "Our story", the `display-lg` heading with the italic copper "*Hyderabad,*", two short paragraphs and the feature row.
- **Feature row (`FeatureRow.tsx`):** four items, each a 56px `cream-300` square with a copper outline icon beside a `title` and two lines of `body-sm`. Copy per `implementation-plan.md` C6, with the delivery wording read from `src/data/facts.ts`. **Changed in Phase 5:** a 2×2 grid with one hairline between the columns, not four in a row: in the half-width text column four across broke every title onto two lines.
- **Responsive:** below 1024, the photo goes above the text at full width with a torn top edge (`TornEdge side="top" lgSide="right"`); features stay 2×2, then one column under 480.
- **Copy:** "The taste of *Hyderabad,* now at your doorstep." Two paragraphs: the dishes on the menu, then a plain statement that this is a demo restaurant built as a portfolio project, where nothing is really cooked or delivered.
- **Photo:** the Charminar and Laad Bazaar (Commons, by Theanjalivarma, CC BY-SA 4.0, chosen by the owner under D3), set in one `PHOTO` constant at the top of `StorySection.tsx`, with its credit line in a `figcaption` under it and in Photo Credits.

## 13. Delivery & Payment (`src/components/home/DeliveryBanner.tsx`, kept by D1)

- Keeps its structure and behaviour: the pinned scroll on large screens, the plain layout on phones and under reduced motion, the real tracking capture in the phone, keyboard focus on the action scrolling to it.
- Restyle only: the card becomes `forest-950` (replacing the roast brown); headings in Fraunces with cream text; feature icons and badges in `copper-600` and `gold-300`; the section label "DELIVERY" per D4 (centred, a rule each side); the closing action uses the primary button classes (`buttonClasses`, since the pinned scroll needs a ref on the link).
- Its facts (about 22 min, UPI or cash, simulated tracking) must match the feature row's wording exactly.

## 14. Footer (`src/components/layout/Footer.tsx`)

- `forest-900` band with the `CharminarMark` skyline along its top edge in `gold-400` and the `OrnamentBorder` along the bottom.
- **Columns:** the brand (`Wordmark` dark, one-line description, GitHub and LinkedIn), Menu (Biryani, Starters, Mains, Desserts, Drinks, as filter links), Help (Track order, Order history, Contact), Legal (Privacy, Terms, Photo credits) and the newsletter ("Stay in the loop", demo, with its honest note).
- Headings in Fraunces 600 18px `gold-300`; links Inter 15px cream at 85%, with 44px tap height on touch screens.
- The bottom line: "© {year} Food Munch. Portfolio project by Adithya Kammara."
- Keeps the Privacy, Terms and Photo Credits dialogs and the subscribe validation unchanged.
- **Built in Phase 6:** the Menu links set the shared category (`uiStore.menuCategory`) and jump to `#menu`, so "Biryani" opens the menu showing the two biryanis. Help's Track order and Order history open their dialogs (each has an empty state); Contact is the project email. The sample address and phone number were removed. Tablet: brand and newsletter span both columns, the three link groups share one row; phones: two link columns.

## 15. Responsive navigation summary

| Width | Nav | Toolbar | Tiles | Rail |
|---|---|---|---|---|
| 1280+ | Full links | One row | 5 columns | 4 cards |
| 1024–1279 | Full links, search collapses to an icon | One row | 5 columns | 3 cards |
| 768–1023 | Sheet menu | Two rows | Scroll strip | 2 cards + peek |
| Under 768 | Sheet menu | Sticky, scroll strip | Scroll strip | 1 card + peek |

## 16. Shared utilities

| Utility | Location | Purpose |
|---|---|---|
| `useReveal` | `src/lib/useReveal.ts` | Scroll reveal for `data-reveal` children (kept) |
| `MOTION` tokens | `src/lib/motion.ts` | Durations and easings (updated to `animation-guidelines.md` §2) |
| `pop()` / `flyToCart()` | `src/lib/motion.ts` | Small confirmations; the cart dot (`countUp()` was removed in Phase 9, unused since the story section replaced Why Us) |
| `useActiveSection` | `navbar/useActiveSection.ts` | Active nav link (kept; adds Offers and About) |
| `cx()` | `src/lib/cx.ts` (new) or `clsx` | Class merging |
| `Price` | `src/components/ui/Price.tsx` | Every price: tabular figures, ₹ in Inter (`plain` for body text) |
| `fieldClasses()` | `src/components/ui/fieldClasses.ts` | Dialog form controls |

## 17. Dialogs (`src/components/ui/Modal.tsx` and the dialogs that use it)

Added in Phase 7. Behaviour is unchanged everywhere; only the look is shared.

- **One shell:** `Modal` is used by checkout, tracking, history, account, customise and the three footer policies. It has a `cream-50` panel, a 16px radius (`radius-lg`) and `shadow-dialog`. The title is `display-md` Fraunces 600, with a short `body-sm` description and a 44px quiet close button top right. Sizes: `md` 28rem, `lg` 36rem and `xl` 40rem. The overlay is `forest-950` at 50%, and content uses `overscroll-behavior: contain`.
- **Cart drawer (`CartDrawer.tsx`):** a right-hand sheet, 30rem wide, built on the same rules (see §11). Its wording is "cart", not "bag", to match the navbar button.
- **Fields:** `fieldClasses()` in `ui/fieldClasses.ts`: 44px tall, 16px text so iOS does not zoom on focus, an 8px radius, a copper focus border and a red error border. `Field.tsx`, the account fields and the checkout time select all use it.
- **Choices:** radio and checkbox choices are whole-row labels with a copper border when chosen (`has-[:checked]`). Spice levels are pills that keep the real radio for keyboards and screen readers.
- **Prices:** every amount uses `Price`. `plain` sets it in Inter for bill rows, chips and button labels.
- **Errors:** forms still check on submit; typing in a field clears its error.
- **Removed:** the account dialog's decorative photos, leaf and dots, and the history dialog's header icon and leaf drawing.
