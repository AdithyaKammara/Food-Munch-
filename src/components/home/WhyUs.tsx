import { useReveal } from '../../lib/useReveal'

const points = [
  {
    title: 'Fresh ingredients',
    text: 'Vegetables, herbs and meat come in fresh and are cooked the same day, never reheated from yesterday.',
  },
  {
    title: 'Hyderabadi recipes',
    text: 'Kacchi dum biryani sealed and slow-cooked, mirchi ka salan, double-tempered dal. Cooked the way the city cooks them.',
  },
  {
    title: 'A clean kitchen',
    text: 'Careful food handling, covered prep stations and sealed packaging from our counter to your door.',
  },
  {
    title: 'Made to taste right',
    text: 'You choose the portion, the spice level and the extras, so every dish arrives the way you like it.',
  },
]

export default function WhyUs() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} id="why-us" className="scroll-mt-16 bg-ink py-24 text-white md:py-36">
      <div className="frame grid gap-14 lg:grid-cols-12 lg:gap-10">
        <figure data-reveal className="lg:col-span-5">
          <img
            src="/images/spice-bowls.jpg"
            alt="Rows of steel bowls filled with whole and ground spices, in front of a wooden door"
            width={1000}
            height={1250}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
          <figcaption className="mt-3 text-sm text-white/60">
            Whole and ground spices: the base of every Hyderabadi masala.
          </figcaption>
        </figure>

        <div className="lg:col-span-7 lg:pl-8 lg:pt-4">
          <h2 data-reveal className="display text-[clamp(2.5rem,6vw,5.5rem)]">
            Cooked the Hyderabadi&nbsp;way
          </h2>
          <p data-reveal className="mt-8 max-w-2xl text-xl leading-relaxed text-white/90 md:text-2xl">
            Food Munch is a small kitchen with one rule: cook it properly, then get it to you while
            it is still hot.
          </p>

          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point.title} data-reveal>
                <h3 className="text-2xl font-bold text-gold">{point.title}</h3>
                <p className="mt-3 text-[17px] leading-relaxed text-white/85">{point.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
