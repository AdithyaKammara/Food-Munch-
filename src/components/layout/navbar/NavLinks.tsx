import { useLayoutEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { gsap, MOTION_OK } from '../../../lib/gsap'
import { MOTION } from '../../../lib/motion'
import { NAV_LINKS } from './links'

/**
 * Desktop section links. The active link sits in a gold pill that slides between links
 * (animation-guidelines.md §9). The pill is one layer shaped with clip-path, so moving it never
 * changes layout, and its rounded ends stay round at every width.
 *
 * The active state is also bold text and aria-current, so it never relies on colour alone
 * (modern-web-guidance: scrollspy, navbar).
 */
export default function NavLinks({ active }: { active: string }) {
  const listRef = useRef<HTMLUListElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const placedOnce = useRef(false)

  useLayoutEffect(() => {
    const list = listRef.current
    const pill = pillRef.current
    if (!list || !pill) return

    const place = (animate: boolean) => {
      // Hidden below lg (the phone menu takes over): measuring would force a page layout on every
      // section change for nothing (Phase 9 profile: 7.6s on a slow phone). A media query costs
      // no layout. The ResizeObserver places the pill when the nav appears.
      if (!window.matchMedia('(min-width: 1024px)').matches) return
      const link = list.querySelector<HTMLElement>(`a[href="#${active}"]`)
      if (!link) {
        gsap.to(pill, { autoAlpha: 0, duration: MOTION.quick, overwrite: true })
        return
      }
      const box = list.getBoundingClientRect()
      const r = link.getBoundingClientRect()
      const clipPath = `inset(${r.top - box.top}px ${box.right - r.right}px ${box.bottom - r.bottom}px ${r.left - box.left}px round 9999px)`
      if (animate && window.matchMedia(MOTION_OK).matches) {
        gsap.to(pill, { clipPath, autoAlpha: 1, duration: MOTION.base, ease: MOTION.easeInOut, overwrite: true })
      } else {
        gsap.set(pill, { clipPath, autoAlpha: 1, overwrite: true })
      }
    }

    place(placedOnce.current)
    placedOnce.current = true

    // Fonts loading or text resizing moves the links: re-place the pill without animating.
    // A ResizeObserver reports once as soon as it starts observing; skip that call, or it would
    // snap the highlight into place and cancel the slide that just started.
    let initial = true
    let frame = 0
    const observer = new ResizeObserver(() => {
      if (initial) {
        initial = false
        return
      }
      // At most one measurement per frame, read alongside the browser's own layout work.
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => place(false))
    })
    observer.observe(list)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [active])

  return (
    <ul ref={listRef} className="relative flex items-center gap-1">
      <span ref={pillRef} aria-hidden="true" className="invisible absolute inset-0 bg-gold-300" />
      {NAV_LINKS.map(({ id, label }) => {
        const isActive = active === id
        return (
          <li key={id} className="relative">
            <a
              href={`#${id}`}
              aria-current={isActive ? 'true' : undefined}
              className={clsx(
                'flex h-11 items-center whitespace-nowrap rounded-full px-4 text-[15px] transition-colors duration-150',
                isActive ? 'font-semibold text-ink-900' : 'font-medium text-cream-50/90 hover:text-gold-300',
              )}
            >
              {label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
