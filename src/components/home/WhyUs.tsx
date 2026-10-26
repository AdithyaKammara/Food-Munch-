import { useRef } from 'react'
import {
  ArrowRight,
  ChefHat,
  ConciergeBell,
  Leaf,
  MousePointerClick,
  ShieldCheck,
  ShoppingBag,
  Star,
  UtensilsCrossed,
} from 'lucide-react'
import { MENU_ITEMS } from '../../data/menu'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'
import { useReveal } from '../../lib/useReveal'

// Real numbers from the menu data (no made-up customer counts).
const averageRating = (
  MENU_ITEMS.reduce((sum, item) => sum + item.rating, 0) / MENU_ITEMS.length
).toFixed(1)
const courseCount = new Set(MENU_ITEMS.map((m) => m.category)).size
const chefsPick = MENU_ITEMS.find((m) => m.id === 4) ?? MENU_ITEMS[0]

const benefits = [
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    text: 'We focus on quality ingredients and delicious food prepared with care.',
  },
  {
    icon: ChefHat,
    title: 'Authentic Flavours',
    text: 'Enjoy beloved Indian favourites, including signature Hyderabadi biryani.',
  },
  {
    icon: ShoppingBag,
    title: 'Convenient Ordering',
    text: 'Browse the menu, add your favourites to the cart, and place an order with ease.',
  },
  {
    icon: Star,
    title: 'Customer Favourites',
    text: 'Discover popular dishes and find something delicious for your next meal.',
  },
  {
    icon: ShieldCheck,
    title: 'Simple & Secure Checkout',
    text: 'A straightforward checkout with clear order details and payment options.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Options for Every Craving',
    text: 'Explore meals, snacks, desserts, and drinks to suit different tastes and occasions.',
  },
]

const stats = [
  { icon: ConciergeBell, value: String(MENU_ITEMS.length), label: 'Signature dishes' },
  { icon: Star, value: `${averageRating}★`, label: 'Average rating' },
  { icon: UtensilsCrossed, value: String(courseCount), label: 'Menu courses' },
]

const floatCard = 'absolute rounded-2xl bg-white shadow-[0_16px_36px_rgba(79,54,10,0.14)]'

