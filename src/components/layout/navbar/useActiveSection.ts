import { useEffect, useRef, useState } from 'react'
import { isRefreshing } from '../../../lib/gsap'

/** True when the page is scrolled to (within a few pixels of) its end. */
function atPageEnd(): boolean {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
}

/**
 * Returns the id of the section currently in the middle of the screen, so the navbar can
 * highlight the matching link while you scroll. This IntersectionObserver approach is the
 * fallback modern-web-guidance: scrollspy prescribes where `scroll-target-group` is unsupported
 * (everywhere but Chromium), so it is used for every browser to keep one source of truth.
 *
 * The last section (the footer) is too short to ever reach the middle band, so it becomes
 * current when the page is scrolled to its end, and gives way again when scrolling back up.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0])
  const lastInBand = useRef(ids[0])

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return
    const lastId = ids[ids.length - 1]

    const observer = new IntersectionObserver(
      (entries) => {
        // ScrollTrigger scrolls the page by itself while it measures; those jumps are not the visitor.
        if (isRefreshing()) return
        const hit = entries.filter((e) => e.isIntersecting).pop()
        if (!hit) return
        lastInBand.current = hit.target.id
        if (!atPageEnd()) setActive(hit.target.id)
      },
      // A thin band across the middle of the screen decides which section is "current".
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))

    let frame = 0
    const onScroll = () => {
      if (frame || isRefreshing()) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setActive(atPageEnd() ? lastId : lastInBand.current)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ids])

  return active
}
