import { ArrowRight, MapPin, Timer, Wallet } from 'lucide-react'
import { useReveal } from '../../lib/useReveal'

const features = [
  {
    icon: Timer,
    title: 'Quick Delivery',
    text: 'About 22 minutes in this demo. Real times depend on distance and traffic.',
  },
  {
    icon: Wallet,
    title: 'Flexible Payment',
    text: 'UPI QR (demo, no money moves) or Cash on Delivery.',
  },
  {
    icon: MapPin,
    title: 'Order Tracking',
    text: 'A simulated status timeline. There is no live GPS in this demo.',
  },
]

export default function DeliveryBanner() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} id="delivery" className="scroll-mt-20 px-4 py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 overflow-hidden rounded-3xl bg-cream-deep px-6 py-12 sm:px-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div data-reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-text">
              Delivery &amp; payment
            </p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Fast Delivery, Easy Payment</h2>
            <p className="mt-3 max-w-lg text-muted">
              Order in a few taps and follow your meal from our kitchen to your door.
            </p>
          </div>

          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} data-reveal>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-surface text-gold-dark shadow-card">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-bold">{title}</h3>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </li>
            ))}
          </ul>

          <a
            data-reveal
            href="#menu"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-bold text-on-gold shadow-card hover:shadow-card-hover"
          >
            Start your order <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>

        <div data-reveal className="mx-auto w-full max-w-xs md:max-w-sm">
          <ScooterIllustration />
        </div>
      </div>
    </section>
  )
}

/** Original, decorative scooter drawing. Uses theme colours so it will follow dark mode later. */
function ScooterIllustration() {
  return (
    <svg viewBox="0 0 240 170" aria-hidden="true" className="h-auto w-full">
      {/* speed lines */}
      <g stroke="var(--color-gold-dark)" strokeWidth="5" strokeLinecap="round">
        <line x1="4" y1="78" x2="26" y2="78" />
        <line x1="10" y1="96" x2="36" y2="96" />
        <line x1="0" y1="114" x2="20" y2="114" />
      </g>
      {/* delivery box */}
      <rect x="34" y="34" width="54" height="44" rx="8" fill="var(--color-ink)" />
      <rect x="34" y="50" width="54" height="8" fill="var(--color-gold)" />
      {/* body */}
      <path d="M44 120 Q44 88 76 88 L124 88 L140 62 L154 62 L172 120 Z" fill="var(--color-gold)" />
      <rect x="74" y="112" width="90" height="10" rx="5" fill="var(--color-gold-dark)" />
      {/* seat */}
      <rect x="68" y="78" width="50" height="11" rx="5.5" fill="var(--color-ink)" />
      {/* fork and handlebar */}
      <line x1="152" y1="62" x2="188" y2="134" stroke="var(--color-ink)" strokeWidth="7" strokeLinecap="round" />
      <line x1="150" y1="62" x2="150" y2="44" stroke="var(--color-ink)" strokeWidth="6" strokeLinecap="round" />
      <line x1="138" y1="44" x2="164" y2="44" stroke="var(--color-ink)" strokeWidth="6" strokeLinecap="round" />
      {/* wheels */}
      <circle cx="64" cy="134" r="24" fill="var(--color-ink)" />
      <circle cx="64" cy="134" r="10" fill="var(--color-cream)" />
      <circle cx="188" cy="134" r="24" fill="var(--color-ink)" />
      <circle cx="188" cy="134" r="10" fill="var(--color-cream)" />
    </svg>
  )
}