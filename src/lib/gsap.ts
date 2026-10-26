// One place to set up GSAP for the whole app.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Use with gsap.matchMedia(): animations only run for users who have NOT asked for reduced motion. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

// Images and fonts change the page height after first paint; re-measure scroll triggers once they're in.
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
}

export { gsap, ScrollTrigger, useGSAP }
