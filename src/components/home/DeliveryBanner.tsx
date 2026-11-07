import { useRef } from 'react'
import { Bike, CreditCard, MapPin, Truck } from 'lucide-react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useReveal } from '../../lib/useReveal'

/** The pinned scroll needs a wide, tall screen. Everything else gets the plain layout. */
const CINEMATIC = '(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 640px)'
const PLAIN_WITH_MOTION =
  '(prefers-reduced-motion: no-preference) and (max-width: 1023.98px), (prefers-reduced-motion: no-preference) and (max-height: 639.98px)'

/** How far the visitor scrolls while the section stays pinned (px). */
const PIN_DISTANCE = 1300

/** Keeps the badges in front of the phone when it tilts toward the pointer (px). */
const BADGE_DEPTH = 60

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

const badge = 'absolute z-20 hidden items-center gap-3 rounded-2xl bg-surface p-3 text-ink shadow-dialog sm:flex'

export default function DeliveryBanner() {
  const sectionRef = useReveal<HTMLElement>(PLAIN_WITH_MOTION)
  const stageRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useGSAP(
    () => {
      const stage = stageRef.current
      const card = cardRef.current
      const phone = phoneRef.current
      const cta = ctaRef.current
      if (!stage || !card || !phone || !cta) return

      const mm = gsap.matchMedia()
      mm.add(
        CINEMATIC,
        () => {
          stage.classList.add('is-cinematic')

          // Text fades with opacity, not visibility, so screen readers can always reach it.
          gsap.set('[data-dl="outro"]', { opacity: 0, scale: 0.92 })
          gsap.set(card, { yPercent: 105, clipPath: 'inset(7% 6% 7% 6% round 40px)' })
          gsap.set(['[data-dl="copy"]', '[data-dl="feature"]'], { opacity: 0 })

          // The headline plays once as the section arrives.
          gsap
            .timeline({ scrollTrigger: { trigger: stage, start: 'top 65%', once: true } })
            .from('[data-dl="line-1"]', { opacity: 0, y: 40, scale: 0.94, duration: 1, ease: 'expo.out' })
            .from(
              '[data-dl="line-2"]',
              { clipPath: 'inset(-20% 100% -20% 0%)', duration: 0.9, ease: 'power4.inOut', clearProps: 'clipPath' },
              0.35,
            )

          const timeline = gsap.timeline({
            defaults: { ease: 'power2.out' },
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: `+=${PIN_DISTANCE}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })

          timeline
            // The card rises over the headline, then opens to fill the screen.
            .to('[data-dl="intro"]', { scale: 1.08, opacity: 0.15, filter: 'blur(8px)', duration: 2, ease: 'power2.inOut' }, 0)
            .to(card, { yPercent: 0, duration: 2, ease: 'power3.inOut' }, 0)
            .to(card, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.2, ease: 'power3.inOut' })
            // The phone swings in, showing the real tracking screen.
            .fromTo(
              '[data-dl="phone-wrap"]',
              { y: 220, z: -400, rotationX: 40, rotationY: -24, opacity: 0, scale: 0.7 },
              { y: 0, z: 0, rotationX: 0, rotationY: 0, opacity: 1, scale: 1, duration: 2, ease: 'expo.out' },
              '-=0.7',
            )
            .fromTo('[data-dl="badge"]', { y: 60, z: BADGE_DEPTH, opacity: 0, scale: 0.8 }, { y: 0, z: BADGE_DEPTH, opacity: 1, scale: 1, stagger: 0.2, duration: 1, ease: 'back.out(1.5)' }, '-=1.2')
            .fromTo('[data-dl="copy"]', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, '-=1.2')
            .fromTo('[data-dl="feature"]', { x: 40, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.15, duration: 0.9 }, '<')
            // A moment to read, then the card leaves and the call to action is underneath.
            .to({}, { duration: 1.6 })
            .set('[data-dl="intro"]', { opacity: 0 })
            .to(card, { clipPath: 'inset(7% 6% 7% 6% round 40px)', duration: 1, ease: 'power3.inOut' })
            .to(card, { yPercent: -110, duration: 1.2, ease: 'power3.in' })
            .to('[data-dl="outro"]', { opacity: 1, scale: 1, duration: 1 }, '-=0.6')

          // A keyboard visitor tabbing to the button is taken to where it is visible.
          const showCta = () => {
            const trigger = timeline.scrollTrigger
            if (trigger && trigger.progress < 1) window.scrollTo({ top: trigger.end })
          }
          cta.addEventListener('focus', showCta)

          // The phone leans toward the pointer, and the sheen follows it.
          const tiltX = gsap.quickTo(phone, 'rotationX', { duration: 1, ease: 'power3.out' })
          const tiltY = gsap.quickTo(phone, 'rotationY', { duration: 1, ease: 'power3.out' })
          const onPointerMove = (event: PointerEvent) => {
            const rect = card.getBoundingClientRect()
            card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`)
            card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`)
            tiltY((event.clientX / window.innerWidth - 0.5) * 16)
            tiltX((event.clientY / window.innerHeight - 0.5) * -16)
          }
          stage.addEventListener('pointermove', onPointerMove)

          return () => {
            stage.removeEventListener('pointermove', onPointerMove)
            cta.removeEventListener('focus', showCta)
            stage.classList.remove('is-cinematic')
          }
        },
        stage,
      )
      return () => mm.revert()
    },
    { scope: stageRef },
  )

  return (
    <section ref={sectionRef} id="delivery">
      <div ref={stageRef} className="dl-stage bg-cream px-4 py-16 sm:px-6 md:py-20">
        {/* ---------- Headline ---------- */}
        <div data-dl="intro" className="dl-intro text-center">
          <h2 data-reveal className="mx-auto max-w-5xl font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-7xl">
            <span data-dl="line-1" className="block">Your favourite food,</span>
            <span data-dl="line-2" className="block">now closer than ever.</span>
          </h2>
        </div>

        {/* ---------- The card ---------- */}
        <div ref={cardRef} className="dl-card relative mx-auto mt-10 max-w-7xl overflow-hidden rounded-[2rem] text-cream">
          <div aria-hidden="true" className="dl-sheen" />

          <div className="dl-grid relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_22rem_minmax(0,1fr)] lg:gap-8 lg:px-12">
            <div data-dl="copy" data-reveal>
              <h3 className="font-display text-3xl font-extrabold leading-tight tracking-[-0.03em] [text-wrap:balance] lg:text-4xl">
                From our kitchen to your door.
              </h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-on-roast-muted">
                Pick a dish, pay by UPI or cash, and follow your order from the kitchen to your door.
              </p>
            </div>

            {/* The phone is decoration: everything it shows is also in the text around it. */}
            <div className="[perspective:1000px]" aria-hidden="true">
              <div data-dl="phone-wrap" data-reveal className="dl-phone-fit relative mx-auto h-[500px] w-[250px] [transform-style:preserve-3d]">
                <div ref={phoneRef} className="h-full w-full rounded-[2.6rem] bg-ink p-2 shadow-dialog ring-1 ring-white/15">
                  <div className="relative h-full overflow-hidden rounded-[2.1rem] bg-surface">
                    <img
                      src="/images/tracking-screen.jpg"
                      alt=""
                      width={656}
                      height={1271}
                      loading="lazy"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>

                <div data-dl="badge" className={`${badge} -left-28 top-24`}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-on-gold">
                    <CreditCard size={18} />
                  </span>
                  <span className="text-xs font-bold leading-snug">
                    UPI (demo)
                    <br />
                    or COD
                  </span>
                </div>

                <div data-dl="badge" className={`${badge} -right-28 bottom-4`}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-on-gold">
                    <Truck size={18} />
                  </span>
                  <span className="text-xs font-bold leading-snug">
                    Order tracking
                    <span className="block font-medium text-muted">Simulated timeline</span>
                  </span>
                </div>
              </div>
            </div>

            <ul className="space-y-6 lg:justify-self-end">
              {features.map(({ icon: Icon, title, text }) => (
                <li key={title} data-dl="feature" data-reveal className="flex items-start gap-3">
                  <Icon size={22} aria-hidden="true" className="mt-0.5 shrink-0 text-gold" />
                  <div>
                    <h4 className="font-bold leading-snug">{title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-on-roast-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- Call to action ---------- */}
        <div data-dl="outro" className="dl-outro mt-12 text-center">
          <div data-reveal>
            <h3 className="font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">Hungry yet?</h3>
            <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted">
              Pick a dish and the rest is taken care of.
            </p>
            <a
              ref={ctaRef}
              href="#menu"
              className="mt-8 inline-flex items-center rounded-full bg-gold px-8 py-4 font-bold text-on-gold shadow-gold transition-[translate] hover:-translate-y-0.5 focus-visible:outline-ink active:translate-y-0"
            >
              Start your order
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
