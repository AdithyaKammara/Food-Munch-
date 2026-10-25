import { useState } from 'react'
import { Clock, Heart, Plus, Star, Utensils } from 'lucide-react'
import type { MenuItem } from '../../data/menu'
import { useFavoritesStore } from '../../store/favoritesStore'

/* ---------------------------------------------------------------
   The menu is set like a printed menu card: one row per dish.
   On large screens, the dish you point at (or tab to) is shown big
   in <DishSpotlight>; on phones every row carries its own photo.
---------------------------------------------------------------- */

export function VegMark({ veg }: { veg: boolean }) {
  return (
    <span
      role="img"
      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
      className={`grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border-2 ${
        veg ? 'border-green-700' : 'border-red-700'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${veg ? 'bg-green-700' : 'bg-red-700'}`} />
    </span>
  )
}

function DishPhoto({ item, className, sizes }: { item: MenuItem; className: string; sizes: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`grid place-items-center bg-cream-deep text-gold-dark ${className}`}>
        <Utensils size={32} aria-hidden="true" />
      </div>
    )
  }
  return (
    <img
      src={item.image}
      alt={item.title}
      sizes={sizes}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}

function FavouriteButton({ item }: { item: MenuItem }) {
  const isFav = useFavoritesStore((s) => s.ids.includes(item.id))
  const toggleFav = useFavoritesStore((s) => s.toggle)
  return (
    <button
      type="button"
      aria-pressed={isFav}
      aria-label={isFav ? `Remove ${item.title} from favourites` : `Add ${item.title} to favourites`}
      onClick={() => toggleFav(item.id)}
      className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-cream active:scale-90"
    >
      <Heart
        size={20}
        aria-hidden="true"
        fill={isFav ? 'currentColor' : 'none'}
        className={isFav ? 'text-red-600' : 'text-ink'}
      />
    </button>
  )
}

function AddButton({ item, onAdd, large }: { item: MenuItem; onAdd: (item: MenuItem) => void; large?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onAdd(item)}
      aria-label={`Add ${item.title} to bag`}
      className={`inline-flex items-center gap-1.5 rounded-full bg-gold font-bold text-on-gold transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
        large ? 'px-7 py-3.5 text-base' : 'px-5 py-2.5 text-sm'
      }`}
    >
      <Plus size={large ? 18 : 16} aria-hidden="true" strokeWidth={2.5} />
      {large && item.customizable ? 'Choose & add' : 'Add'}
    </button>
  )
}

function Meta({ item }: { item: MenuItem }) {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
      <span className="inline-flex items-center gap-1 font-semibold text-ink">
        <Star size={14} aria-hidden="true" className="fill-gold-dark text-gold-dark" />
        {item.rating.toFixed(1)}
        <span className="sr-only">out of 5</span>
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock size={14} aria-hidden="true" />
        {item.prepTime} min
      </span>
      <span>
        {item.calories} kcal · {item.protein} g protein
      </span>
    </p>
  )
}

interface RowProps {
  item: MenuItem
  active: boolean
  onAdd: (item: MenuItem) => void
  onShow: (item: MenuItem) => void
}

export default function DishRow({ item, active, onAdd, onShow }: RowProps) {
  return (
    <article
      onMouseEnter={() => onShow(item)}
      onFocus={() => onShow(item)}
      className={`-mx-4 grid grid-cols-[88px_1fr] gap-x-4 px-4 py-5 transition-colors sm:-mx-5 sm:grid-cols-[112px_1fr] sm:gap-x-6 sm:px-5 lg:grid-cols-[1fr_auto] lg:gap-x-10 ${
        active ? 'lg:bg-cream-deep' : 'hover:bg-cream-deep/60'
      }`}
    >
      {/* Phones and tablets: each row has its own photo. */}
      <DishPhoto item={item} sizes="112px" className="aspect-square w-full lg:hidden" />

      <div className="min-w-0">
        <h3 className="flex items-center gap-2.5 text-xl font-bold leading-tight md:text-2xl">
          <VegMark veg={item.veg} />
          {item.title}
        </h3>
        <p className="mt-2 max-w-xl text-[16px] leading-relaxed text-ink/80">{item.desc}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          <Meta item={item} />
          <span className="text-sm font-semibold text-gold-text">{item.ribbon}</span>
        </div>

        {/* Price and actions sit under the text on smaller screens. */}
        <div className="mt-4 flex items-center gap-x-2 lg:hidden">
          <span className="mr-1 font-display text-xl font-bold">₹{item.price}</span>
          <AddButton item={item} onAdd={onAdd} />
          <FavouriteButton item={item} />
        </div>
      </div>

      {/* Large screens: price and actions in their own column, like a menu card. */}
      <div className="hidden flex-col items-end justify-between gap-4 lg:flex">
        <span className="font-display text-2xl font-bold">₹{item.price}</span>
        <div className="flex items-center gap-1">
          <FavouriteButton item={item} />
          <AddButton item={item} onAdd={onAdd} />
        </div>
      </div>
    </article>
  )
}

export function DishSpotlight({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem) => void }) {
  return (
    <div>
      <div className="relative h-[min(58vh,600px)] overflow-hidden bg-cream-deep">
        {/* key: a new image element (and a fresh fade) for every dish */}
        <DishPhoto key={item.id} item={item} sizes="40vw" className="dish-in absolute inset-0 h-full w-full" />
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gold-text">{item.ribbon}</p>
          <p className="mt-1 font-display text-3xl font-extrabold leading-tight tracking-tight">{item.title}</p>
        </div>
        <p className="font-display text-3xl font-extrabold">₹{item.price}</p>
      </div>
      <div className="mt-3">
        <Meta item={item} />
      </div>
      <div className="mt-5">
        <AddButton item={item} onAdd={onAdd} large />
      </div>
    </div>
  )
}
