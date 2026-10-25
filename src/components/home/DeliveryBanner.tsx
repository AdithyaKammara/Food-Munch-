import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { buildDeliverySlots, TRACKING_STEPS } from '../../lib/orders'
import { useReveal } from '../../lib/useReveal'

const facts = [
  {
    value: '~22 min',
    title: 'Quick delivery',
    text: 'The demo estimate for an order placed now. Real times depend on distance and traffic.',
  },
  {
    value: 'UPI or cash',
    title: 'Flexible payment',
    text: 'Pay with a UPI QR (a demo here, so no money moves) or in cash at the door.',
  },
  {
    value: `${TRACKING_STEPS.length} steps`,
    title: 'Order tracking',
    text: 'Follow your order from confirmed to delivered. The timeline is simulated, with no live GPS.',
  },
]

export default function DeliveryBanner() {
  const ref = useReveal<HTMLElement>()
  // Real slots, worked out from the time you opened the page.
  const [slots] = useState(() => buildDeliverySlots(new Date()))

  return (
    <section ref={ref} id="delivery" className="scroll-mt-16 bg-gold py-24 text-on-gold md:py-36">
      <div className="frame">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 data-reveal className="display text-[clamp(2.75rem,7.4vw,7rem)]">
              Fast delivery, easy payment
            </h2>
          </div>
          <div data-reveal className="lg:col-span-4 lg:pb-3">
            <p className="text-xl leading-relaxed">
              Order in a few taps, pay how you like, and watch your meal leave the kitchen.
            </p>
            <a
              href="#menu"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-bold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start your order
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>

        <ul className="mt-20 grid gap-12 md:grid-cols-3 md:gap-10">
          {facts.map((fact) => (
            <li key={fact.title} data-reveal>
              <p className="display text-[clamp(2.25rem,4vw,3.5rem)]">{fact.value}</p>
              <h3 className="mt-4 text-xl font-bold">{fact.title}</h3>
              <p className="mt-2 max-w-sm text-[17px] leading-relaxed">{fact.text}</p>
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-20 grid gap-8 bg-ink p-8 text-white md:p-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="text-3xl font-extrabold">Next delivery slots</h3>
            <p className="mt-3 text-white/80">
              Worked out from the time you opened this page. You choose one at checkout.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {slots.map((slot, i) => (
              <li
                key={slot}
                className={`px-5 py-4 text-lg font-semibold ${
                  i === 0 ? 'bg-gold text-on-gold' : 'bg-ink-soft'
                }`}
              >
                {slot}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