export default function WhyUs() {
  const ref = useReveal<HTMLElement>()
  const visual = useRef<HTMLDivElement>(null)

  // The food visual: blob grows, photo settles, cards pop in when it scrolls into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: visual.current, start: 'top 75%', once: true },
          })
          .from('[data-why="blob"]', { scale: 0.75, autoAlpha: 0, duration: 1.1, ease: 'back.out(1.2)' })
          .from('[data-why="photo"]', { scale: 0.88, rotate: -4, autoAlpha: 0, duration: 1.1 }, 0.15)
          .from('[data-why="deco"]', { scale: 0, autoAlpha: 0, stagger: 0.07, duration: 0.6, ease: 'back.out(2)' }, 0.6)
          .from('[data-why="float"]', { y: 24, autoAlpha: 0, stagger: 0.15, duration: 0.7, ease: 'back.out(1.6)' }, 0.7)
      })
      return () => mm.revert()
    },
    { scope: visual },
  )

  return (
    <section ref={ref} id="why-us" className="relative isolate overflow-hidden bg-[#fff8ec] py-20 md:py-28">
      {/* Soft corner shape, top left */}
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 -z-10 h-64 w-64 rounded-full bg-[#ffe7a3]/70"
      />

      {/* Phones: heading, photo, cards, stats. Large screens: words on the left, photo on the right. */}
      <div className="mx-auto grid max-w-7xl items-center gap-x-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
          <div data-reveal className="order-1 text-center lg:order-none lg:col-start-1 lg:row-start-1">
            <p className="flex items-center justify-center gap-4">
              <span aria-hidden="true" className="h-px w-12 bg-ink/40" />
              <span className="rounded-full bg-[#ffe7a3] px-5 py-2 text-xs font-bold uppercase tracking-wider text-on-gold">
                Why choose Food Munch
              </span>
              <span aria-hidden="true" className="h-px w-12 bg-ink/40" />
            </p>

            <h2 className="mt-6 font-display text-[1.85rem] font-extrabold leading-[1.12] min-[400px]:text-4xl tracking-[-0.03em] sm:text-5xl xl:text-[3.4rem]">
              More Than Just Food,
              <br />
              <span className="relative isolate inline-block px-[0.12em]">
                A Better Experience<span className="-ml-[0.05em]">.</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 400 80"
                  preserveAspectRatio="none"
                  className="absolute -inset-x-[0.04em] bottom-[-0.04em] -z-10 h-[0.9em] w-[calc(100%+0.08em)]"
                >
                  <path
                    d="M8 22 C 70 6, 160 14, 250 8 S 370 4, 394 16 C 398 34, 392 52, 386 66 C 300 74, 200 70, 110 76 S 20 74, 6 64 C 2 50, 4 36, 8 22 Z"
                    fill="var(--color-gold)"
                  />
                </svg>
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
              From authentic Hyderabadi flavours to convenient ordering, we make every meal feel
              special.
            </p>
          </div>

        <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2">
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:mt-12 lg:grid-cols-2 xl:grid-cols-3">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                data-reveal
                className="rounded-2xl border border-[#f1e4c9] bg-white/70 p-4 transition-colors hover:border-gold hover:bg-white sm:p-5"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-ink sm:h-12 sm:w-12">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-[15px] font-bold leading-snug sm:mt-4 sm:text-lg">{title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted sm:mt-1.5 sm:text-sm">{text}</p>
              </li>
            ))}
          </ul>

          <dl data-reveal className="mt-10 grid grid-cols-3">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <div
                key={label}
                className={`flex flex-col items-start gap-2 px-3 sm:flex-row sm:items-center sm:gap-3 sm:px-6 ${
                  i === 0 ? 'pl-0 sm:pl-0' : 'border-l border-[#ead9b6]'
                }`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ffe7a3] text-gold-text sm:h-14 sm:w-14">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <div className="flex flex-col-reverse leading-tight">
                  <dt className="text-[13px] text-muted sm:text-sm">{label}</dt>
                  <dd className="font-display text-2xl font-extrabold sm:text-3xl">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- Right: food photo on a golden blob ---------- */}
        <div
          ref={visual}
          className="relative order-2 mx-auto mb-16 mt-14 aspect-square lg:order-none w-full max-w-[26rem] sm:mb-10 sm:max-w-[36rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:my-0"
        >
          <div data-why="blob" aria-hidden="true" className="absolute inset-[-8%] -z-10">
            <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible">
              <path
                d="M300 30c100-8 196 40 240 126 42 82 32 176-10 246-44 72-130 120-222 118-96-2-190-48-236-128C26 312 40 210 92 140 136 82 214 36 300 30Z"
                fill="#ffe7a3"
              />
              <path
                d="M420 120c84 34 150 116 160 212 10 94-40 182-120 222-82 40-196 30-276-20-60-38-98-104-86-168 14-74 86-104 152-134 66-30 92-148 170-112Z"
                fill="var(--color-gold)"
              />
            </svg>
          </div>

          {/* The photo, clipped to a soft organic shape */}
          <div
            data-why="photo"
            className="absolute inset-[6%] overflow-hidden shadow-[0_30px_60px_rgba(79,54,10,0.28)]"
            style={{ borderRadius: '46% 54% 50% 50% / 52% 46% 54% 48%' }}
          >
            <img
              src="/images/why-biryani.jpg"
              alt="Hyderabadi chicken biryani in a hammered copper pot, with raita and salan beside it"
              width={1400}
              height={1050}
              loading="lazy"
              className="h-full w-full scale-110 object-cover"
            />
          </div>

          {/* Decorations */}
          <Leaf data-why="deco" aria-hidden="true" className="absolute left-[18%] top-[-2%] h-10 w-10 -rotate-12 fill-green-600 text-green-800" />
          <Leaf data-why="deco" aria-hidden="true" className="absolute right-[4%] top-[0%] h-9 w-9 rotate-45 fill-green-500 text-green-700" />
          <Leaf data-why="deco" aria-hidden="true" className="absolute bottom-[22%] left-[-3%] h-10 w-10 rotate-[200deg] fill-green-600 text-green-800" />
          <span data-why="deco" aria-hidden="true" className="absolute bottom-[8%] right-[2%] h-2.5 w-2.5 rounded-full bg-red-500" />
          <span data-why="deco" aria-hidden="true" className="absolute left-[2%] top-[40%] h-2 w-2 rounded-full bg-gold-dark" />

          {/* Card: customer experience (upper left) */}
          <div data-why="float" className={`${floatCard} left-[-2%] top-[8%] flex max-w-[15rem] items-center gap-3 px-4 py-3 sm:left-[-6%]`}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ffe7a3] text-gold-text">
              <MousePointerClick size={22} aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-base font-extrabold">Easy ordering</span>
              <span className="mt-0.5 hidden text-xs text-muted sm:block">Browse, add to cart and check out in a few taps</span>
            </span>
          </div>

          {/* Card: rating (upper right) */}
          <div data-why="float" className={`${floatCard} right-[-2%] top-[26%] flex items-center gap-3 px-4 py-3 sm:right-[-4%]`}>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gold text-ink">
              <Star size={20} aria-hidden="true" fill="currentColor" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-extrabold">{averageRating}</span>
              <span className="block text-xs text-muted">Average dish rating</span>
            </span>
          </div>

          {/* Card: Chef's special (bottom) */}
          <div
            data-why="float"
            className={`${floatCard} bottom-[-16%] left-[0%] right-[0%] flex items-center gap-3 p-3 pt-5 sm:bottom-[-4%] sm:left-auto sm:right-[-2%] sm:w-[24rem]`}
          >
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-bold text-on-gold sm:left-24 sm:translate-x-0">
              Chef&apos;s Special
            </span>
            <img
              src={chefsPick.image}
              alt=""
              width={56}
              height={56}
              loading="lazy"
              className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[#ffe7a3]"
            />
            <span className="min-w-0 flex-1 text-[15px] font-bold leading-snug">{chefsPick.title}</span>
            <span className="font-display text-lg font-extrabold">₹{chefsPick.price}</span>
            <a
              href="#menu"
              aria-label={`See ${chefsPick.title} on the menu`}
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
