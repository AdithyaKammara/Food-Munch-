import { useState } from 'react'
import {
  Award,
  ChefHat,
  Clock,
  Coffee,
  Crown,
  Flame,
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
import { useFavoritesStore } from '../../store/favoritesStore'

interface Props {
  item: MenuItem
  onAdd: (item: MenuItem) => void
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

export default function DishCard({ item, onAdd }: Props) {
  const isFav = useFavoritesStore((s) => s.ids.includes(item.id))
  const toggleFav = useFavoritesStore((s) => s.toggle)
  const [imgFailed, setImgFailed] = useState(false)
  const badge = badgeFor(item.ribbon)
  const BadgeIcon = badge.icon

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-[0_6px_20px_rgba(79,54,10,0.07)] ring-1 ring-[#f1e6cf] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(79,54,10,0.14)]">
      {/* Photo */}
      <div className="relative aspect-[16/10] overflow-hidden bg-cream-deep">
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

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-ink shadow-sm">
          <BadgeIcon size={14} aria-hidden="true" className={badge.tone} fill={BadgeIcon === Crown ? 'currentColor' : 'none'} />
          {badge.label}
        </span>

        <button
          type="button"
          aria-pressed={isFav}
          aria-label={isFav ? `Remove ${item.title} from favourites` : `Add ${item.title} to favourites`}
          onClick={() => toggleFav(item.id)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm transition-transform hover:scale-110 active:scale-95"
        >
          <Heart
            size={18}
            aria-hidden="true"
            fill={isFav ? 'currentColor' : 'none'}
            className={isFav ? 'text-red-600' : 'text-ink'}
          />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
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
          <h3 className="truncate text-[17px] font-bold leading-snug">{item.title}</h3>
        </div>

        <p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-5 text-muted">{item.desc}</p>

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

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="font-display text-[22px] font-extrabold">₹{item.price}</span>
          <button
            type="button"
            onClick={() => onAdd(item)}
            aria-label={`Add ${item.title} to cart`}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-on-gold transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
          >
            <ShoppingCart size={16} aria-hidden="true" />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}
