import type { Category, MenuItem } from '../data/menu'

export type SortKey =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'protein-desc'
  | 'prep-asc'

export interface MenuFilters {
  category: Category | 'all'
  query: string
  vegOnly: boolean
  highProtein: boolean
  favouritesOnly: boolean
  favouriteIds: number[]
  sort: SortKey
}

export const HIGH_PROTEIN_GRAMS = 20

export function filterMenu(items: MenuItem[], f: MenuFilters): MenuItem[] {
  const q = f.query.trim().toLowerCase()

  const result = items.filter(
    (item) =>
      (f.category === 'all' || item.category === f.category) &&
      (!f.vegOnly || item.veg) &&
      (!f.highProtein || item.protein >= HIGH_PROTEIN_GRAMS) &&
      (!f.favouritesOnly || f.favouriteIds.includes(item.id)) &&
      (q === '' || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)),
  )

  // Sort a copy so the original menu array is never changed.
  const sorted = [...result]
  switch (f.sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'rating-desc':
      sorted.sort((a, b) => b.rating - a.rating)
      break
    case 'protein-desc':
      sorted.sort((a, b) => b.protein - a.protein)
      break
    case 'prep-asc':
      sorted.sort((a, b) => a.prepTime - b.prepTime)
      break
  }
  return sorted
}