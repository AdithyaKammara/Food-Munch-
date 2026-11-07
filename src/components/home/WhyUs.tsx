import { useRef } from 'react'
import { ChefHat, ConciergeBell, Leaf, ReceiptText, ShoppingBag, Star, UtensilsCrossed } from 'lucide-react'
import { MENU_ITEMS } from '../../data/menu'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'
import { countUp } from '../../lib/motion'
import { useReveal } from '../../lib/useReveal'

// Real numbers from the menu data (no made-up customer counts).
const averageRating = (
  MENU_ITEMS.reduce((sum, item) => sum + item.rating, 0) / MENU_ITEMS.length
).toFixed(1)
const courseCount = new Set(MENU_ITEMS.map((m) => m.category)).size

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
    title: 'Favourite Dishes',
    text: 'Discover popular dishes and find something delicious for your next meal.',
  },
  {
    icon: ReceiptText,
    title: 'Simple Demo Checkout',
    text: 'A straightforward checkout with clear order details and simulated payment options.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Options for Every Craving',
    text: 'Explore meals, snacks, desserts, and drinks to suit different tastes and occasions.',
  },
]

// Real numbers only (from the menu data). `count` drives the count-up animation.
const stats = [
  { icon: ConciergeBell, count: MENU_ITEMS.length, decimals: 0, suffix: '', label: 'Signature dishes' },
  { icon: Star, count: Number(averageRating), decimals: 1, suffix: '★', label: 'Average rating (demo)' },
  { icon: UtensilsCrossed, count: courseCount, decimals: 0, suffix: '', label: 'Menu courses' },
]

export default function WhyUs() {
  const ref = useReveal<HTMLElement>()
  const statsRef = useRef<HTMLDListElement>(null)

  // Count the real stats up once, when they come into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        statsRef.current?.querySelectorAll<HTMLElement>('[data-count]').forEach((el, i) => {
          const s = stats[i]
          countUp(el, s.count, s.decimals, s.suffix)
        })
      })
      return () => mm.revert()
    },
    { scope: statsRef },
  )

  return (
    <section ref={ref} id="why-us" className="bg-cream-deep py-20 md:py-28">
      {/* Phones: heading, photo, reasons. Large screens: the photo fills the left, words on the right. */}
      <div className="mx-auto grid max-w-7xl gap-x-14 gap-y-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div data-reveal className="lg:col-start-2">
          <h2 className="font-display text-[1.85rem] font-extrabold leading-[1.12] tracking-[-0.03em] min-[400px]:text-4xl sm:text-5xl">
            More Than Just Food,
            <br />
            A Better Experience.
          </h2>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            From authentic Hyderabadi flavours to convenient ordering, we make every meal feel
            special.
          </p>
        </div>

        <div data-reveal className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <img
            src="/images/why-biryani.jpg"
            alt="Hyderabadi chicken biryani in a hammered copper pot, with raita and salan beside it"
            width={1400}
            height={1050}
            loading="lazy"
            className="aspect-[4/3] h-full w-full rounded-[2rem] object-cover shadow-lift lg:aspect-auto"
          />
        </div>

        <div className="lg:col-start-2">
          <ul className="grid border-t border-line-strong sm:grid-cols-2 sm:gap-x-10">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li key={title} data-reveal className="flex gap-3 border-b border-line-strong py-5">
                <Icon size={22} aria-hidden="true" className="mt-0.5 shrink-0 text-gold-text" />
                <div>
                  <h3 className="font-bold leading-snug">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <dl ref={statsRef} data-reveal className="mt-8 grid grid-cols-3 gap-4">
            {stats.map(({ count, decimals, suffix, label }) => (
              <div key={label} className="flex flex-col-reverse leading-tight">
                <dt className="mt-1 text-[13px] text-muted sm:text-sm">{label}</dt>
                <dd className="font-display text-3xl font-extrabold tabular-nums sm:text-4xl">
                  {/* The visible number counts up; screen readers get the final value straight away. */}
                  <span data-count aria-hidden="true">
                    {count.toFixed(decimals)}
                    {suffix}
                  </span>
                  <span className="sr-only">{count.toFixed(decimals)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
