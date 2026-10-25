import { useRef } from 'react'
import { gsap, MOTION_OK, useGSAP } from './gsap'

/**
 * Fades + slides up every element marked `data-reveal` inside the returned ref,
 * one after another, the first time the section scrolls into view.
 * Does nothing for users who prefer reduced motion (content just shows).
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

        gsap.from(items, {
          y: 28,
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%', // when the section's top reaches 80% down the screen
            once: true, // play once, never hide again on scroll up
          },
        })
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return ref
}