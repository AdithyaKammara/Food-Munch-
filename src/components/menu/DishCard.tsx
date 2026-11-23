import { useEffect, useRef, useState } from 'react'
import { Check, Heart, Plus, Star, Utensils } from 'lucide-react'
import { clsx } from 'clsx'
import type { MenuItem } from '../../data/menu'
import { pop } from '../../lib/motion'
import { useFavoritesStore } from '../../store/favoritesStore'
import { buttonClasses } from '../ui/buttonClasses'
import Price from '../ui/Price'

interface Props {
  item: MenuItem
  /** `origin` is the pressed button, where the cart dot starts its flight. */
  onAdd: (item: MenuItem, origin: HTMLElement) => void
}

/**
 * A dish in the rail (component-guidelines.md §9): photo with the rating and favourite button,
 * veg marker and name, a two-line description, then the price and "+ Add".
 * `id="dish-{id}"` is an anchor target; `data-id` lets the rail animate cards that appear.
 */
export default function DishCard({ item, onAdd }: Props) {
  const isFav = useFavoritesStore((s) => s.ids.includes(item.id))
  const toggleFav = useFavoritesStore((s) => s.toggle)
  const [imgFailed, setImgFailed] = useState(false)
  const heartRef = useRef<SVGSVGElement>(null)

  // A short "Added" state, only for dishes that go straight into the cart
  // (dishes with options open the customise dialog first, so nothing is added yet).
  const [added, setAdded] = useState(false)
  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 1400)
    return () => clearTimeout(timer)
  }, [added])

  return (
    <article
      id={`dish-${item.id}`}
      data-id={item.id}
      className="group flex h-full scroll-mt-32 flex-col overflow-hidden rounded-md bg-cream-50 shadow-card ring-1 ring-line-200 transition-shadow duration-300 hover:shadow-lift"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-300">
        {imgFailed ? (
          <div className="absolute inset-0 grid place-items-center text-copper-500">
            <Utensils size={36} aria-hidden="true" />
          </div>
        ) : (
          <img
            src={item.image}
            alt=""
            width={600}
            height={450}
            loading="lazy"
            onError={() => setImgFailed(true)}
            // Fades in over its cream placeholder once loaded (animation-guidelines.md §12)
            ref={(el) => {
              if (el?.complete) el.dataset.loaded = ''
            }}
            onLoad={(e) => {
              e.currentTarget.dataset.loaded = ''
            }}
            className="img-fade absolute inset-0 size-full object-cover motion-safe:transition-[scale,rotate,opacity] motion-safe:duration-[400ms] motion-safe:group-hover:scale-[1.04]"
          />
        )}

        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-cream-50/92 px-2.5 py-1 text-sm font-semibold text-ink-900 shadow-sm">
          <Star size={14} aria-hidden="true" className="fill-star text-star" />
          {item.rating.toFixed(1)}
          <span className="sr-only">out of 5 (demo rating)</span>
        </span>

        <button
          type="button"
          aria-pressed={isFav}
          aria-label={`Favourite ${item.title}`}
          onClick={() => {
            toggleFav(item.id)
            pop(heartRef.current, 1.35)
          }}
          className="absolute right-2 top-2 grid size-11 place-items-center rounded-full bg-cream-50/92 shadow-sm transition-colors hover:bg-cream-50 motion-safe:active:scale-94"
        >
          <Heart
            ref={heartRef}
            size={18}
            aria-hidden="true"
            fill={isFav ? 'currentColor' : 'none'}
            className={isFav ? 'text-nonveg' : 'text-ink-900'}
          />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-2">
          <span
            role="img"
            aria-label={item.veg ? 'Vegetarian' : 'Non-vegetarian'}
            className={clsx(
              'mt-1 grid size-4 shrink-0 place-items-center rounded-[4px] border-2',
              item.veg ? 'border-veg' : 'border-nonveg',
            )}
          >
            <span className={clsx('size-1.5 rounded-full', item.veg ? 'bg-veg' : 'bg-nonveg')} />
          </span>
          <h3 className="min-w-0 text-balance font-display text-title font-semibold text-ink-900">{item.title}</h3>
        </div>

        <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-ink-600">{item.desc}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <Price amount={item.price} className="text-price text-ink-900" />
          <button
            type="button"
            onClick={(e) => {
              onAdd(item, e.currentTarget)
              if (!item.customizable) setAdded(true)
            }}
            aria-label={`Add ${item.title} to cart`}
            className={clsx(
              buttonClasses('secondary', 'md', 'h-11 min-w-[5.75rem] px-4 text-[0.9375rem]'),
              added && 'border-forest-800 bg-forest-800 text-cream-50 hover:bg-forest-800',
            )}
          >
            {added ? (
              <>
                <Check size={16} aria-hidden="true" strokeWidth={3} className="motion-pop" />
                Added
              </>
            ) : (
              <>
                <Plus size={16} aria-hidden="true" strokeWidth={2.5} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
