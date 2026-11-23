import { Bike, MapPin, ShieldCheck, Wallet, type LucideIcon } from 'lucide-react'
import { DELIVERY_FACTS } from '../../data/facts'

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Bike, title: 'Quick delivery', text: DELIVERY_FACTS.time },
  { icon: ShieldCheck, title: 'Quality checked', text: 'Every dish is cooked to one tested house recipe.' },
  { icon: MapPin, title: 'Order tracking', text: DELIVERY_FACTS.tracking },
  { icon: Wallet, title: 'Easy payment', text: DELIVERY_FACTS.payment },
]

// A hairline between the two columns, from 480px. The story's text column is half the page,
// too narrow for four across without the titles breaking, so it stays a 2×2 grid.
const DIVIDERS = ['', 'min-[480px]:border-l min-[480px]:border-line-200 min-[480px]:pl-6']

/**
 * Four honest features (component-guidelines.md §12; implementation-plan.md C6): a 2×2 grid with a
 * hairline between the columns, one column under 480. Icon beside the words. The delivery facts come
 * from one shared source, so this row and the Delivery & Payment section always say the same.
 */
export default function FeatureRow() {
  return (
    <ul className="mt-8 grid gap-y-7 min-[480px]:grid-cols-2 lg:mt-10">
      {FEATURES.map(({ icon: Icon, title, text }, i) => (
        <li
          key={title}
          data-reveal
          className={`flex gap-4 pr-4 ${DIVIDERS[i % 2]}`}
        >
          <span className="grid size-14 shrink-0 place-items-center rounded-sm bg-cream-300 text-copper-600">
            <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-title font-semibold text-ink-900">{title}</h3>
            <p className="mt-1 text-sm leading-5 text-ink-600">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
