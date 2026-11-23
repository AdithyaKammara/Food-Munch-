import { useEffect, useLayoutEffect, useRef, type KeyboardEvent } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { clsx } from 'clsx'
import { gsap, MOTION_OK } from '../../lib/gsap'
import { MOTION } from '../../lib/motion'
import { useUiStore } from '../../store/uiStore'
import FilterPanel from './FilterPanel'
import { PILLS, type CategoryChoice, type FilterValues } from './categories'

interface Props {
  category: CategoryChoice
  onCategory: (id: CategoryChoice) => void
  filters: FilterValues
  onFilters: (next: Partial<FilterValues>) => void
  favouriteCount: number
  onClearAll: () => void
}

const PANEL_ID = 'menu-filters'

// Shared by the real pills and their copper copy, so both rows have identical metrics.
const PILL = 'h-11 min-w-11 shrink-0 rounded-full border px-4 text-[0.9375rem] font-semibold'

/**
 * The menu toolbar (component-guidelines.md §7). From `lg` it is one white pill bar: search,
 * the category pills, and the Filter button. Below that, the search sits on its own row and the
 * pills become a scrolling strip with Filter at the end; on phones the whole toolbar sticks under
 * the navbar.
 *
 * It is not a `role="toolbar"`: it holds a text field, where arrow keys must move the caret.
 * The pills are a radio group instead (one tab stop, arrow keys choose).
 */
