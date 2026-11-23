import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { PROMOS, type PromoCode } from '../../lib/pricing'
import { useReveal } from '../../lib/useReveal'
import SectionHeading from '../ui/SectionHeading'

// LUCKY60 is left out: it is described as a "wheel reward", and the site has no prize wheel.
// The code itself still works if typed in the cart.
const SHOWN: PromoCode[] = ['FIRST50', 'MUNCH10', 'FEAST75']

/**
 * A short band of the real promo codes (implementation-plan.md C3: the reference's "Offers" link).
 * Each code has a copy button that follows modern-web-guidance: copy-button.
 */
export default function OffersStrip() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} id="offers" tabIndex={-1} aria-labelledby="offers-title" className="bg-cream-300 outline-none">
      <div className="mx-auto max-w-[77.5rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <SectionHeading id="offers-title">Offers</SectionHeading>
          <p className="max-w-md text-ink-600">
            Add a code in your cart at checkout. These are demo codes on a portfolio site.
          </p>
        </div>

        {/* Phones: a sideways snap strip of code cards (`relative`, so the hidden labels inside stay
            inside the scroller and do not widen the page). From 640px: three columns with hairlines. */}
        <ul className="relative -mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-0 sm:overflow-visible sm:border-y sm:border-copper-500/30 sm:p-0">
          {SHOWN.map((code, i) => (
            <li
              key={code}
              data-reveal
              className={`flex w-[82%] shrink-0 snap-start flex-col gap-3 rounded-md border border-copper-500/30 bg-cream-200/60 p-5 sm:w-auto sm:rounded-none sm:border-0 sm:bg-transparent sm:px-6 sm:py-6 ${i > 0 ? 'sm:border-l sm:border-copper-500/30' : 'sm:pl-0'}`}
            >
              <p className="font-display text-display-md font-bold tracking-wide text-copper-700">{code}</p>
              <p className="text-ink-900">{PROMOS[code].title}</p>
              <CopyCode code={code} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function CopyCode({ code }: { code: PromoCode }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    // Repeat presses restart the feedback; the button never disables, so focus and retry stay put.
    window.clearTimeout(timer.current)
    setState('idle')
    try {
      await navigator.clipboard.writeText(code)
      setState('copied')
    } catch {
      setState('failed')
    }
    timer.current = window.setTimeout(() => setState('idle'), 2000)
  }

  return (
    <span className="mt-auto flex items-center gap-3">
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-11 min-w-11 items-center gap-2 rounded-full border-[1.5px] border-copper-600 px-4 text-[0.9375rem] font-semibold text-copper-700 transition-[background-color,scale] duration-150 hover:bg-cream-200 motion-safe:active:scale-97"
      >
        {state === 'copied' ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
        {/* The space sits outside the hidden span: name computation trims each element's own text */}
        Copy code <span className="sr-only">{code}</span>
      </button>
      {/* The live region sits beside the button, not inside it, and stays in the accessibility tree */}
      <span
        role="status"
        className={`text-sm font-semibold transition-opacity duration-150 ${state === 'failed' ? 'text-nonveg' : 'text-success'} ${state === 'idle' ? 'opacity-0' : 'opacity-100'}`}
      >
        {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : ''}
      </span>
    </span>
  )
}
