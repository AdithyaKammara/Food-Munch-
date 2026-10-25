import { useState } from 'react'
import { Clock, Heart, Star, Utensils } from 'lucide-react'
import type { MenuItem } from '../../data/menu'
import { useFavoritesStore } from '../../store/favoritesStore'

interface Props {
  item: MenuItem
  onAdd: (item: MenuItem) => void
}

export default function DishCard({ item, onAdd }: Props) {
  const isFav = useFavoritesStore((s) => s.ids.includes(item.id))
  const toggleFav = useFavoritesStore((s) => s.toggle)
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-shadow hover:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-deep">
        {imgFailed ? (
          <div className="absolute inset-0 grid place-items-center text-gold-dark">
            <Utensils size={36} aria-hidden="true" />
          </div>
        ) : (
          <img
            src={item.image}
            alt={item.title}
            width={600}
            height={450}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold shadow-card">
          {item.ribbon}
        </span>

        <button
          type="button"
          aria-pressed={isFav}
          aria-label={isFav ? `Remove ${item.title} from favourites` : `Add ${item.title} to favourites`}
          onClick={() => toggleFav(item.id)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-card hover:scale-105"
        >
          <Heart
            size={18}
            aria-hidden="true"
            fill={isFav ? 'currentColor' : 'none'}
            className={isFav ? 'text-red-600' : 'text-ink'}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-2">
          <span
            role="img"
            aria-label={item.veg ? 'Vegetarian' : 'Non-vegetarian'}
            className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-sm border-2 ${
              item.veg ? 'border-green-700' : 'border-red-700'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${item.veg ? 'bg-green-700' : 'bg-red-700'}`} />
          </span>
          <h3 className="text-lg font-bold leading-snug">{item.title}</h3>
        </div>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted">{item.desc}</p>

        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Star size={14} aria-hidden="true" className="fill-gold text-gold" />
            {item.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={14} aria-hidden="true" />
            {item.prepTime} min
          </span>
          <span>
            {item.calories} kcal · {item.protein}g protein
          </span>
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-display text-xl font-extrabold">₹{item.price}</span>
          <button
            type="button"
            onClick={() => onAdd(item)}
            aria-label={`Add ${item.title} to cart`}
            className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-on-gold hover:shadow-card"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}