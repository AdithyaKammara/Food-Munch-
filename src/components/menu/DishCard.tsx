import { useEffect, useRef, useState } from 'react'
import {
  Award,
  ChefHat,
  Clock,
  Coffee,
  Crown,
  Flame,
  Check,
  Heart,
  Leaf,
  ShoppingCart,
  Snowflake,
  Sparkles,
  Star,
  Utensils,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { MenuItem } from '../../data/menu'
import { pop } from '../../lib/motion'
import { useFavoritesStore } from '../../store/favoritesStore'

interface Props {
  item: MenuItem
  onAdd: (item: MenuItem) => void
  /** Leads its course as a wide card. */
  featured?: boolean
}

/**
 * The menu data stores tags like "🔥 Bestseller". Emoji render differently on every device,
 * so the card shows the words with a matching icon instead.
 */
function badgeFor(ribbon: string): { label: string; icon: LucideIcon; tone: string } {
  const label = ribbon.replace(/^[^\p{L}\p{N}#]+/u, '').trim()
  const text = label.toLowerCase()
  if (text.includes('spicy') || text.includes('hot')) return { label, icon: Flame, tone: 'text-red-600' }
  if (/\d+\s*min/.test(text)) return { label, icon: Clock, tone: 'text-ink' }
  if (text.includes('chef')) return { label, icon: ChefHat, tone: 'text-gold-dark' }
  if (text.includes('#1') || text.includes('ordered') || text.includes('bestseller'))
    return { label, icon: Crown, tone: 'text-gold-dark' }
  if (text.includes('aromatic') || text.includes('fresh')) return { label, icon: Leaf, tone: 'text-green-700' }
  if (text.includes('comfort')) return { label, icon: Award, tone: 'text-gold-dark' }
  if (text.includes('refresh')) return { label, icon: Snowflake, tone: 'text-sky-600' }
  if (text.includes('coffee')) return { label, icon: Coffee, tone: 'text-amber-800' }
  if (text.includes('must') || text.includes('seasonal')) return { label, icon: Sparkles, tone: 'text-gold-dark' }
  return { label, icon: Zap, tone: 'text-gold-dark' }
}

export default function DishCard({ item, onAdd, featured = false }: Props) {
  const isFav = useFavoritesStore((s) => s.ids.includes(item.id))
  const toggleFav = useFavoritesStore((s) => s.toggle)
  const [imgFailed, setImgFailed] = useState(false)
  const badge = badgeFor(item.ribbon)
  // A badge on every dish means nothing, so only the true headliners keep theirs.
  const showBadge = /#1|chef|bestseller/i.test(item.ribbon)
  const BadgeIcon = badge.icon

  const heartRef = useRef<SVGSVGElement>(null)
  // Brief "Added" state on the button, only for dishes that go straight into the bag
  // (dishes with options open the customise dialog first, so nothing is added yet).
  const [added, setAdded] = useState(false)
  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 1400)
    return () => clearTimeout(timer)
  }, [added])

  return (
    <article data-reveal
      id={`dish-${item.id}`}
      data-id={item.id}
      className={`group flex h-full scroll-mt-8 flex-row overflow-hidden ${featured ? 'sm:col-span-2 lg:col-span-3' : 'sm:flex-col'} rounded-2xl bg-surface shadow-card ring-1 ring-line transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift`}>
      {/* Photo */}
      <div className={`relative w-28 shrink-0 overflow-hidden bg-cream-deep ${featured ? 'sm:min-h-72 sm:w-1/2' : 'sm:aspect-[16/10] sm:w-auto'}`}>
        {imgFailed ? (
          <div className="absolute inset-0 grid place-items-center text-gold-dark">
            <Utensils size={36} aria-hidden="true" />
          </div>
        ) : (
          <img
            src={item.image}
            alt={item.title}
            width={600}
            height={375}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {showBadge && (
          <span className="absolute left-3 top-3 hidden items-center gap-1.5 rounded-full bg-white sm:inline-flex px-3 py-1 text-xs font-bold text-ink shadow-sm">
          <BadgeIcon size={14} aria-hidden="true" className={badge.tone} fill={BadgeIcon === Crown ? 'currentColor' : 'none'} />
          {badge.label}
        </span>
        )}

        <button
          type="button"
          aria-pressed={isFav}
          aria-label={isFav ? `Remove ${item.title} from favourites` : `Add ${item.title} to favourites`}
          onClick={() => {
            toggleFav(item.id)
            pop(heartRef.current, 1.35)
          }}
          className="absolute left-1 top-1 grid h-11 w-11 place-items-center rounded-full bg-white sm:left-auto sm:right-2 sm:top-2 shadow-sm transition-transform hover:scale-110 active:scale-95"
        >
          <Heart
            ref={heartRef}
            size={18}
            aria-hidden="true"
            fill={isFav ? 'currentColor' : 'none'}
            className={isFav ? 'text-red-600' : 'text-ink'}
          />
        </button>
      </div>

      {/* Details */}
      <div className={`flex min-w-0 flex-1 flex-col px-3 py-3 ${featured ? 'sm:p-8' : 'sm:px-4 sm:pb-4 sm:pt-3.5'}`}>
        <div className="flex items-center gap-2">
          <span
            role="img"
            aria-label={item.veg ? 'Vegetarian' : 'Non-vegetarian'}
            className={`grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border-2 ${
              item.veg ? 'border-green-700' : 'border-red-600'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${item.veg ? 'bg-green-700' : 'bg-red-600'}`} />
          </span>
          <h4 className={`min-w-0 text-base font-bold leading-snug ${featured ? 'sm:text-3xl' : 'sm:truncate sm:text-[17px]'}`}>{item.title}</h4>
        </div>

        <p className={`mt-1.5 text-muted max-sm:hidden ${featured ? 'text-base leading-relaxed' : 'line-clamp-2 min-h-10 text-sm leading-5'}`}>{item.desc}</p>

        <p className="mt-2.5 flex flex-wrap items-center gap-y-1 text-[13px] text-muted">
          <span className="inline-flex items-center gap-1 font-semibold text-ink">
            <Star size={14} aria-hidden="true" className="fill-gold text-gold" />
            {item.rating.toFixed(1)}
            <span className="sr-only">out of 5</span>
          </span>
          <span aria-hidden="true" className="mx-2.5 h-3.5 w-px bg-line" />
          <span className="inline-flex items-center gap-1">
            <Clock size={14} aria-hidden="true" />
            {item.prepTime} min
          </span>
          <span aria-hidden="true" className="mx-2.5 h-3.5 w-px bg-line" />
          <span>{item.calories} kcal</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 sm:gap-3 sm:pt-4">
          <span className="font-display text-xl font-extrabold sm:text-[22px]">₹{item.price}</span>
          <button
            type="button"
            onClick={() => {
              onAdd(item)
              if (!item.customizable) setAdded(true)
            }}
            aria-label={`Add ${item.title} to cart`}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold sm:min-w-[8.25rem] transition-[background-color,color,translate,scale] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
              added ? 'bg-ink text-white' : 'bg-gold text-on-gold'
            }`}
          >
            {added ? (
              <>
                <Check size={16} aria-hidden="true" strokeWidth={3} className="motion-pop" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart size={16} aria-hidden="true" />
                <span>Add<span className="hidden sm:inline"> to Cart</span></span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
