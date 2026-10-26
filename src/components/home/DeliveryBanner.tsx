import { useRef } from 'react'
import { ArrowRight, Bike, ChefHat, CreditCard, MapPin, Truck } from 'lucide-react'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'
import { MOTION } from '../../lib/motion'
import { useReveal } from '../../lib/useReveal'

const features = [
  {
    icon: Bike,
    title: 'Quick Delivery',
    text: 'Hot meals in about 22 min (demo estimate).',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payment',
    text: 'UPI (QR demo) or Cash on Delivery.',
  },
  {
    icon: MapPin,
    title: 'Order Tracking',
    text: 'Kitchen to doorstep, simulated.',
  },
]

// The three steps shown on the phone screen.
const phoneSteps = ['Preparing', 'Out for delivery', 'Arriving']

const floatCard = 'absolute rounded-2xl bg-white shadow-[0_16px_36px_rgba(79,54,10,0.14)]'

export default function DeliveryBanner() {
  const ref = useReveal<HTMLElement>()
  const visual = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            defaults: { ease: MOTION.ease, duration: MOTION.duration },
            scrollTrigger: { trigger: visual.current, start: 'top 78%', once: true },
          })
          .from('[data-dl="sun"]', { scale: 0.85, autoAlpha: 0, duration: 0.8 })
          // The phone slides in from the right and settles.
          .from('[data-dl="phone"]', { x: 70, autoAlpha: 0, duration: 0.8 }, 0.1)
          // The (simulated) progress bar fills once to "Out for delivery".
          .from('[data-dl="progress"]', { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'power2.inOut' }, 0.6)
          .from('[data-dl="dot"]', { scale: 0, stagger: 0.25, duration: 0.3, ease: MOTION.pop }, 0.6)
          .from('[data-dl="route"]', { strokeDashoffset: 300, duration: 1.1 }, 0.5)
          .from('[data-dl="deco"]', { scale: 0, autoAlpha: 0, stagger: 0.05, duration: 0.4, ease: MOTION.pop }, 0.5)
          .from('[data-dl="float"]', { y: 16, autoAlpha: 0, stagger: 0.12, duration: 0.5 }, 0.7)
      })
      return () => mm.revert()
    },
    { scope: visual },
  )

  return (
    <section ref={ref} id="delivery" className="px-4 py-16 sm:px-6 md:py-20">
      <div className="relative isolate mx-auto grid max-w-7xl items-center gap-12 overflow-hidden rounded-[2rem] bg-[#fff8ec] px-6 py-12 ring-1 ring-[#f3e6cc] sm:px-10 lg:grid-cols-[1.45fr_1fr] lg:gap-6 lg:px-14 lg:py-10">
        {/* ---------- Left: words ---------- */}
        <div>
          <div data-reveal>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-gold-text">
              <span aria-hidden="true" className="h-px w-10 bg-gold-dark/70" />
              Delivery &amp; payment
            </p>

            <h2 className="mt-4 font-display text-[1.7rem] font-extrabold leading-[1.15] tracking-[-0.03em] min-[400px]:text-[1.9rem] sm:text-5xl">
              Your Favourite Food,
              <br />
              <span className="relative isolate inline-block px-[0.08em]">
                Now Closer Than Ever<span className="-ml-[0.05em]">.</span>
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

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              Delicious meals, convenient payment options, and simple order tracking, all in one
              place.
            </p>
          </div>

          <ul className="mt-9 grid gap-6 sm:grid-cols-3 sm:gap-0">
            {features.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                data-reveal
                className={`flex items-start gap-3 sm:px-4 xl:px-5 ${i === 0 ? 'sm:pl-0 xl:pl-0' : 'sm:border-l sm:border-[#ead9b6]'}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold text-ink xl:h-12 xl:w-12">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-bold leading-snug">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <a
            data-reveal
            href="#menu"
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-bold text-on-gold shadow-[0_12px_24px_rgba(255,191,0,0.35)] transition-[translate] hover:-translate-y-0.5 active:translate-y-0"
          >
            Start your order
            <ArrowRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* ---------- Right: phone showing an order on its way ---------- */}
        <div ref={visual} className="relative mx-auto h-[430px] w-full max-w-[34rem] sm:h-[470px]">
          {/* Big gold circle behind the phone */}
          <div
            data-dl="sun"
            aria-hidden="true"
            className="absolute left-1/2 top-[52%] -z-10 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold sm:h-[400px] sm:w-[400px]"
          >
            <span className="absolute -left-6 top-6 h-24 w-24 rounded-full bg-[#ffe7a3]" />
          </div>

          {/* Clouds, leaf and sparks */}
          <Cloud data-dl="deco" className="absolute left-[4%] top-[60%] w-20 text-white" />
          <Cloud data-dl="deco" className="absolute right-[2%] top-[6%] w-16 text-white" />
          <svg data-dl="deco" viewBox="0 0 40 40" aria-hidden="true" className="absolute right-[18%] top-[2%] h-9 w-9 text-gold-dark">
            <g stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
              <line x1="10" y1="22" x2="22" y2="6" />
              <line x1="12" y1="30" x2="34" y2="24" />
            </g>
          </svg>

          {/* Dashed route to the map pin (right) */}
          <svg viewBox="0 0 160 220" aria-hidden="true" className="absolute bottom-[4%] right-[-2%] hidden h-[220px] w-[160px] sm:block">
            <path
              data-dl="route"
              d="M20 200 C 70 210, 120 180, 110 140 S 60 90, 110 60"
              fill="none"
              stroke="var(--color-gold-dark)"
              strokeWidth="3"
              strokeDasharray="6 8"
              strokeLinecap="round"
              style={{ strokeDashoffset: 0 }}
            />
          </svg>
          <MapPin
            data-dl="deco"
            aria-hidden="true"
            className="absolute right-[3%] top-[18%] hidden h-12 w-12 fill-gold text-gold-dark sm:block"
            strokeWidth={1.8}
          />

          {/* The phone */}
          <div
            data-dl="phone"
            aria-hidden="true"
            className="absolute left-1/2 top-0 w-[220px] -translate-x-1/2 rotate-[6deg] rounded-[2.4rem] bg-ink p-2 shadow-[0_40px_70px_rgba(79,54,10,0.35)] sm:w-[240px]"
          >
            <div className="relative overflow-hidden rounded-[2rem] bg-[#fffaf1]">
              {/* Notch */}
              <span className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />

              <div className="px-4 pb-3 pt-10">
                <p className="flex items-center gap-1.5 text-[11px] font-extrabold">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-gold text-on-gold">
                    <ChefHat size={12} />
                  </span>
                  Food Munch
                </p>

                <p className="mt-5 flex items-center gap-1.5 text-[13px] font-bold">
                  <MapPin size={15} className="text-gold-dark" fill="currentColor" stroke="white" />
                  Your order is on the way
                </p>

                {/* Progress */}
                <div className="relative mt-4">
                  <span className="block h-1.5 rounded-full bg-[#eee2c8]" />
                  <span data-dl="progress" className="absolute left-0 top-0 block h-1.5 w-1/2 rounded-full bg-gold" />
                  <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between">
                    {phoneSteps.map((step, i) => (
                      <span
                        key={step}
                        data-dl="dot"
                        className={`h-3.5 w-3.5 rounded-full border-2 border-white ${i < 2 ? 'bg-gold' : 'bg-[#e2d4b5]'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-[9px] font-medium text-muted">
                  {phoneSteps.map((step) => (
                    <span key={step}>{step}</span>
                  ))}
                </div>
              </div>

              <img
                src="/images/why-biryani.jpg"
                alt=""
                width={1400}
                height={1050}
                loading="lazy"
                className="mt-2 aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>

          {/* Card: payment options (left) */}
          <div data-dl="float" className={`${floatCard} left-[-2%] top-[46%] w-[13.5rem] p-4 sm:left-[-6%] sm:top-[34%]`}>
            <p className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold text-ink">
                <CreditCard size={20} aria-hidden="true" />
              </span>
              <span className="text-[15px] font-bold leading-tight">Payment options</span>
            </p>
            <p className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-lg bg-cream-deep px-2.5 py-1.5">UPI (demo)</span>
              <span className="rounded-lg bg-ink px-2.5 py-1.5 text-white">COD</span>
            </p>
          </div>

          {/* Card: order tracking (right) */}
          <div data-dl="float" className={`${floatCard} bottom-[12%] right-[0%] flex items-center gap-3 px-4 py-3 sm:right-[6%]`}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold text-ink">
              <Truck size={20} aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold">Order tracking</span>
              <span className="mt-0.5 block text-xs text-muted">Simulated timeline</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Cloud({ className, ...rest }: { className: string; 'data-dl'?: string }) {
  return (
    <svg viewBox="0 0 64 32" aria-hidden="true" className={className} {...rest}>
      <path
        d="M14 30h38a10 10 0 0 0 0-20 14 14 0 0 0-26-2A11 11 0 0 0 14 30Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  )
}
