import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { MENU_ITEMS } from '../../data/menu'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'

// Every number here comes from the real menu data.
const averageRating = (
  MENU_ITEMS.reduce((sum, item) => sum + item.rating, 0) / MENU_ITEMS.length
).toFixed(1)

const facts = [
  { value: String(MENU_ITEMS.length), label: 'dishes on the menu' },
  { value: averageRating, label: 'average dish rating' },
  { value: '22 min', label: 'demo delivery estimate' },
]

// The dish in the photo is a real item from the menu.
const featured = MENU_ITEMS.find((m) => m.id === 4) ?? MENU_ITEMS[0]

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } })

        // Each headline line rises out of its own clipped row.
        tl.from('[data-hero="line"]', { yPercent: 110, stagger: 0.1, duration: 1.1 })
          .from('[data-hero="text"]', { y: 24, autoAlpha: 0, duration: 0.8 }, '-=0.7')
          .from('[data-hero="cta"] > *', { y: 16, autoAlpha: 0, stagger: 0.08, duration: 0.7 }, '-=0.6')
          .from('[data-hero="fact"]', { y: 16, autoAlpha: 0, stagger: 0.07, duration: 0.7 }, '-=0.55')

        // The photo opens up and settles.
        tl.from('[data-hero="photo-wrap"]', { autoAlpha: 0, y: 40, duration: 1.2 }, 0.25).from(
          '[data-hero="photo"]',
          { scale: 1.15, duration: 1.8, ease: 'power3.out' },
          0.25,
        )

        // Slow drift on the photo while the hero scrolls away.
        gsap.to('[data-hero="photo"]', {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="home" className="scroll-mt-20 overflow-hidden pb-16 pt-8 md:pb-36 md:pt-14">
      <div className="frame">
        <h1 className="display text-[clamp(2.6rem,9.2vw,8.5rem)]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero="line" className="block">
              Delicious food
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero="line" className="block">
              for a better you
            </span>
          </span>
        </h1>

        <div className="mt-10 grid gap-12 md:mt-14 lg:grid-cols-12 lg:gap-10">
          {/* Words */}
          <div className="lg:col-span-5 lg:pt-2 xl:col-span-4">
            <p data-hero="text" className="max-w-md text-xl leading-relaxed md:text-[22px]">
              Hyderabadi biryani, kebabs, curries and desserts from the Food Munch kitchen, brought
              to your door in about 22 minutes.
            </p>

            <div data-hero="cta" className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-5">
              <a
                href="#menu"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-lg font-bold text-on-gold transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Browse the menu
                <ArrowRight
                  size={20}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a
                href="#delivery"
                className="font-semibold underline decoration-2 underline-offset-[6px] hover:decoration-gold-dark"
              >
                How delivery works
              </a>
            </div>

            <dl className="mt-14 grid max-w-md grid-cols-3 gap-5">
              {facts.map((fact) => (
                <div key={fact.label} data-hero="fact" className="flex flex-col-reverse">
                  <dt className="mt-1 text-sm leading-snug text-muted">{fact.label}</dt>
                  <dd className="display whitespace-nowrap text-[clamp(1.75rem,2.6vw,2.5rem)]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Photo: runs to the right edge on large screens */}
          <figure className="lg:col-span-7 lg:-mr-[clamp(20px,3.2vw,44px)] xl:col-span-8">
            <div data-hero="photo-wrap" className="relative aspect-[4/3] overflow-hidden bg-ink md:aspect-[16/10]">
              <img
                data-hero="photo"
                src={featured.image}
                alt="Hyderabadi chicken dum biryani in a copper bowl, with a second bowl behind it"
                width={1400}
                height={933}
                fetchPriority="high"
                className="absolute left-0 top-[-10%] h-[120%] w-full object-cover"
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <span className="text-[15px]">
                <strong className="font-semibold">{featured.title}</strong>
                <span className="text-muted">, our most ordered dish</span>
              </span>
              <span className="font-display text-lg font-bold">₹{featured.price}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
