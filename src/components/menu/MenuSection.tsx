import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import * as Switch from '@radix-ui/react-switch'
import { Heart, Search } from 'lucide-react'
import { MENU_ITEMS, type Category, type MenuItem } from '../../data/menu'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'
import { filterMenu, type SortKey } from '../../lib/menuFilters'
import type { CartLine } from '../../lib/pricing'
import { useReveal } from '../../lib/useReveal'
import { useCartStore } from '../../store/cartStore'
import { useFavoritesStore } from '../../store/favoritesStore'
import CustomizeDialog from './CustomizeDialog'
import DishRow, { DishSpotlight } from './DishCard'

const CATEGORIES: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'starters', label: 'Starters' },
  { id: 'mains', label: 'Mains' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Drinks' },
]

const CATEGORY_TITLES: Record<Category, string> = {
  starters: 'Starters',
  mains: 'Mains',
  desserts: 'Desserts',
  drinks: 'Drinks',
}

export default function MenuSection() {
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [query, setQuery] = useState('')
  const [vegOnly, setVegOnly] = useState(false)
  const [highProtein, setHighProtein] = useState(false)
  const [favouritesOnly, setFavouritesOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('default')
  const [customizing, setCustomizing] = useState<MenuItem | null>(null)
  const [toast, setToast] = useState('')
  const [shownId, setShownId] = useState<number | null>(null)

  const favouriteIds = useFavoritesStore((s) => s.ids)
  const addLine = useCartStore((s) => s.addLine)

  const sectionRef = useReveal<HTMLElement>()
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  const items = useMemo(
    () =>
      filterMenu(MENU_ITEMS, { category, query, vegOnly, highProtein, favouritesOnly, favouriteIds, sort }),
    [category, query, vegOnly, highProtein, favouritesOnly, favouriteIds, sort],
  )

  // The big photo shows the dish you last pointed at, or the first dish in the list.
  const shown = items.find((m) => m.id === shownId) ?? items[0] ?? null

  // Group by course only in the natural order; a sorted list stays one list.
  const grouped = sort === 'default' && category === 'all'
  const groups = grouped
    ? (Object.keys(CATEGORY_TITLES) as Category[])
        .map((c) => ({ id: c, items: items.filter((m) => m.category === c) }))
        .filter((g) => g.items.length > 0)
    : [{ id: null, items }]

  // Fade the rows in when a filter changes (not while typing, not on first load).
  const filterKey = `${category}|${vegOnly}|${highProtein}|${favouritesOnly}|${sort}`
  const previousFilterKey = useRef(filterKey)

  useGSAP(
    () => {
      if (previousFilterKey.current === filterKey) return
      previousFilterKey.current = filterKey
      const list = listRef.current
      if (!list) return

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          list.querySelectorAll('article, [data-group-title]'),
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.035,
            overwrite: true,
            clearProps: 'transform,opacity,visibility',
          },
        )
      })
      return () => mm.revert()
    },
    { dependencies: [filterKey], revertOnUpdate: true },
  )

  const confirmLine = (line: Omit<CartLine, 'qty'>) => {
    addLine(line)
    const item = MENU_ITEMS.find((m) => m.id === line.itemId)
    setToast(`${item?.title ?? 'Item'} added to your bag`)
  }

  const handleAdd = (item: MenuItem) => {
    if (item.customizable) {
      setCustomizing(item)
    } else {
      confirmLine({ itemId: item.id, portionId: 'regular', spice: 'Standard', addons: [] })
    }
  }

  const clearFilters = () => {
    setCategory('all')
    setQuery('')
    setVegOnly(false)
    setHighProtein(false)
    setFavouritesOnly(false)
    setSort('default')
  }

  return (
    <section ref={sectionRef} id="menu" className="scroll-mt-16 py-20 md:py-36">
      <div className="frame">
        {/* Title */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 data-reveal className="display text-[clamp(3rem,9vw,8rem)] lg:col-span-7">
            The menu
          </h2>
          <p data-reveal className="max-w-md text-lg leading-relaxed lg:col-span-5 lg:pb-3">
            Twelve dishes, cooked to order. Pick a portion and spice level where it applies; 5% GST
            is added at checkout.
          </p>
        </div>

        {/* Controls */}
        <div data-reveal className="mt-12 flex flex-col gap-5 md:mt-16">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="group"
              aria-label="Course"
              className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1"
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors ${
                    category === c.id ? 'bg-ink text-white' : 'hover:bg-cream-deep'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-sm">
              <label htmlFor="menu-search" className="sr-only">
                Search dishes
              </label>
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="menu-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes or ingredients"
                className="w-full rounded-full bg-cream-deep py-3 pl-11 pr-4 text-[15px] placeholder:text-muted focus:bg-surface"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <SwitchField id="veg-only" label="Veg only" checked={vegOnly} onChange={setVegOnly} />
            <SwitchField
              id="high-protein"
              label="High protein (20 g+)"
              checked={highProtein}
              onChange={setHighProtein}
            />
            <button
              type="button"
              aria-pressed={favouritesOnly}
              onClick={() => setFavouritesOnly(!favouritesOnly)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
                favouritesOnly ? 'bg-red-50 text-red-700' : 'hover:bg-cream-deep'
              }`}
            >
              <Heart size={16} aria-hidden="true" fill={favouritesOnly ? 'currentColor' : 'none'} />
              Favourites ({favouriteIds.length})
            </button>
            <div className="flex items-center gap-2 text-[15px]">
              <label htmlFor="menu-sort" className="text-muted">
                Sort by
              </label>
              <select
                id="menu-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full bg-cream-deep px-4 py-2 font-semibold"
              >
                <option value="default">Recommended</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating-desc">Rating: high to low</option>
                <option value="protein-desc">Protein: high to low</option>
                <option value="prep-asc">Fastest to prepare</option>
              </select>
            </div>
            <p className="text-[15px] text-muted lg:ml-auto" aria-live="polite">
              Showing {items.length} {items.length === 1 ? 'dish' : 'dishes'}
            </p>
          </div>
        </div>

        {/* Board */}
        {items.length === 0 ? (
          <div className="mt-12 bg-cream-deep px-6 py-16 text-center">
            <p className="text-xl font-semibold">No dishes match your filters.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-full bg-ink px-6 py-3 font-bold text-white"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div ref={listRef} className="lg:col-span-7">
              {groups.map((group) => (
                <Fragment key={group.id ?? 'all'}>
                  {group.id && (
                    <h3
                      data-group-title
                      className="mb-1 mt-10 flex items-baseline gap-3 font-display text-3xl font-extrabold tracking-tight first:mt-0"
                    >
                      {CATEGORY_TITLES[group.id]}
                      <span className="text-base font-semibold text-muted">
                        {group.items.length}
                      </span>
                    </h3>
                  )}
                  {group.items.map((item) => (
                    <DishRow
                      key={item.id}
                      item={item}
                      active={shown?.id === item.id}
                      onAdd={handleAdd}
                      onShow={(m) => setShownId(m.id)}
                    />
                  ))}
                </Fragment>
              ))}
            </div>

            {shown && (
              <aside aria-label="Selected dish" className="hidden lg:col-span-5 lg:block">
                <div className="sticky top-24">
                  <DishSpotlight item={shown} onAdd={handleAdd} />
                </div>
              </aside>
            )}
          </div>
        )}
      </div>

      {customizing && (
        <CustomizeDialog
          key={customizing.id}
          item={customizing}
          onClose={() => setCustomizing(null)}
          onConfirm={confirmLine}
        />
      )}

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      >
        {toast && (
          <span className="block rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-white shadow-card-hover">
            {toast}
          </span>
        )}
      </div>
    </section>
  )
}

function SwitchField({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="relative h-7 w-12 rounded-full bg-track transition-colors data-[state=checked]:bg-ink"
      >
        <Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
      <label htmlFor={id} className="cursor-pointer text-[15px] font-semibold">
        {label}
      </label>
    </div>
  )
}
