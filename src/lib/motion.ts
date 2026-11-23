import { gsap, MOTION_OK } from './gsap'

/**
 * The Food Munch motion language. Every animation on the site uses these values,
 * so the whole page moves the same way.
 */
export const MOTION = {
  /** Colour and border changes on hover and focus */
  instant: 0.12,
  /** Small interactions: buttons, badges, toggles */
  quick: 0.24,
  /** Cards, popovers, dialog content, tile selection */
  base: 0.4,
  /** Section and element entrances */
  duration: 0.6,
  /** Hero image reveal and heading lines */
  hero: 0.9,
  /** Delay between items in a group (at most six are staggered) */
  stagger: 0.07,
  /** How far things travel when they appear (px) */
  offset: 20,
  /** Things arriving */
  ease: 'power2.out',
  /** Things leaving */
  easeIn: 'power2.in',
  /** Things moving between two places */
  easeInOut: 'power3.inOut',
  /** Slight settle for small confirmations (never a big bounce) */
  pop: 'back.out(1.4)',
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
 * Cart feedback (animation-guidelines.md §11): a 12px copper dot flies from the button that was
 * pressed to the navbar cart on a curved path, in a fixed layer, and is removed when it lands.
 * Returns a promise that settles on landing, or `null` when there is no flight (reduced motion,
 * no origin, or no visible cart icon), so the caller can act at once.
 */
export function flyToCart(from: Element | null): Promise<void> | null {
  const target = document.querySelector('.cart-target')
  if (!from || !target || prefersReducedMotion()) return null
  const a = from.getBoundingClientRect()
  const b = target.getBoundingClientRect()
  if (a.width === 0 || b.width === 0) return null

  const dot = document.createElement('span')
  dot.className = 'fly-dot'
  dot.setAttribute('aria-hidden', 'true')
  dot.style.left = `${a.left + a.width / 2 - 6}px`
  dot.style.top = `${a.top + a.height / 2 - 6}px`
  document.body.append(dot)

  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top + a.height / 2)
  return new Promise((resolve) => {
    // Different easings on x and y bend the straight line into an arc.
    gsap
      .timeline({ onComplete: () => (dot.remove(), resolve()) })
      .to(dot, { x: dx, duration: MOTION.duration, ease: 'power1.inOut' }, 0)
      .to(dot, { y: dy, duration: MOTION.duration, ease: 'power2.in' }, 0)
      .to(dot, { scale: 0.6, duration: MOTION.duration, ease: 'power1.in' }, 0)
  })
}
