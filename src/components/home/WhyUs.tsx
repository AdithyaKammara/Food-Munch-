import { ChefHat, Heart, Leaf, ShieldCheck } from 'lucide-react'
import { useReveal } from '../../lib/useReveal'

const features = [
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    text: 'We cook with fresh ingredients for a tasty, wholesome meal.',
  },
  {
    icon: ChefHat,
    title: 'Expert Chefs',
    text: 'Authentic Hyderabadi recipes, prepared with care in our kitchen.',
  },
  {
    icon: ShieldCheck,
    title: 'Hygienic & Safe',
    text: 'Clean kitchen practices and careful food handling.',
  },
  {
    icon: Heart,
    title: 'Great Taste',
    text: 'Every dish is made with love to satisfy your cravings.',
  },
]

export default function WhyUs() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} id="why-us" className="scroll-mt-20 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div data-reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-text">Why choose us?</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">More Than Just Food</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            We are committed to serving you the best food with quality ingredients and
            unforgettable flavours.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              data-reveal
              className="rounded-2xl border border-line bg-surface p-6 text-center shadow-card"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cream-deep text-gold-dark">
                <Icon size={26} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}