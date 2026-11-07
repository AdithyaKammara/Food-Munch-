import { useRef } from 'react'
import { ArrowRight, Crown, MapPin } from 'lucide-react'
import { MENU_ITEMS } from '../../data/menu'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'
import { MOTION } from '../../lib/motion'

// Every number here comes from the real menu data, not made-up review counts.
const averageRating = (
  MENU_ITEMS.reduce((sum, item) => sum + item.rating, 0) / MENU_ITEMS.length
).toFixed(1)

const stats = [
  { value: String(MENU_ITEMS.length), label: 'Signature dishes', note: 'Authentic & delicious' },
  { value: averageRating, label: 'Average rating', note: 'Demo ratings' },
  { value: '~22 min', label: 'Delivery time', note: 'Demo estimate' },
]

// The "Chef's pick" card is a real dish from the menu.
const featured = MENU_ITEMS.find((m) => m.id === 4) ?? MENU_ITEMS[0]

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
          .from('[data-hero="text"]', { y: 20, autoAlpha: 0 }, '-=0.3')
          .from('[data-hero="cta"] > *', { y: 16, autoAlpha: 0, stagger: MOTION.stagger }, '-=0.35')
          .from('[data-hero="stat"]', { y: 16, autoAlpha: 0, stagger: 0.08 }, '-=0.3')

        // Picture: the photo comes in from the right and settles, then the Chef's Pick card
        tl.from('[data-hero="photo"]', { x: 60, scale: 0.96, autoAlpha: 0, duration: 0.9 }, 0.2)
          .from('[data-hero="float"]', { y: MOTION.offset * 0.7, autoAlpha: 0, stagger: 0.12, duration: 0.5 }, 0.9)
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="home" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="pb-8 pt-6 sm:pb-12 sm:pt-10 lg:flex lg:min-h-[min(calc(100svh-7.5rem),720px)] lg:items-center lg:py-12">
          <div className="text-center lg:max-w-[min(35rem,42vw)] lg:text-left">
            <p data-hero="badge" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-text">
              <MapPin size={16} aria-hidden="true" />
              Now delivering in Hyderabad (demo)
            </p>

            <h1 className="mt-4 font-display text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.035em] min-[380px]:text-[2.6rem] sm:text-6xl lg:text-[min(4.6vw,4.25rem)]">
              <span data-hero="line" className="block">
                Delicious food.
              </span>
              <span data-hero="line" className="block">
                Made for your kind of day.
              </span>
            </h1>

            <p data-hero="text" className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl lg:mx-0">
              Hyderabadi biryanis, snacks and meals, made fresh and brought to your door.
            </p>

            <div data-hero="cta" className="mt-8 flex justify-center lg:justify-start">
              <a
                href="#menu"
                className="inline-flex items-center rounded-2xl bg-gold px-8 py-4 text-lg font-bold text-on-gold shadow-gold transition-[translate] hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore Menu
              </a>
            </div>

            <dl className="mx-auto mt-10 hidden max-w-xl grid-cols-3 gap-6 text-left sm:grid lg:mx-0">
              {stats.map(({ value, label, note }) => (
                <div key={label} data-hero="stat" className="flex flex-col-reverse leading-tight">
                  <dt>
                    <span className="mt-1 block text-sm font-medium text-ink">{label}</span>
                    <span className="block text-xs text-muted">{note}</span>
                  </dt>
                  <dd className="font-display text-2xl font-extrabold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* The photo carries the screen: it runs off the right edge on large screens */}
      <div className="relative px-4 pb-6 sm:px-6 lg:absolute lg:inset-y-4 lg:right-0 lg:w-[50vw] lg:p-0">
        <img
          data-hero="photo"
          src="/images/hero-biryani.jpg"
          alt="A bowl of Hyderabadi chicken biryani with a drumstick, raita and salan on the side"
          width={1200}
          height={1200}
          fetchPriority="high"
          className="aspect-[4/3] w-full rounded-2xl object-cover lg:aspect-auto lg:h-full lg:rounded-l-[2.5rem] lg:rounded-r-none"
        />

        {/* Card: chef's pick (a real dish from the menu) */}
        <div
          data-hero="float"
          className="absolute bottom-10 left-10 hidden w-[min(25rem,calc(100%-5rem))] items-center gap-3 rounded-2xl bg-surface p-3 shadow-lift sm:flex lg:bottom-5 lg:left-5"
        >
          <img
            src={featured.image}
            alt=""
            width={64}
            height={64}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
          <span className="min-w-0 flex-1 leading-tight">
            <span className="flex items-center gap-1.5 text-xs font-bold text-gold-text">
              <Crown size={14} aria-hidden="true" fill="currentColor" />
              Chef&apos;s Pick
            </span>
            <span className="mt-0.5 block text-[15px] font-bold">{featured.title}</span>
            <span className="mt-0.5 block text-sm text-muted">A royal blend of spices</span>
          </span>
          <span className="font-display text-lg font-extrabold">₹{featured.price}</span>
          <a
            href={`#dish-${featured.id}`}
            aria-label={`See ${featured.title} on the menu`}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold text-on-gold transition-transform hover:scale-110"
          >
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
