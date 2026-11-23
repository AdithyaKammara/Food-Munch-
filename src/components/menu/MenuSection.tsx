import { useEffect, useMemo, useRef, useState } from 'react'
import { MENU_ITEMS, RECOMMENDED_IDS, type MenuItem } from '../../data/menu'
import { filterMenu, isFiltered } from '../../lib/menuFilters'
import { flyToCart } from '../../lib/motion'
import type { CartLine } from '../../lib/pricing'
import { useReveal } from '../../lib/useReveal'
import { useCartStore } from '../../store/cartStore'
import { useFavoritesStore } from '../../store/favoritesStore'
import { useUiStore } from '../../store/uiStore'
import Button from '../ui/Button'
import CategoryTiles from './CategoryTiles'
import CustomizeDialog from './CustomizeDialog'
import DishRail from './DishRail'
import MenuToolbar from './MenuToolbar'
import { labelFor, NO_FILTERS, type FilterValues } from './categories'

const RECOMMENDED = RECOMMENDED_IDS.map((id) => MENU_ITEMS.find((m) => m.id === id)).filter(
  (m): m is MenuItem => m !== undefined,
)

/**
 * The menu (component-guidelines.md §7–9): the toolbar, "What's on your plate?" tiles, and the
 * dish rail. With nothing filtered the rail shows the chef's recommendations, and one button opens
 * every dish; any search, category or filter shows every matching dish instead.
 */
export default function MenuSection() {
  // Shared with the footer's Menu links (uiStore), like the search text below.
  const category = useUiStore((s) => s.menuCategory)
  const setCategory = useUiStore((s) => s.setMenuCategory)
  // Shared with the navbar search, so typing in either place filters the menu.
  const query = useUiStore((s) => s.menuQuery)
  const setQuery = useUiStore((s) => s.setMenuQuery)
  const [filters, setFilters] = useState<FilterValues>(NO_FILTERS)
  const [showAll, setShowAll] = useState(false)
  const [customizing, setCustomizing] = useState<MenuItem | null>(null)
  const [toast, setToast] = useState('')

  const favouriteIds = useFavoritesStore((s) => s.ids)
  const addLine = useCartStore((s) => s.addLine)
  const sectionRef = useReveal<HTMLElement>()

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  const filtered = isFiltered({ category, query, ...filters })
  const items = useMemo(() => {
    if (!filtered) return showAll ? MENU_ITEMS : RECOMMENDED
    return filterMenu(MENU_ITEMS, { category, query, ...filters, favouriteIds })
  }, [filtered, showAll, category, query, filters, favouriteIds])

  const title = !filtered
    ? showAll
      ? 'All dishes'
      : "Chef's recommendations"
    : query.trim()
      ? 'Search results'
      : category !== 'all'
        ? labelFor(category)
        : 'Your filtered dishes'
  const countText = `${items.length} ${items.length === 1 ? 'dish' : 'dishes'}`

  // The "+ Add" button last pressed: the cart dot flies from there, even after the customise dialog.
  const origin = useRef<HTMLElement | null>(null)

  const confirmLine = (line: Omit<CartLine, 'qty'>) => {
    const item = MENU_ITEMS.find((m) => m.id === line.itemId)
    setToast(`${item?.title ?? 'Item'} added to cart`)
    // With motion, the line joins the cart as the dot lands, so the badge pops on arrival.
    const flight = flyToCart(origin.current)
    if (flight) flight.then(() => addLine(line))
    else addLine(line)
  }

  const handleAdd = (item: MenuItem, from: HTMLElement) => {
    origin.current = from
    if (item.customizable) setCustomizing(item)
    else confirmLine({ itemId: item.id, portionId: 'regular', spice: 'Standard', addons: [] })
  }

  const clearAll = () => {
    setCategory('all')
    setQuery('')
    setFilters(NO_FILTERS)
    setShowAll(false)
  }

  return (
    <>
      <section
        ref={sectionRef}
        id="menu"
        tabIndex={-1}
        aria-label="Menu"
        className="px-4 pb-12 pt-6 outline-none sm:px-6 md:pb-16 lg:px-8 lg:pb-24 lg:pt-8"
      >
        <div className="mx-auto max-w-[77.5rem]">
          <MenuToolbar
            category={category}
            onCategory={setCategory}
            filters={filters}
            onFilters={(next) => setFilters((f) => ({ ...f, ...next }))}
            favouriteCount={favouriteIds.length}
            onClearAll={() => setFilters(NO_FILTERS)}
          />

          <CategoryTiles category={category} onCategory={setCategory} />

          <DishRail
            label="Our menu"
            heading={
              <>
                {title}
                {filtered && ' '}
                {filtered && <span className="tabular ml-1 align-middle text-title font-semibold text-ink-600">({items.length})</span>}
              </>
            }
            listName={`${title}, ${countText}`}
            items={items}
            onAdd={handleAdd}
            empty={
              <div className="rounded-md border border-dashed border-line-200 bg-cream-50 px-6 py-10 text-center">
                <p className="font-display text-title font-semibold">No dishes match.</p>
                <p className="mt-1 text-sm text-ink-600">Try another search, or clear your filters.</p>
                <Button variant="secondary" onClick={clearAll} className="mt-5">
                  Clear filters
                </Button>
              </div>
            }
            footer={
              <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                <p className="text-caption text-ink-600">
                  <span aria-live="polite">
                    {/* The number crossfades when it changes; the live region itself stays put */}
                    <span key={countText} className="motion-fade">
                      Showing {countText}.
                    </span>
                  </span>{' '}
                  Ratings are demo data.
                </p>
                {!filtered && (
                  <Button variant="secondary" onClick={() => setShowAll((v) => !v)}>
                    {showAll ? "Show the chef's picks" : `See all ${MENU_ITEMS.length} dishes`}
                  </Button>
                )}
              </div>
            }
          />
        </div>

        {customizing && (
          <CustomizeDialog
            key={customizing.id}
            item={customizing}
            onClose={() => setCustomizing(null)}
            onConfirm={confirmLine}
          />
        )}
      </section>

      {/* Outside the section: it is fixed to the screen, and the section's content-visibility
          (index.css) would otherwise make the section its containing block. */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        {toast && (
          <span className="motion-toast inline-block rounded-full bg-forest-800 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-lift">
            {toast}
          </span>
        )}
      </div>
    </>
  )
}
