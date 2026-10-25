import { useRef } from 'react'
import { ArrowRight, Clock, ShoppingBag, Star } from 'lucide-react'
import { MENU_ITEMS } from '../../data/menu'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'

// Stats come from the real menu data, not made-up numbers.
const averageRating = (
  MENU_ITEMS.reduce((sum, item) => sum + item.rating, 0) / MENU_ITEMS.length
).toFixed(1)

const stats = [
  { value: String(MENU_ITEMS.length), label: 'Signature dishes' },
  { value: `${averageRating}★`, label: 'Average rating' },
  { value: '~22 min', label: 'Delivery estimate' },
]

// The "Chef's pick" card uses a real dish from the menu.
const featured = MENU_ITEMS.find((m) => m.id === 4) ?? MENU_ITEMS[0]

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80'

const glass = 'rounded-2xl border border-white/60 bg-white/75 shadow-card backdrop-blur-md'

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 } })

        // Text column
        tl.from('[data-hero="badge"]', { y: 16, autoAlpha: 0 })
          .from('[data-hero="line"]', { y: 40, autoAlpha: 0, stagger: 0.12, duration: 0.8 }, '-=0.4')
          .from('[data-hero="text"]', { y: 20, autoAlpha: 0 }, '-=0.5')
          .from('[data-hero="cta"] > *', { y: 16, autoAlpha: 0, stagger: 0.1 }, '-=0.45')
          .from('[data-hero="stat"]', { y: 16, autoAlpha: 0, stagger: 0.08 }, '-=0.4')

        // Highlighter stroke behind "Better You" draws in from the left
        tl.from(
          '[data-hero="mark"]',
          { scaleX: 0, transformOrigin: 'left center', duration: 0.6, ease: 'power2.inOut' },
          0.7,
        )

        // Visual column
        tl.from('[data-hero="frame"]', { rotate: -10, autoAlpha: 0, duration: 1 }, 0.1)
          .from('[data-hero="photo"]', { y: 40, scale: 0.96, autoAlpha: 0, duration: 1 }, 0.2)
          .from(
            '[data-hero="float"]',
            { y: 24, scale: 0.9, autoAlpha: 0, stagger: 0.15, duration: 0.6, ease: 'back.out(1.6)' },
            0.8,
          )
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="home" className="relative isolate scroll-mt-20 overflow-hidden">
      {/* Soft gold glow instead of a flat background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(55% 55% at 85% 25%, rgb(255 191 0 / 0.20), transparent 70%), radial-gradient(40% 45% at 5% 95%, rgb(255 191 0 / 0.10), transparent 70%)',
        }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 pb-20 pt-10 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-28">
        {/* ---------- Text column ---------- */}
        <div className="text-center lg:text-left">
          <span
            data-hero="badge"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-xs font-semibold text-muted backdrop-blur"
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-600" />
            Open for demo orders · Hyderabad
          </span>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            <span data-hero="line" className="inline-block">
              Delicious food
            </span>{' '}
            <span data-hero="line" className="inline-block">
              for a{' '}
              <span className="relative isolate inline-block">
                Better You
                <span
                  data-hero="mark"
                  aria-hidden="true"
                  className="absolute inset-x-[-0.08em] bottom-[0.06em] -z-10 h-[0.38em] rounded-md bg-gold"
                />
              </span>
            </span>
          </h1>

          <p data-hero="text" className="mx-auto mt-6 max-w-md text-lg text-muted lg:mx-0">
            Fresh ingredients, authentic Hyderabadi flavours, and meals made with love, delivered
            to your doorstep.
          </p>

          <div data-hero="cta" className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a
              href="#menu"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-bold text-on-gold shadow-card hover:shadow-card-hover"
            >
              Explore Menu <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              href="#menu"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-7 py-3 font-bold hover:bg-ink hover:text-white"
            >
              <ShoppingBag size={18} aria-hidden="true" /> Order Now
            </a>
          </div>

          <dl className="mt-12 flex justify-center divide-x divide-line lg:justify-start">
            {stats.map((stat) => (
              <div
                key={stat.label}
                data-hero="stat"
                className="flex flex-col-reverse px-5 first:pl-0 last:pr-0 sm:px-7"
              >
                <dt className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
                  {stat.label}
                </dt>
                <dd className="font-display text-3xl font-extrabold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- Visual column ---------- */}
        <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
          {/* Tilted gold frame (wrapper is animated, inner keeps its tilt) */}
          <div data-hero="frame" aria-hidden="true" className="absolute inset-0">
            <div className="h-full w-full translate-x-4 translate-y-4 rotate-3 rounded-[2.5rem] bg-gold" />
          </div>

          <img
            data-hero="photo"
            src={HERO_IMAGE}
            alt="A bowl of Hyderabadi chicken dum biryani"
            width={900}
            height={1125}
            className="relative aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-card-hover"
          />

          {/* Glass card: rating */}
          <div
            data-hero="float"
            className={`absolute -left-3 top-8 flex items-center gap-2.5 px-4 py-3 sm:-left-10 ${glass}`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-on-gold">
              <Star size={18} aria-hidden="true" fill="currentColor" />
            </span>
            <span className="text-left leading-tight">
              <span className="block font-display text-lg font-extrabold">{averageRating}</span>
              <span className="block text-xs text-muted">Average rating</span>
            </span>
          </div>

          {/* Glass card: delivery time */}
          <div
            data-hero="float"
            className={`absolute -right-3 top-[38%] flex items-center gap-2.5 px-4 py-3 sm:-right-8 ${glass}`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-cream-deep text-gold-text">
              <Clock size={18} aria-hidden="true" />
            </span>
            <span className="text-left leading-tight">
              <span className="block font-display text-lg font-extrabold">~22 min</span>
              <span className="block text-xs text-muted">Demo estimate</span>
            </span>
          </div>

          {/* Glass card: chef's pick (real dish from the menu) */}
          <div
            data-hero="float"
            className={`absolute -bottom-7 left-4 right-4 flex items-center gap-3 p-3 sm:left-auto sm:-right-6 sm:w-72 ${glass}`}
          >
            <img
              src={featured.image}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1 text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gold-text">Chef's pick</p>
              <p className="truncate text-sm font-bold">{featured.title}</p>
              <p className="text-sm font-extrabold">₹{featured.price}</p>
            </div>
            <a
              href="#menu"
              aria-label={`See ${featured.title} on the menu`}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-on-gold hover:shadow-card-hover"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}