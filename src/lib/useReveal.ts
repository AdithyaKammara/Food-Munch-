import { useRef } from 'react'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from './gsap'
import { MOTION } from './motion'

/**
 * Fades + slides up every element marked `data-reveal` inside the returned ref.
 * Each element animates when IT scrolls into view (things that enter together are staggered),
 * so tall sections on phones don't finish animating before you reach them.
 *
 * Content is only hidden by JavaScript right before it is animated, so if scripts fail
 * everything is simply visible. Reduced motion: nothing moves, everything shows.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const section = ref.current
      if (!section) return

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('[data-reveal]'))
        if (items.length === 0) return

        gsap.set(items, { autoAlpha: 0, y: MOTION.offset })
        ScrollTrigger.batch(items, {
          start: 'top 88%',
          once: true,
          interval: 0.1,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: MOTION.duration,
              ease: MOTION.ease,
              stagger: MOTION.stagger,
              overwrite: true,
              clearProps: 'transform,visibility',
            }),
        })
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return ref
}
