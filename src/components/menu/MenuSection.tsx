import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [query, setQuery] = useState('')
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
    <section ref={sectionRef} id="menu" className="scroll-mt-20 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div data-reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-text">Explore menu</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Our Popular Dishes</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Discover a wide range of delicious food items made with love.
          </p>
        </div>

        {/* Category pills */}
        <div data-reveal className="mt-8 flex justify-start gap-2 overflow-x-auto pb-2 sm:justify-center">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
              className={`shrink-0 rounded-full border px-5 py-2 text-sm font-semibold ${
                category === c.id
                  ? 'border-gold bg-gold text-on-gold'
                  : 'border-line bg-surface hover:border-gold'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search and filters */}
        <div data-reveal className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
              placeholder="Search dishes or ingredients..."
              className="w-full rounded-full border border-line bg-surface py-2.5 pl-11 pr-4 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <SwitchField id="veg-only" label="Veg only" checked={vegOnly} onChange={setVegOnly} />
            <SwitchField
              id="high-protein"
              label="High protein (20g+)"
              checked={highProtein}
              onChange={setHighProtein}
            />
            <button
              type="button"
              aria-pressed={favouritesOnly}
              onClick={() => setFavouritesOnly(!favouritesOnly)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${
                favouritesOnly ? 'border-red-600 bg-red-50 text-red-700' : 'border-line bg-surface'
              }`}
            >
              <Heart size={16} aria-hidden="true" fill={favouritesOnly ? 'currentColor' : 'none'} />
              Favourites ({favouriteIds.length})
            </button>
            <div className="flex items-center gap-2 text-sm">
              <label htmlFor="menu-sort" className="text-muted">
                Sort
              </label>
              <select
                id="menu-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full border border-line bg-surface px-3 py-1.5"
              >
                <option value="default">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: High to Low</option>
                <option value="protein-desc">Protein: High to Low</option>
                <option value="prep-asc">Fastest prep</option>
              </select>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted" aria-live="polite">
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
          <div ref={gridRef} className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="relative h-6 w-11 rounded-full bg-line data-[state=checked]:bg-gold"
      >
        <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
      <label htmlFor={id} className="cursor-pointer text-sm font-semibold">
        {label}
      </label>
    </div>
  )
}