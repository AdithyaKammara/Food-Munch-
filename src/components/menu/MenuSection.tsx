import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import * as Switch from '@radix-ui/react-switch'
import { BicepsFlexed, ChevronDown, Heart, Leaf, Search, X } from 'lucide-react'
import { MENU_ITEMS, type Category, type MenuItem } from '../../data/menu'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'
import { filterMenu, type SortKey } from '../../lib/menuFilters'
import type { CartLine } from '../../lib/pricing'
import { useReveal } from '../../lib/useReveal'
import { useCartStore } from '../../store/cartStore'
import { useFavoritesStore } from '../../store/favoritesStore'
import { useUiStore } from '../../store/uiStore'
import CustomizeDialog from './CustomizeDialog'
import DishCard from './DishCard'

const CATEGORIES: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'starters', label: 'Starters' },
  { id: 'mains', label: 'Mains' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Drinks' },
]

export default function MenuSection() {
  const [category, setCategory] = useState<Category | 'all'>('all')
  // Shared with the navbar search, so typing in either place filters the menu.
  const query = useUiStore((s) => s.menuQuery)
  const setQuery = useUiStore((s) => s.setMenuQuery)
  const [vegOnly, setVegOnly] = useState(false)
  const [highProtein, setHighProtein] = useState(false)
  const [favouritesOnly, setFavouritesOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('default')
  const [customizing, setCustomizing] = useState<MenuItem | null>(null)
  const [toast, setToast] = useState('')

  const favouriteIds = useFavoritesStore((s) => s.ids)
  const addLine = useCartStore((s) => s.addLine)

  const sectionRef = useReveal<HTMLElement>()
  const gridRef = useRef<HTMLDivElement>(null)

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

  // Fade the cards in when a filter changes (but not while typing in search,
  // and not on the first page load).
  const filterKey = `${category}|${vegOnly}|${highProtein}|${favouritesOnly}|${sort}`
  const previousFilterKey = useRef(filterKey)

  useGSAP(
    () => {
      if (previousFilterKey.current === filterKey) return
      previousFilterKey.current = filterKey

      const grid = gridRef.current
      if (!grid) return

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          grid.children,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
            stagger: 0.04,
            overwrite: true,
            // Remove GSAP's inline styles afterwards so card hover effects keep working.
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
    setToast(`${item?.title ?? 'Item'} added to cart`)
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
    <section ref={sectionRef} id="menu" className="px-4 py-20 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="text-center">
          <p className="flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-[0.18em] text-gold-text">
            <span aria-hidden="true" className="h-px w-12 bg-gold-dark/60" />
            Explore menu
            <span aria-hidden="true" className="h-px w-12 bg-gold-dark/60" />
          </p>

          <h2 className="relative mx-auto mt-4 inline-block font-display text-4xl font-extrabold leading-tight tracking-[-0.03em] sm:text-5xl">
            {/* Little gold sparks either side of the heading */}
            <Sparks className="absolute -left-12 -top-1 hidden sm:block" />
            <Sparks className="absolute -right-12 -top-1 hidden -scale-x-100 sm:block" />
            Find Your Next{' '}
            <span className="relative isolate inline-block px-[0.1em]">
              Favourite
              <svg
                aria-hidden="true"
                viewBox="0 0 400 80"
                preserveAspectRatio="none"
                className="absolute -inset-x-[0.04em] bottom-[-0.04em] -z-10 h-[0.9em] w-[calc(100%+0.08em)]"
              >
                <path
                  d="M8 22 C 70 6, 160 14, 250 8 S 370 4, 394 16 C 398 34, 392 52, 386 66 C 300 74, 200 70, 110 76 S 20 74, 6 64 C 2 50, 4 36, 8 22 Z"
                  fill="var(--color-gold)"
                />
              </svg>
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-muted">Made fresh, packed with flavour.</p>
        </div>

        {/* Category pills */}
        <div data-reveal role="group" aria-label="Course" className="-mx-4 mt-8 flex justify-start gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:justify-center sm:px-0">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
              className={`shrink-0 rounded-full border px-6 py-2.5 text-sm font-semibold transition-colors ${
                category === c.id
                  ? 'border-gold bg-gold text-on-gold shadow-[0_6px_14px_rgba(255,191,0,0.35)]'
                  : 'border-[#ead9b6] bg-surface hover:border-gold'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search and filters */}
        <div data-reveal className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
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
              placeholder="Search dishes or ingredients..."
              className="w-full rounded-full border border-[#ead9b6] bg-surface py-3 pl-11 pr-11 text-sm placeholder:text-muted focus:border-gold"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-cream-deep hover:text-ink"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-6">
            <SwitchField
              id="veg-only"
              label="Veg only"
              icon={<Leaf size={16} aria-hidden="true" className="fill-green-600 text-green-700" />}
              checked={vegOnly}
              onChange={setVegOnly}
            />
            <SwitchField
              id="high-protein"
              label="High protein (20g+)"
              icon={<BicepsFlexed size={16} aria-hidden="true" />}
              checked={highProtein}
              onChange={setHighProtein}
            />
            <button
              type="button"
              aria-pressed={favouritesOnly}
              onClick={() => setFavouritesOnly(!favouritesOnly)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                favouritesOnly ? 'border-red-600 bg-red-50 text-red-700' : 'border-[#ead9b6] bg-surface hover:border-gold'
              }`}
            >
              <Heart size={16} aria-hidden="true" fill={favouritesOnly ? 'currentColor' : 'none'} />
              Favourites ({favouriteIds.length})
            </button>
            <div className="flex items-center gap-2 text-sm">
              <label htmlFor="menu-sort" className="text-muted">
                Sort:
              </label>
              <span className="relative">
              <select
                id="menu-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none rounded-full border border-[#ead9b6] bg-surface py-2 pl-4 pr-10 font-medium hover:border-gold"
              >
                <option value="default">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: High to Low</option>
                <option value="protein-desc">Protein: High to Low</option>
                <option value="prep-asc">Fastest prep</option>
              </select>
              <ChevronDown
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
              />
              </span>
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm text-muted" aria-live="polite">
          Showing {items.length} {items.length === 1 ? 'dish' : 'dishes'}
        </p>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="font-semibold">No dishes match your filters.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-full bg-gold px-5 py-2 text-sm font-bold text-on-gold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div ref={gridRef} className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {items.map((item) => (
              <DishCard key={item.id} item={item} onAdd={handleAdd} />
            ))}
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

      <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        {toast && (
          <span className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-card-hover">
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
  icon,
  checked,
  onChange,
}: {
  id: string
  label: string
  icon?: ReactNode
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="relative h-6 w-11 rounded-full bg-[#ddd2bd] transition-colors data-[state=checked]:bg-gold"
      >
        <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
      <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold">
        {icon}
        {label}
      </label>
    </div>
  )
}

/** Three small gold strokes that "burst" out beside the heading. */
function Sparks({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={`h-9 w-9 text-gold ${className}`}>
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        <line x1="30" y1="22" x2="18" y2="6" />
        <line x1="30" y1="30" x2="8" y2="24" />
      </g>
    </svg>
  )
}
