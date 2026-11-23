import type { MenuCategory, MenuItem } from '../data/menu'

export type SortKey =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'protein-desc'
  | 'prep-asc'

export interface MenuFilters {
  category: MenuCategory | 'all'
  query: string
  vegOnly: boolean
  highProtein: boolean
  favouritesOnly: boolean
  favouriteIds: number[]
  sort: SortKey
}

export const HIGH_PROTEIN_GRAMS = 20

/** True when a dish belongs to the chosen category. Biryani comes from the dish name. */
export function inCategory(item: MenuItem, category: MenuCategory | 'all'): boolean {
  if (category === 'all') return true
  if (category === 'biryani') return /biryani/i.test(item.title)
  return item.category === category
}

/** True when anything narrows or reorders the menu, so the plain recommendations no longer apply. */
export function isFiltered(f: Omit<MenuFilters, 'favouriteIds'>): boolean {
  return (
    f.category !== 'all' || f.query.trim() !== '' || f.vegOnly || f.highProtein || f.favouritesOnly || f.sort !== 'default'
  )
}

export function filterMenu(items: MenuItem[], f: MenuFilters): MenuItem[] {
  const q = f.query.trim().toLowerCase()

  const result = items.filter(
    (item) =>
      inCategory(item, f.category) &&
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