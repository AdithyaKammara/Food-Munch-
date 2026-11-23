import { useReveal } from '../../lib/useReveal'
import TornEdge from '../brand/TornEdge'
import SectionHeading, { Accent } from '../ui/SectionHeading'
import FeatureRow from './FeatureRow'

/**
 * The story photo (owner decision D3): a freely licensed Commons photo the owner chose on
 * 2026-11-22. CC BY-SA 4.0 asks for the author, the source and the licence, shown under the
 * photo and in the footer's Photo Credits. The two sizes are resized copies (the only change).
 */
const PHOTO = {
  src: '/images/story-charminar-1000.jpg',
  srcSet: '/images/story-charminar-800.jpg 800w, /images/story-charminar-1000.jpg 1000w',
  sizes: '(min-width: 1024px) 50vw, 100vw',
  width: 1000,
  height: 1333,
  alt: 'The Charminar in Hyderabad at dusk, with the stalls of Laad Bazaar lit up at its foot',
  credit: {
    author: 'Theanjalivarma',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Charminar-Hyderabad-Telangana-001.jpg',
  },
}

/**
 * "Our story" (component-guidelines.md §12): the photo in a torn frame on the left, the story and
 * the four features on the right. Below 1024 the photo sits above the text.
 * The copy is honest about what the site is (owner decision D2).
 */
export default function StorySection() {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      id="about"
      tabIndex={-1}
      aria-labelledby="story-heading"
      className="px-4 py-12 outline-none sm:px-6 md:py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto grid max-w-[77.5rem] gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <figure data-reveal="image" className="-mx-4 sm:-mx-6 lg:mx-0 lg:flex lg:h-full lg:flex-col">
          <TornEdge side="top" lgSide="right" className="aspect-[4/3] overflow-hidden bg-cream-300 lg:aspect-auto lg:min-h-[34rem] lg:flex-1">
            <img
              src={PHOTO.src}
              srcSet={PHOTO.srcSet}
              sizes={PHOTO.sizes}
              alt={PHOTO.alt}
              width={PHOTO.width}
              height={PHOTO.height}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-[50%_18%]"
            />
          </TornEdge>
          <figcaption className="mt-2 px-4 text-caption text-ink-600 sm:px-6 lg:px-0">
            Photo:{' '}
            <a href={PHOTO.credit.source} className="underline underline-offset-2 hover:text-copper-700">
              {PHOTO.credit.author}
            </a>
            , Wikimedia Commons,{' '}
            <a href={PHOTO.credit.licenceUrl} className="underline underline-offset-2 hover:text-copper-700">
              {PHOTO.credit.licence}
            </a>
            , resized
          </figcaption>
        </figure>

        <div>
          <div data-reveal>
            <SectionHeading label="Our story" id="story-heading">
              The taste of <Accent>Hyderabad,</Accent>
              <br className="max-sm:hidden" /> now at your doorstep.
            </SectionHeading>
            <p className="mt-5 max-w-[34rem] text-body-lg text-ink-600">
              Food Munch puts the city&apos;s best-loved dishes on one menu: dum biryanis, Chicken 65,
              slow-cooked curries and gulab jamun, made the way Hyderabad likes them.
            </p>
            <p className="mt-3 max-w-[34rem] text-ink-600">
              It is a demo restaurant, built as a portfolio project. The menu, cart and checkout all
              work, but no real orders are cooked or delivered.
            </p>
          </div>

          <FeatureRow />
        </div>
      </div>
    </section>
  )
}
