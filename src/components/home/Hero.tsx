import { useRef } from 'react'
import { ArrowRight, Bike, ConciergeBell, Crown, Leaf, MapPin, Star } from 'lucide-react'
import { MENU_ITEMS } from '../../data/menu'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'
import { MOTION } from '../../lib/motion'

// Every number here comes from the real menu data, not made-up review counts.
const averageRating = (
  MENU_ITEMS.reduce((sum, item) => sum + item.rating, 0) / MENU_ITEMS.length
).toFixed(1)

const stats = [
  { icon: ConciergeBell, value: String(MENU_ITEMS.length), label: 'Signature dishes', note: 'Authentic & delicious' },
  { icon: Star, value: averageRating, label: 'Average rating', note: 'Demo ratings' },
  { icon: Bike, value: '~22 min', label: 'Delivery time', note: 'Demo estimate' },
]

// The "Chef's pick" card is a real dish from the menu.
const featured = MENU_ITEMS.find((m) => m.id === 4) ?? MENU_ITEMS[0]

const floatCard = 'absolute rounded-2xl bg-white/95 shadow-lift'

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // One coordinated entrance (about 1.4 s). Nothing waits for it: links and buttons work at once.
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: MOTION.ease, duration: MOTION.duration } })

        // Words, top to bottom
        tl.from('[data-hero="badge"]', { y: 16, autoAlpha: 0, duration: 0.5 })
          .from('[data-hero="line"]', { y: 32, autoAlpha: 0, stagger: 0.1 }, '-=0.3')
          .from('[data-hero="mark"]', { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'power2.inOut' }, '-=0.25')
          .from('[data-hero="text"]', { y: 20, autoAlpha: 0 }, '-=0.3')
          .from('[data-hero="cta"] > *', { y: 16, autoAlpha: 0, stagger: MOTION.stagger }, '-=0.35')
          .from('[data-hero="stat"]', { y: 16, autoAlpha: 0, stagger: 0.08 }, '-=0.3')

        // Picture: blob grows, photo comes in from the right and settles, then the small cards
        tl.from('[data-hero="blob"]', { scale: 0.85, autoAlpha: 0, duration: 0.9 }, 0.1)
          .from('[data-hero="photo"]', { x: 60, scale: 0.96, autoAlpha: 0, duration: 0.9 }, 0.2)
          .from('[data-hero="leaf"]', { scale: 0, autoAlpha: 0, stagger: 0.05, duration: 0.4, ease: MOTION.pop }, 0.7)
          .from('[data-hero="float"]', { y: MOTION.offset * 0.7, autoAlpha: 0, stagger: 0.12, duration: 0.5 }, 0.9)
      })

      // Very small depth on the photo while the hero scrolls away (desktop only).
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        gsap.to('[data-hero="photo"]', {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="home" className="relative isolate overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-6 sm:gap-14 sm:px-6 sm:pb-20 md:pt-14 lg:min-h-[min(calc(100svh-65px),780px)] lg:grid-cols-[1.35fr_1fr] lg:gap-6 lg:py-12">
        {/* ---------- Text column ---------- */}
        <div className="text-center lg:text-left">
          <span
            data-hero="badge"
            className="inline-flex items-center gap-2 rounded-full bg-leaf-soft px-4 py-2 text-sm font-semibold text-leaf-deep ring-1 ring-leaf-soft"
          >
            Now delivering in Hyderabad (demo)
            <MapPin size={16} aria-hidden="true" />
          </span>

          <h1 className="mt-7 font-display text-[2.1rem] font-extrabold min-[380px]:text-[2.6rem] leading-[1.08] tracking-[-0.035em] sm:text-6xl lg:text-[min(3.45vw,3.2rem)]">
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
            Hyderabadi biryanis, snacks and meals, made fresh and brought to your door.
          </p>

          <div data-hero="cta" className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start">
            <a
              href="#menu"
              className="inline-flex items-center rounded-2xl bg-gold px-8 py-4 text-lg font-bold text-on-gold shadow-gold transition-[translate] hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore Menu
            </a>
          </div>

          <dl className="mx-auto mt-12 hidden max-w-2xl grid-cols-3 text-left sm:grid lg:mx-0">
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
                  <dd className="font-display text-xl font-extrabold tabular-nums sm:text-2xl">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- Visual column ---------- */}
        <div className="relative mx-auto aspect-square w-full max-w-[17rem] sm:max-w-[34rem]">
          {/* Two-tone gold blob: the deep gold shape sits lower right, the pale one upper left */}
          <div data-hero="blob" aria-hidden="true" className="absolute inset-[-8%] -z-10">
            <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible">
              <path
                d="M300 20c96-6 186 44 230 128 40 78 30 170-12 236-40 64-118 88-196 80C232 456 150 430 96 370 40 306 18 214 50 142 82 72 208 26 300 20Z"
                fill="var(--color-gold-soft)"
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
            className="absolute inset-[9%] h-[82%] w-[82%] rounded-full object-cover shadow-lift ring-[10px] ring-white"
          />

          {/* Decorative leaves and spice flecks */}
          <Leaf data-hero="leaf" aria-hidden="true" className="absolute right-[6%] top-[2%] h-9 w-9 rotate-[25deg] fill-leaf text-leaf-deep" />
          <Leaf data-hero="leaf" aria-hidden="true" className="absolute left-[2%] top-[34%] h-8 w-8 -rotate-45 fill-leaf text-leaf-deep" />
          <Leaf data-hero="leaf" aria-hidden="true" className="absolute bottom-[14%] left-[6%] h-10 w-10 rotate-[140deg] fill-leaf text-leaf-deep" />

          {/* Card: chef's pick (a real dish from the menu) */}
          <div
            data-hero="float"
            className={`${floatCard} bottom-[-2%] left-[0%] right-[0%] hidden items-center gap-3 p-3 pt-5 sm:flex sm:left-auto sm:right-0 sm:w-[25rem] min-[1400px]:right-[-6%]`}
          >
            <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-on-gold sm:left-24 sm:translate-x-0">
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
              href={`#dish-${featured.id}`}
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
