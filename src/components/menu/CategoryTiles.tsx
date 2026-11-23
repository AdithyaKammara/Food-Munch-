import { useLayoutEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { gsap, MOTION_OK } from '../../lib/gsap'
import { MOTION } from '../../lib/motion'
import Flourish from '../brand/Flourish'
import { CATEGORIES, type CategoryChoice } from './categories'

interface Props {
  category: CategoryChoice
  onCategory: (id: CategoryChoice) => void
}

/**
 * "What's on your plate?" (component-guidelines.md §8): five photo tiles that set the same
 * category as the toolbar pills. Pressing the chosen tile again goes back to All.
 * Five columns from `lg`; a sideways snap strip of 112px tiles below that.
 *
 * Motion (animation-guidelines.md §5, §6, §10): one cream-and-copper highlight slides to the
 * chosen tile, each photo opens with a clip-path reveal, and on hover the plate turns a little.
 */
export default function CategoryTiles({ category, onCategory }: Props) {
  const list = useRef<HTMLUListElement>(null)
  const highlight = useRef<HTMLLIElement>(null)
  const placedOnce = useRef(false)

  useLayoutEffect(() => {
    const ul = list.current
    const box = highlight.current
    if (!ul || !box) return
    const place = (animate: boolean) => {
      const tile = ul.querySelector<HTMLElement>(`[data-tile="${category}"]`)
      const motion = animate && matchMedia(MOTION_OK).matches
      if (!tile) {
        // "All": no tile is chosen, so the highlight fades where it is.
        gsap.to(box, { autoAlpha: 0, duration: motion ? MOTION.quick : 0, overwrite: true })
        return
      }
      const to = { x: tile.offsetLeft, y: tile.offsetTop, width: tile.offsetWidth, height: tile.offsetHeight, autoAlpha: 1 }
      const hidden = getComputedStyle(box).visibility === 'hidden'
      if (motion && !hidden) {
        gsap.to(box, { ...to, duration: MOTION.base, ease: MOTION.easeInOut, overwrite: true })
      } else {
        gsap.set(box, to)
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
    observer.observe(ul)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(firstFrame)
    }
  }, [category])

  return (
    <div className="mt-10 sm:mt-14 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-center lg:gap-8">
      <div data-reveal>
        <h2 id="plate-heading" className="font-display text-display-md font-bold text-ink-900 lg:text-[2rem] lg:leading-[1.1]">
          What&apos;s on your plate?
        </h2>
        <Flourish className="mt-1 hidden h-3 w-24 lg:block" />
      </div>

      <ul
        ref={list}
        aria-labelledby="plate-heading"
        className="relative -mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:mt-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:p-0"
      >
        {/* The sliding highlight. Hidden from assistive technology: each tile's aria-pressed carries the state. */}
        <li
          ref={highlight}
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 rounded-md border-[1.5px] border-copper-500 bg-cream-300"
        />
        {CATEGORIES.map((c) => {
          const on = category === c.id
          return (
            <li key={c.id} className="w-28 shrink-0 snap-start lg:w-auto">
              <button
                type="button"
                data-tile={c.id}
                aria-pressed={on}
                onClick={() => onCategory(on ? 'all' : c.id)}
                className={clsx(
                  'group relative flex w-full flex-col items-center gap-2 rounded-md border-[1.5px] px-2 pb-3 pt-3 transition-colors duration-150 lg:gap-3 lg:pb-4 lg:pt-4',
                  // The chosen tile is see-through, so the highlight behind it shows.
                  on ? 'border-transparent bg-transparent' : 'border-transparent bg-cream-100 hover:border-line-200 hover:bg-cream-50',
                )}
              >
                <span
                  data-reveal="image"
                  className="block size-20 overflow-hidden rounded-full bg-cream-300 shadow-card ring-4 ring-cream-50 lg:size-24 xl:size-28"
                >
                  <img
                    src={c.image}
                    alt=""
                    width={112}
                    height={112}
                    loading="lazy"
                    className="img-fade size-full object-cover motion-safe:transition-[scale,rotate,opacity] motion-safe:duration-[400ms] motion-safe:ease-out motion-safe:group-hover:rotate-[4deg] motion-safe:group-hover:scale-105"
                    ref={(el) => {
                      if (el?.complete) el.dataset.loaded = ''
                    }}
                    onLoad={(e) => {
                      e.currentTarget.dataset.loaded = ''
                    }}
                  />
                </span>
                <span className="font-display text-[1.0625rem] font-semibold text-ink-900 lg:text-lg">{c.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
