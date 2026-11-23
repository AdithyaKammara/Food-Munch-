import type { CSSProperties } from 'react'
import { ArrowRight, Clock, Star, UtensilsCrossed } from 'lucide-react'
import { MENU_ITEMS } from '../../data/menu'
import CharminarMark from '../brand/CharminarMark'
import Flourish from '../brand/Flourish'
import TornEdge from '../brand/TornEdge'
import Button from '../ui/Button'

// Every number comes from the real menu data or is labelled as a demo value (owner decision D2).
const averageRating = (
  MENU_ITEMS.reduce((sum, item) => sum + item.rating, 0) / MENU_ITEMS.length
).toFixed(1)

const stats = [
  { Icon: UtensilsCrossed, value: String(MENU_ITEMS.length), label: 'Signature dishes' },
  { Icon: Star, value: averageRating, label: 'Demo rating' },
  { Icon: Clock, value: '~22 min', label: 'Demo delivery time' },
]

// Each heading line sits in its own mask so it can rise into view (animation-guidelines.md §4).
// The bottom padding keeps descenders (y, g) inside the mask.
const lineMask = 'block overflow-hidden pb-[0.1em] -mb-[0.1em] lg:whitespace-nowrap'

/** Stagger position for the hero entrance, which is CSS in index.css (`--i`). */
const order = (i: number) => ({ '--i': i }) as CSSProperties

/**
 * The opening screen (component-guidelines.md §6): words on the left, the dish on a torn
 * forest panel that runs to the right edge of the screen, behind the navbar.
 * Phones and tablets get the words, then the panel at full width, then the stats.
 *
 * The entrance (animation-guidelines.md §4) is CSS keyframes, not GSAP: this section is
 * prerendered into index.html, and CSS starts it with the first paint, before any script runs.
 */