export default function MenuToolbar({ category, onCategory, filters, onFilters, favouriteCount, onClearAll }: Props) {
  const query = useUiStore((s) => s.menuQuery)
  const setQuery = useUiStore((s) => s.setMenuQuery)
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([])
  const strip = useRef<HTMLDivElement>(null)
  const group = useRef<HTMLDivElement>(null)
  const highlight = useRef<HTMLDivElement>(null)
  const placedOnce = useRef(false)
  const filtersOn = filters.vegOnly || filters.highProtein || filters.favouritesOnly || filters.sort !== 'default'

  // Keep the chosen pill in view when the strip scrolls sideways (phones), without scrolling the page.
  useEffect(() => {
    const pill = pillRefs.current[PILLS.findIndex((p) => p.id === category)]
    const track = strip.current
    if (!pill || !track || track.scrollWidth <= track.clientWidth) return
    const left = pill.offsetLeft - track.clientWidth / 2 + pill.offsetWidth / 2
    track.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }, [category])

  // The chosen pill's copper fill slides between pills (animation-guidelines.md §10). A copper copy
  // of the row sits on top and a clip-path window shows only the chosen pill, so the white label is
  // never seen on cream mid-move. Same technique as the navbar pill.
  useLayoutEffect(() => {
    const box = group.current
    const layer = highlight.current
    if (!box || !layer) return
    const place = (animate: boolean) => {
      const pill = pillRefs.current[PILLS.findIndex((p) => p.id === category)]
      if (!pill) return
      const b = box.getBoundingClientRect()
      const r = pill.getBoundingClientRect()
      const clipPath = `inset(${r.top - b.top}px ${b.right - r.right}px ${b.bottom - r.bottom}px ${r.left - b.left}px round 9999px)`
      if (animate && matchMedia(MOTION_OK).matches) {
        gsap.to(layer, { clipPath, duration: MOTION.base, ease: MOTION.easeInOut, overwrite: true })
      } else {
        gsap.set(layer, { clipPath, overwrite: true })
      }
    }
    // The first placement waits for the frame after first paint, so it shares one layout with the
    // other measurements instead of forcing its own during React's commit (Phase 9 profile).
    let firstFrame = 0
    if (placedOnce.current) place(true)
    else firstFrame = requestAnimationFrame(() => place(false))
    placedOnce.current = true
    // A ResizeObserver reports once as soon as it starts observing; skip that call, or it would
    // snap the highlight into place and cancel the slide that just started.
    let initial = true
    const observer = new ResizeObserver(() => {
      if (initial) {
        initial = false
        return
      }
      place(false)
    })
    observer.observe(box)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(firstFrame)
    }
  }, [category])

  const onPillKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const current = PILLS.findIndex((p) => p.id === category)
    const last = PILLS.length - 1
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? current === last ? 0 : current + 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? current === 0 ? last : current - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : -1
    if (next < 0) return
    e.preventDefault()
    onCategory(PILLS[next].id)
    pillRefs.current[next]?.focus()
  }

  return (
    <div
      data-reveal
      className="max-md:sticky max-md:top-[4.5rem] max-md:z-30 max-md:-mx-4 max-md:bg-cream-200/95 max-md:px-4 max-md:py-2 max-md:backdrop-blur-sm"
    >
      <div className="lg:flex lg:items-center lg:gap-2 lg:rounded-full lg:bg-cream-50 lg:p-1.5 lg:shadow-card">
        {/* Search */}
        <div className="relative lg:w-72 lg:shrink-0 xl:w-80">
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-600"
          />
          <input
            id="menu-search"
            type="search"
            aria-label="Search dishes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search biryani, kebabs, desserts…"
            enterKeyHint="search"
            className="h-12 w-full rounded-full border border-field-500 bg-cream-50 pl-11 pr-11 text-[0.9375rem] placeholder:text-ink-600 focus:border-copper-600 max-lg:shadow-card lg:h-11 lg:border-transparent lg:bg-cream-100 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-ink-600 hover:bg-cream-300 hover:text-ink-900"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        <Divider />

        {/* Category pills, then Filter */}
        <div
          ref={strip}
          className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] max-lg:mt-2 md:mx-0 md:px-0 lg:min-w-0 lg:flex-1 lg:py-0"
        >
          <div
            ref={group}
            role="radiogroup"
            aria-label="Category"
            onKeyDown={onPillKey}
            className="relative flex shrink-0 items-center gap-1.5"
          >
            {PILLS.map((pill, i) => {
              const on = category === pill.id
              return (
                <button
                  key={pill.id}
                  ref={(el) => {
                    pillRefs.current[i] = el
                  }}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => onCategory(pill.id)}
                  className={clsx(
                    PILL,
                    'border-line-200 bg-cream-50 text-ink-900 transition-colors duration-150 hover:border-copper-600 lg:border-transparent lg:hover:bg-cream-300',
                  )}
                >
                  {pill.label}
                </button>
              )
            })}
            {/* The copper copy, clipped to the chosen pill. Decorative: the radios above carry the state. */}
            <div
              ref={highlight}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center gap-1.5"
            >
              {PILLS.map((pill) => (
                <span key={pill.id} className={clsx(PILL, 'grid place-items-center border-copper-600 bg-copper-600 text-white')}>
                  {pill.label}
                </span>
              ))}
            </div>
          </div>

          <span aria-hidden="true" className="h-7 w-px shrink-0 bg-line-200 max-lg:hidden lg:ml-auto" />

          <button
            type="button"
            popoverTarget={PANEL_ID}
            className="filter-trigger relative inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-line-200 bg-cream-50 px-4 text-[0.9375rem] font-semibold text-ink-900 transition-colors duration-150 hover:border-copper-600 lg:border-transparent lg:hover:bg-cream-300"
          >
            <SlidersHorizontal size={18} aria-hidden="true" />
            Filter
            {filtersOn && (
              <>
                <span aria-hidden="true" className="absolute right-2.5 top-2 size-2 rounded-full bg-copper-600" />
                <span className="sr-only">(filters on)</span>
              </>
            )}
          </button>
        </div>
      </div>

      <FilterPanel
        id={PANEL_ID}
        values={filters}
        onChange={onFilters}
        favouriteCount={favouriteCount}
        onClearAll={onClearAll}
      />
    </div>
  )
}

function Divider() {
  return <span aria-hidden="true" className="h-7 w-px shrink-0 bg-line-200 max-lg:hidden" />
}
