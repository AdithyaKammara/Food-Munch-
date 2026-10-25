import { useRef } from 'react'
import { ArrowRight, Bike, ConciergeBell, Crown, Leaf, MapPin, ShoppingCart, Star } from 'lucide-react'
import { MENU_ITEMS } from '../../data/menu'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'

// Every number here comes from the real menu data, not made-up review counts.
const averageRating = (
  MENU_ITEMS.reduce((sum, item) => sum + item.rating, 0) / MENU_ITEMS.length
).toFixed(1)

const stats = [
  { icon: ConciergeBell, value: String(MENU_ITEMS.length), label: 'Signature dishes', note: 'Authentic & delicious' },
  { icon: Star, value: averageRating, label: 'Average rating', note: `Across all ${MENU_ITEMS.length} dishes` },
  { icon: Bike, value: '~22 min', label: 'Delivery time', note: 'Demo estimate' },
]

// The "Chef's pick" card is a real dish from the menu.
const featured = MENU_ITEMS.find((m) => m.id === 4) ?? MENU_ITEMS[0]

const floatCard = 'absolute rounded-2xl bg-white/95 shadow-[0_18px_40px_rgba(79,54,10,0.14)]'

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })

        // Text column, top to bottom
        tl.from('[data-hero="badge"]', { y: 16, autoAlpha: 0, duration: 0.6 })
          .from('[data-hero="line"]', { y: 44, autoAlpha: 0, stagger: 0.12, duration: 0.9 }, '-=0.3')
          .from(
            '[data-hero="mark"]',
            { scaleX: 0, transformOrigin: 'left center', duration: 0.7, ease: 'power2.inOut' },
            '-=0.35',
          )
          .from('[data-hero="text"]', { y: 20, autoAlpha: 0 }, '-=0.5')
          .from('[data-hero="cta"]', { y: 16, autoAlpha: 0 }, '-=0.5')
          .from('[data-hero="stat"]', { y: 16, autoAlpha: 0, stagger: 0.08 }, '-=0.45')

        // Visual column, in parallel
        tl.from('[data-hero="blob"]', { scale: 0.7, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.2)' }, 0.1)
          .from('[data-hero="photo"]', { scale: 0.8, rotate: -12, autoAlpha: 0, duration: 1.2 }, 0.25)
          .from('[data-hero="leaf"]', { scale: 0, rotate: -60, autoAlpha: 0, stagger: 0.08, duration: 0.7, ease: 'back.out(2)' }, 0.8)
          .from('[data-hero="float"]', { y: 24, scale: 0.92, autoAlpha: 0, stagger: 0.15, duration: 0.7, ease: 'back.out(1.6)' }, 0.9)

      })

      // Gentle depth while the page scrolls (large screens only): photo and cards drift at different speeds.
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        gsap.to('[data-hero="photo"]', {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('[data-hero="float"]', {
          y: -40,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="home" className="relative isolate scroll-mt-20 overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-10 sm:px-6 md:pt-14 lg:min-h-[min(calc(100svh-65px),780px)] lg:grid-cols-[1.35fr_1fr] lg:gap-6 lg:py-12">
        {/* ---------- Text column ---------- */}
        <div className="text-center lg:text-left">
          <span
            data-hero="badge"
            className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 ring-1 ring-green-100"
          >
            <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-600" />
            </span>
            Now delivering in Hyderabad (demo)
            <MapPin size={16} aria-hidden="true" />
          </span>

          <h1 className="mt-7 font-display text-[2.6rem] font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-6xl lg:text-[min(3.45vw,3.2rem)]">
            <span data-hero="line" className="block">
              Delicious food<span className="-ml-[0.06em]">.</span>
            </span>
            <span data-hero="line" className="block">
              Made for{' '}
              <span className="relative isolate inline-block whitespace-nowrap px-[0.1em]">
                your kind of day<span className="-ml-[0.06em]">.</span>
                {/* Gold brush stroke behind the words */}
                <svg
                  data-hero="mark"
                  aria-hidden="true"
                  viewBox="0 0 400 80"
                  preserveAspectRatio="none"
                  className="absolute -inset-x-[0.06em] bottom-[-0.02em] -z-10 h-[0.95em] w-[calc(100%+0.12em)]"
                >
                  <path
                    d="M8 22 C 70 6, 160 14, 250 8 S 370 4, 394 16 C 398 34, 392 52, 386 66 C 300 74, 200 70, 110 76 S 20 74, 6 64 C 2 50, 4 36, 8 22 Z"
                    fill="var(--color-gold)"
                  />
                </svg>
              </span>
            </span>
          </h1>

          <p data-hero="text" className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl lg:mx-0">
            From authentic Hyderabadi biryanis to mouth-watering snacks and meals, Food Munch brings
            you fresh, flavourful food at your doorstep.
          </p>

          <div data-hero="cta" className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start">
            <a
              href="#menu"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gold px-8 py-4 text-lg font-bold text-on-gold shadow-[0_12px_24px_rgba(255,191,0,0.35)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore Menu
              <ArrowRight size={20} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#menu"
              className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-ink bg-white/60 px-8 py-4 text-lg font-bold transition-colors hover:bg-ink hover:text-white"
            >
              <ShoppingCart size={20} aria-hidden="true" />
              Order Now
            </a>
          </div>

          <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-3 text-left lg:mx-0">
            {stats.map(({ icon: Icon, value, label, note }, i) => (
              <div
                key={label}
                data-hero="stat"
                className={`flex flex-col items-start gap-2 px-3 sm:flex-row sm:items-center sm:gap-3 sm:px-5 ${i === 0 ? 'pl-0 sm:pl-0' : 'border-l border-line'}`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream-deep text-gold-dark sm:h-12 sm:w-12">
                  <Icon size={22} aria-hidden="true" fill={Icon === Star ? 'currentColor' : 'none'} />
                </span>
                <div className="flex flex-col-reverse leading-tight">
                  <dt>
                    <span className="block text-[13px] font-medium text-ink sm:text-sm">{label}</span>
                    <span className="block text-xs text-muted">{note}</span>
                  </dt>
                  <dd className="font-display text-xl font-extrabold sm:text-2xl">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- Visual column ---------- */}
        <div className="relative mx-auto mb-24 aspect-square w-full max-w-[34rem] sm:mb-0">
          {/* Two-tone gold blob: the deep gold shape sits lower right, the pale one upper left */}
          <div data-hero="blob" aria-hidden="true" className="absolute inset-[-8%] -z-10">
            <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible">
              <path
                d="M300 20c96-6 186 44 230 128 40 78 30 170-12 236-40 64-118 88-196 80C232 456 150 430 96 370 40 306 18 214 50 142 82 72 208 26 300 20Z"
                fill="#ffe7a3"
              />
              <path
                d="M430 150c78 40 140 120 150 214 10 96-34 186-112 226-80 40-196 36-282-10-64-34-110-96-104-160 8-72 74-110 140-146 70-38 132-162 208-124Z"
                fill="var(--color-gold)"
              />
            </svg>
          </div>

          {/* Food photo in a white ring */}
          <img
            data-hero="photo"
            src="/images/hero-biryani.jpg"
            alt="A bowl of Hyderabadi chicken biryani with a drumstick, raita and salan on the side"
            width={1200}
            height={1200}
            fetchPriority="high"
            className="absolute inset-[9%] h-[82%] w-[82%] rounded-full object-cover shadow-[0_30px_60px_rgba(79,54,10,0.25)] ring-[10px] ring-white"
          />

          {/* Decorative leaves and spice flecks */}
          <Leaf data-hero="leaf" aria-hidden="true" className="absolute right-[6%] top-[2%] h-9 w-9 rotate-[25deg] fill-green-600 text-green-700" />
          <Leaf data-hero="leaf" aria-hidden="true" className="absolute left-[2%] top-[34%] h-8 w-8 -rotate-45 fill-green-500 text-green-700" />
          <Leaf data-hero="leaf" aria-hidden="true" className="absolute bottom-[14%] left-[6%] h-10 w-10 rotate-[140deg] fill-green-600 text-green-800" />
          <span data-hero="leaf" aria-hidden="true" className="absolute right-[2%] top-[56%] h-2.5 w-2.5 rounded-full bg-red-500" />
          <span data-hero="leaf" aria-hidden="true" className="absolute right-[12%] top-[16%] h-2 w-2 rounded-full bg-gold-dark" />
          <span data-hero="leaf" aria-hidden="true" className="absolute bottom-[30%] left-[0%] h-2 w-2 rounded-full bg-red-400" />

          {/* Card: rating */}
          <div data-hero="float" className={`${floatCard} left-[0%] top-[2%] flex items-center gap-2.5 px-3 py-2.5 sm:left-[10%] sm:top-[4%] sm:gap-3 sm:px-4 sm:py-3`}>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-cream-deep text-gold-dark">
              <Star size={22} aria-hidden="true" fill="currentColor" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-extrabold">{averageRating}</span>
              <span className="block text-sm font-medium">Average rating</span>
              <span className="hidden text-xs text-muted sm:block">Across {MENU_ITEMS.length} dishes</span>
            </span>
          </div>

          {/* Card: delivery time */}
          <div data-hero="float" className={`${floatCard} right-[0%] top-[30%] flex items-center gap-2.5 px-3 py-2.5 sm:right-[-6%] sm:top-[28%] sm:gap-3 sm:px-4 sm:py-3`}>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-cream-deep text-gold-dark">
              <Bike size={22} aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-extrabold">~22 min</span>
              <span className="block text-sm font-medium">Delivery time</span>
              <span className="hidden text-xs text-muted sm:block">Demo estimate</span>
            </span>
          </div>

          {/* Card: chef's pick (a real dish from the menu) */}
          <div
            data-hero="float"
            className={`${floatCard} bottom-[-24%] left-[0%] right-[0%] flex items-center gap-3 p-3 pt-5 sm:bottom-[-2%] sm:left-auto sm:right-[-6%] sm:w-[25rem]`}
          >
            <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#ffe7a3] px-3 py-1 text-xs font-bold text-on-gold sm:left-24 sm:translate-x-0">
              <Crown size={14} aria-hidden="true" className="text-gold-dark" fill="currentColor" />
              Chef&apos;s Pick
            </span>
            <img
              src={featured.image}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-cream-deep"
            />
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[15px] font-bold">{featured.title}</span>
              <span className="mt-0.5 block text-sm text-muted">A royal blend of spices</span>
            </span>
            <span className="font-display text-lg font-extrabold">₹{featured.price}</span>
            <a
              href="#menu"
              aria-label={`See ${featured.title} on the menu`}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-on-gold transition-transform hover:scale-110"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