export default function Hero() {
  return (
    <section
      id="home"
      tabIndex={-1}
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden outline-none lg:-mt-20"
    >
      {/* The Charminar, faint on the cream, just behind the panel's torn edge (desktop only) */}
      <div
        aria-hidden="true"
        data-hero="art"
        className="hero-parallax-art pointer-events-none absolute right-[calc(50vw-4rem)] top-[18%] -z-10 hidden w-56 lg:block xl:w-64"
      >
        <CharminarMark
          variant="art"
          strokeWidth={1.25}
          className="block w-full text-forest-800 opacity-[0.18]"
        />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12 lg:min-h-[min(100svh,46rem)] lg:justify-center lg:pb-16 lg:pt-[calc(5rem+2.5rem)]">
        <div className="lg:w-[calc(50vw-max(0px,(100vw-80rem)/2)-3rem)]">
          <p
            data-hero="fade"
            style={order(0)}
            className="flex items-center gap-3 text-label font-semibold uppercase text-copper-700"
          >
            Hyderabad specials
            <span aria-hidden="true" className="h-px w-8 bg-copper-500" />
          </p>

          <h1 id="hero-heading" className="mt-4 font-display text-display-xl font-bold text-ink-900">
            <span className={lineMask}>
              <span data-hero="line" style={order(0)} className="block">
                Savour Hyderabad&apos;s
              </span>
            </span>
            <span className={lineMask}>
              <span data-hero="line" style={order(1)} className="block">
                finest biryanis.
              </span>
            </span>
            <span className={lineMask}>
              <span data-hero="line" style={order(2)} className="relative inline-block pb-[0.18em]">
                <em className="accent">Delivered.</em>
                <span data-hero="flourish" className="absolute inset-x-0 bottom-0 block">
                  <Flourish className="block h-[0.24em] w-full" />
                </span>
              </span>
            </span>
          </h1>

          <p data-hero="fade" style={order(1)} className="mt-5 max-w-[34rem] text-body-lg text-ink-600">
            From iconic biryanis to local favourites, cooked fresh in Hyderabadi style and brought
            to your door.
          </p>

          <div data-hero="fade" style={order(2)} className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              href="#menu"
              size="lg"
              icon={<ArrowRight size={20} aria-hidden="true" className="hero-arrow" />}
              iconPosition="end"
            >
              Order now
            </Button>
            <Button href="#delivery" variant="secondary" size="lg">
              See how ordering works
            </Button>
          </div>
        </div>

        {/* The dish. On large screens it leaves the flow and fills the right side of the hero. */}
        <div className="-mx-4 mt-10 sm:-mx-6 lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:mt-0 lg:w-[50vw]">
          <div data-hero="panel" className="h-full">
            <TornEdge side="top" lgSide="left" className="aspect-[4/3] overflow-hidden bg-forest-950 lg:aspect-auto lg:h-full">
              <div className="hero-parallax-photo absolute inset-x-0 -top-[8%] h-[116%]">
                {/* The largest thing on the first screen (the LCP). AVIF is less than half the
                    JPEG's weight at the same look; the JPEG stays for browsers without AVIF. */}
                <picture className="contents">
                  <source
                    type="image/avif"
                    srcSet="/images/hero-handi-800.avif 800w, /images/hero-handi-1200.avif 1200w"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <img
                    data-hero="photo"
                    src="/images/hero-handi-1200.jpg"
                    srcSet="/images/hero-handi-800.jpg 800w, /images/hero-handi-1200.jpg 1200w"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    alt="Chicken biryani in a copper handi, with raita and salan on the side"
                    width={1200}
                    height={900}
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </picture>
                {/* Steam over the handi: a few soft rises after load, then still (index.css) */}
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 120 90"
                  className="hero-steam absolute left-[52%] top-[13%] w-[20%] -translate-x-1/2 text-cream-50"
                >
                  <g fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
                    <path d="M38 86c-8-12 8-20 0-34s6-22 2-40" />
                    <path d="M62 88c-9-14 9-22 0-38s7-24 2-44" />
                    <path d="M86 86c-8-12 8-20 0-34s6-22 2-38" />
                  </g>
                </svg>
              </div>

              {/* Shade along the top so the handwritten note stays legible on the photo */}
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2/5 bg-linear-to-b from-forest-950/75 to-transparent" />

              <p
                data-hero="note"
                className="absolute right-5 top-6 flex max-w-[10ch] flex-col items-end text-right font-note text-[1.5rem] leading-[1.05] text-cream-50 sm:right-8 sm:top-8 sm:text-[1.75rem] lg:right-10 lg:top-[calc(5rem+1.5rem)]"
              >
                Authentic Hyderabadi biryani
                <svg aria-hidden="true" focusable="false" viewBox="0 0 40 48" className="mr-6 mt-1 h-10 w-8 text-gold-300">
                  <path
                    data-arrow
                    pathLength={1}
                    d="M34 3C38 18 30 34 8 42M8 32l0 10 10 1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.25}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </p>
            </TornEdge>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-0 lg:mt-12 lg:w-[calc(50vw-max(0px,(100vw-80rem)/2)-3rem)]">
          {stats.map(({ Icon, value, label }, i) => (
            // The label (dt) comes first for screen readers; the grid shows the value above it.
            <div
              key={label}
              data-hero="fade"
              style={order(3 + i)}
              className="grid content-start items-center gap-x-3 gap-y-1 leading-tight sm:grid-cols-[auto_1fr] sm:px-4 sm:first:pl-0 xl:px-5 sm:[&+&]:border-l sm:[&+&]:border-line-200"
            >
              <dt className="contents">
                <Icon
                  size={24}
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="row-start-1 mb-1 text-copper-600 sm:col-start-1 sm:row-span-2 sm:mb-0"
                />
                <span className="row-start-3 text-caption text-ink-600 sm:col-start-2 sm:row-start-2">{label}</span>
              </dt>
              <dd className="tabular row-start-2 whitespace-nowrap font-display text-[1.375rem] font-bold text-ink-900 sm:col-start-2 sm:row-start-1">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
