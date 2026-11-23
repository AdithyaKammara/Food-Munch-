import { useRef } from 'react'
import { gsap, MOTION_OK, useGSAP } from './gsap'

/** Removes the reveal classes once an element has arrived, so nothing lingers on it. */
function settle(el: HTMLElement) {
  el.classList.remove('reveal-hide', 'reveal-clip', 'reveal-in')
  el.style.removeProperty('--reveal-i')
}

/**
 * Scroll reveals (animation-guidelines.md §5) for every `data-reveal` inside the returned ref:
 * plain elements fade up 20px; `data-reveal="image"` opens with a clip-path from the bottom while
 * its picture settles from 1.04; a label's `data-rule` draws in. Siblings stagger by 70ms, up to six.
 *
 * The motion itself is CSS transitions on classes (`.reveal-*` in index.css). An IntersectionObserver
 * only adds a class when an element arrives. An earlier version set and tweened every element with
 * GSAP, which read computed styles one by one while the page was loading (Phase 9 profile:
 * about 2.8s on a slow phone).
 *
 * Elements already on screen are left alone; with scripting off, or under reduced motion, nothing
 * is hidden. Pass `media` to limit reveals to a narrower media query than the default.
 */
export function useReveal<T extends HTMLElement>(media: string = MOTION_OK) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const section = ref.current
      if (!section) return

      const mm = gsap.matchMedia()
      mm.add(media, () => {
        // Set up on the frame after first paint: the positions are read in the same layout as the
        // rest of the page's measurements, instead of forcing one more during React's commit.
        let teardown: (() => void) | undefined
        const frame = requestAnimationFrame(() => {
          teardown = arm()
        })
        return () => {
          cancelAnimationFrame(frame)
          teardown?.()
        }
      })

      function arm(): (() => void) | undefined {
        const all = Array.from(section!.querySelectorAll<HTMLElement>('[data-reveal]'))
        // Read every position first, in one layout, then write the classes.
        const line = window.innerHeight * 0.88
        const pending = all.filter((el) => el.getBoundingClientRect().top >= line)
        if (pending.length === 0) return

        pending.forEach((el) => el.classList.add(el.dataset.reveal === 'image' ? 'reveal-clip' : 'reveal-hide'))
        const timers: number[] = []
        // An IntersectionObserver, not ScrollTrigger: it runs off the main path, never forces a
        // layout and takes no part in ScrollTrigger's refreshes (Phase 9: one trigger per revealed
        // element made each refresh thrash layout on slow phones).
        const observer = new IntersectionObserver(
          (entries) => {
            const arrived = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement)
            arrived.forEach((el, i) => {
              observer.unobserve(el)
              const step = Math.min(i, 5)
              el.style.setProperty('--reveal-i', String(step))
              el.classList.add('reveal-in')
              timers.push(window.setTimeout(() => settle(el), 900 + step * 70))
            })
          },
          // Fires as an element's top passes 88% of the viewport height.
          { rootMargin: '0px 0px -12% 0px' },
        )
        pending.forEach((el) => observer.observe(el))

        return () => {
          observer.disconnect()
          timers.forEach((t) => window.clearTimeout(t))
          pending.forEach(settle)
        }
      }

      return () => mm.revert()
    },
    { scope: ref },
  )

  return ref
}
