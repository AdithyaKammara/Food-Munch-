import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'
import type { MenuItem } from '../../data/menu'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'
import { MOTION } from '../../lib/motion'
import { buttonClasses } from '../ui/buttonClasses'
import DishCard from './DishCard'

interface Props {
  label?: string
  heading: ReactNode
  /** Plain-text name for the scrolling list. */
  listName: string
  items: MenuItem[]
  onAdd: (item: MenuItem, origin: HTMLElement) => void
  empty: ReactNode
  footer?: ReactNode
}

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * A sideways list of dish cards (component-guidelines.md §9; modern-web-guidance: carousel).
 * The track is a native scroller with snap points, so touch, trackpad and keyboard scrolling
 * work without script (a focused track scrolls one card per arrow key). Script only adds the
 * previous and next buttons, their end states and a status message after scrolling settles.
 */
export default function DishRail({ label, heading, listName, items, onAdd, empty, footer }: Props) {
  const track = useRef<HTMLUListElement>(null)
  const prevBtn = useRef<HTMLButtonElement>(null)
  const nextBtn = useRef<HTMLButtonElement>(null)
  const pending = useRef<number | null>(null)
  const settledFirst = useRef(0)
  const [edges, setEdges] = useState({ start: true, end: true })
  // The status belongs to one set of results, so a new search starts with it silent.
  const [status, setStatus] = useState({ key: '', text: '' })
  const itemsKey = items.map((m) => m.id).join(',')

  const cards = () => Array.from(track.current?.children ?? []) as HTMLElement[]

  /** Index of the first card whose left edge is in view. */
  const firstVisible = useCallback(() => {
    const el = track.current
    if (!el) return 0
    const left = el.scrollLeft
    const i = cards().findIndex((c) => c.offsetLeft - el.offsetLeft >= left - 4)
    return i < 0 ? 0 : i
  }, [])

  const visibleCount = useCallback(() => {
    const el = track.current
    const first = cards()[0]
    if (!el || !first) return 1
    return Math.max(1, Math.floor((el.clientWidth + 8) / first.getBoundingClientRect().width))
  }, [])

  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    const start = el.scrollLeft <= 2
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }))
    // A button that just became disabled loses focus, so hand focus to the other one.
    if (start && document.activeElement === prevBtn.current && !end) nextBtn.current?.focus()
    if (end && document.activeElement === nextBtn.current && !start) prevBtn.current?.focus()
  }, [])

  const settle = useCallback(() => {
    pending.current = null
    measure()
    const first = firstVisible()
    if (first === settledFirst.current) return
    settledFirst.current = first
    const total = cards().length
    const last = Math.min(total, first + visibleCount())
    // The key is read from the cards on screen, the same ids `itemsKey` is built from.
    const key = cards().map((li) => li.querySelector<HTMLElement>('[data-id]')?.dataset.id).join(',')
    setStatus({ key, text: `Showing dishes ${first + 1} to ${last} of ${total}` })
  }, [firstVisible, measure, visibleCount])

  // Edge state follows scrolling live (once per frame); the status waits until scrolling settles.
  // The track is removed while there are no results, so listeners re-attach when it returns.
  const hasItems = items.length > 0
  useEffect(() => {
    const el = track.current
    if (!el) return
    let frame = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    const hasScrollEnd = 'onscrollend' in window
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), measure()))
      // Older browsers without `scrollend`: settle after a short pause in scrolling instead.
      if (!hasScrollEnd) {
        clearTimeout(timer)
        timer = setTimeout(settle, 120)
      }
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('scrollend', settle)
    const resize = new ResizeObserver(measure)
    resize.observe(el)
    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('scrollend', settle)
      resize.disconnect()
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [hasItems, measure, settle])

  // New results start from the first card.
  useLayoutEffect(() => {
    track.current?.scrollTo?.({ left: 0, behavior: 'instant' })
    settledFirst.current = 0
    pending.current = null
    // Measured on the next frame, not during React's commit, so it never forces an extra layout.
    const frame = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(frame)
  }, [itemsKey, measure])

  // Cards that were not showing before fade in; cards that stay are left alone.
  const shownIds = useRef<Set<number> | null>(null)
  useGSAP(
    () => {
      const ids = new Set(items.map((m) => m.id))
      const before = shownIds.current
      shownIds.current = ids
      const el = track.current
      if (!el || !before) return
      const entering = Array.from(el.querySelectorAll<HTMLElement>('[data-id]')).filter(
        (c) => !before.has(Number(c.dataset.id)),
      )
      if (entering.length === 0) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          entering.slice(0, 6),
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: MOTION.base, ease: MOTION.ease, stagger: MOTION.stagger, clearProps: 'all' },
        )
      })
      return () => mm.revert()
    },
    { dependencies: [itemsKey] },
  )

  /** Scrolls one card along; quick repeat presses build on the card already being scrolled to. */
  const step = (dir: 1 | -1) => {
    const el = track.current
    const list = cards()
    if (!el || list.length === 0) return
    const from = pending.current ?? firstVisible()
    const target = Math.min(Math.max(from + dir, 0), list.length - 1)
    pending.current = target
    el.scrollTo({ left: list[target].offsetLeft - el.offsetLeft, behavior: reduceMotion() ? 'instant' : 'smooth' })
  }

  const scrollable = !(edges.start && edges.end)

  return (
    <div data-reveal className="mt-12 sm:mt-16">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {label && (
            <p className="flex items-center gap-3 text-label font-semibold uppercase text-copper-700">
              {label}
              <span data-rule aria-hidden="true" className="h-px w-8 bg-copper-500" />
            </p>
          )}
          <h2 id="rail-heading" className={clsx('font-display text-display-lg font-bold text-ink-900', label && 'mt-3')}>
            {heading}
          </h2>
        </div>

        {items.length > 0 && scrollable && (
          <div className="flex shrink-0 gap-2 max-sm:hidden">
            <button
              ref={prevBtn}
              type="button"
              aria-label="Previous dishes"
              aria-controls="dish-rail"
              disabled={edges.start}
              onClick={() => step(-1)}
              className={buttonClasses('quiet', 'md', 'touch-manipulation disabled:opacity-40')}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              ref={nextBtn}
              type="button"
              aria-label="Next dishes"
              aria-controls="dish-rail"
              disabled={edges.end}
              onClick={() => step(1)}
              className="grid size-11 touch-manipulation place-items-center rounded-full bg-copper-600 text-white transition-[background-color,scale] duration-150 hover:bg-copper-700 motion-safe:active:scale-94 active:bg-copper-800 disabled:pointer-events-none disabled:bg-cream-50 disabled:text-ink-900 disabled:opacity-40 disabled:ring-1 disabled:ring-line-200"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-6">{empty}</div>
      ) : (
        <div className="dish-rail-frame mt-6">
          <ul
            ref={track}
            id="dish-rail"
            tabIndex={0}
            aria-label={listName}
            className="dish-rail -my-3 px-0.5 py-3"
          >
            {items.map((item) => (
              <li key={item.id}>
                <DishCard item={item} onAdd={onAdd} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <p role="status" className="sr-only">
        {status.key === itemsKey ? status.text : ''}
      </p>
      {footer}
    </div>
  )
}
