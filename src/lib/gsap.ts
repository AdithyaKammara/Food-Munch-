// One place to set up GSAP for the whole app.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Use with gsap.matchMedia(): animations only run for users who have NOT asked for reduced motion. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

// Images and fonts change the page height after first paint; re-measure scroll triggers once they're in.
if (typeof window !== 'undefined') {
  // Each refresh re-measures every trigger on the page, so they are coalesced into one and only
  // run when the page height has really changed (Phase 9: several refreshes during load were the
  // biggest cost of the first seconds on a slow phone).
  let refreshTimer = 0
  let measuredHeight = -1
  // A refresh scrolls the page by itself to measure, which stops a smooth scroll in flight (an
  // anchor link to #delivery stopped after 400px). Sections below the hero settle their real
  // height as they near the screen (content-visibility, index.css), so the page height changes
  // during such scrolls; the refresh waits until scrolling has paused.
  let lastScroll = 0
  window.addEventListener('scroll', () => (lastScroll = performance.now()), { passive: true })
  const scheduleRefresh = () => {
    window.clearTimeout(refreshTimer)
    refreshTimer = window.setTimeout(() => {
      if (performance.now() - lastScroll < 150) return scheduleRefresh()
      const height = document.body.scrollHeight
      if (Math.abs(height - measuredHeight) < 2) return
      measuredHeight = height
      ScrollTrigger.refresh()
    }, 150)
  }
  window.addEventListener('load', scheduleRefresh, { once: true })
  document.fonts?.ready.then(scheduleRefresh)
  // Filtering the menu changes the page height, which moves everything below it.
  new ResizeObserver(scheduleRefresh).observe(document.body)
  // ScrollTrigger measures once by itself when the page starts; that height is the baseline.
  ScrollTrigger.addEventListener('refresh', () => {
    measuredHeight = document.body.scrollHeight
  })
}

/**
 * True while ScrollTrigger is re-measuring the page. It scrolls the page by itself while it does,
 * so scroll-driven UI (the navbar scrollspy) should ignore those moments.
 */
let refreshing = false
if (typeof window !== 'undefined') {
  ScrollTrigger.addEventListener('refreshInit', () => {
    refreshing = true
  })
  ScrollTrigger.addEventListener('refresh', () => {
    refreshing = false
  })
}
export const isRefreshing = () => refreshing

export { gsap, ScrollTrigger, useGSAP }
