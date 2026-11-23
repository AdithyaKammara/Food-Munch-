import { MENU_ITEMS, type MenuCategory } from '../../data/menu'
import type { SortKey } from '../../lib/menuFilters'

export type CategoryChoice = MenuCategory | 'all'

const photo = (id: number) => MENU_ITEMS.find((m) => m.id === id)?.image ?? ''

/**
 * The menu's categories, shared by the toolbar pills and the category tiles so both stay in sync
 * (component-guidelines.md §7–8). Each tile shows a real dish from that category.
 */
export const CATEGORIES: { id: MenuCategory; label: string; image: string }[] = [
  { id: 'biryani', label: 'Biryani', image: photo(4) },
  { id: 'starters', label: 'Starters', image: photo(2) },
  { id: 'mains', label: 'Mains', image: photo(6) },
  { id: 'desserts', label: 'Desserts', image: photo(8) },
  { id: 'drinks', label: 'Drinks', image: photo(11) },
]

export const PILLS: { id: CategoryChoice; label: string }[] = [{ id: 'all', label: 'All' }, ...CATEGORIES]

export function labelFor(id: CategoryChoice): string {
  return PILLS.find((p) => p.id === id)?.label ?? 'All'
}

/** The settings inside the Filter panel. */
export interface FilterValues {
  vegOnly: boolean
  highProtein: boolean
  favouritesOnly: boolean
  sort: SortKey
}

export const NO_FILTERS: FilterValues = { vegOnly: false, highProtein: false, favouritesOnly: false, sort: 'default' }
