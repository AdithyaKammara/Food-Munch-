import { gsap, MOTION_OK } from './gsap'

/**
 * The Food Munch motion language. Every animation on the site uses these values,
 * so the whole page moves the same way.
 */
export const MOTION = {
  /** Section and element entrances */
  duration: 0.6,
  /** Small interactions: buttons, badges, toggles */
  quick: 0.24,
  /** Delay between items in a group */
  stagger: 0.09,
  /** How far things travel when they appear (px) */
  offset: 24,
  ease: 'power2.out',
  /** Slight settle for things that "pop" (never a big bounce) */
  pop: 'back.out(1.6)',
} as const

/** True when the visitor has asked their device for less motion. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !window.matchMedia(MOTION_OK).matches
}

/** A small "pop" for feedback (heart toggled, quantity changed). Skipped for reduced motion. */
export function pop(el: Element | null, scale = 1.25) {
  if (!el || prefersReducedMotion()) return
  gsap.fromTo(
    el,
    { scale },
    { scale: 1, duration: MOTION.quick + 0.1, ease: MOTION.pop, overwrite: true, clearProps: 'scale,transform' },
  )
}

/**
 * Counts a number up from 0 when it scrolls into view. Only for real numbers.
 * The element should contain the final value as text, so it is correct without JavaScript.
 */
export function countUp(el: HTMLElement, value: number, decimals = 0, suffix = '') {
  const state = { n: 0 }
  return gsap.to(state, {
    n: value,
    duration: 1.1,
    ease: 'power1.out',
    onUpdate: () => {
      el.textContent = state.n.toFixed(decimals) + suffix
    },
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  })
}
