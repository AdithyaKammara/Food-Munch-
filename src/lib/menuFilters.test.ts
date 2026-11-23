import { describe, expect, it } from 'vitest'
import { MENU_ITEMS } from '../data/menu'
import { filterMenu, isFiltered, type MenuFilters } from './menuFilters'

const base: MenuFilters = {
  category: 'all',
  query: '',
  vegOnly: false,
  highProtein: false,
  favouritesOnly: false,
  favouriteIds: [],
  sort: 'default',
}
const run = (over: Partial<MenuFilters> = {}) => filterMenu(MENU_ITEMS, { ...base, ...over })

describe('filterMenu', () => {
  it('returns all 12 dishes with no filters, in original order', () => {
    expect(run().map((i) => i.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })
  it('filters by category', () => {
    expect(run({ category: 'mains' })).toHaveLength(4)
    expect(run({ category: 'drinks' })).toHaveLength(3)
  })
  it('keeps only vegetarian dishes', () => {
    expect(run({ vegOnly: true })).toHaveLength(9)
  })
  it('keeps only dishes with 20g+ protein', () => {
    expect(run({ highProtein: true }).map((i) => i.id)).toEqual([2, 4, 6])
  })
  it('searches title and description, ignoring case and spaces', () => {
    expect(run({ query: '  BIRYANI ' }).map((i) => i.id)).toEqual([4, 5])
    expect(run({ query: 'saffron' }).length).toBeGreaterThan(0)
  })
  it('returns nothing when the search has no match', () => {
    expect(run({ query: 'pizza' })).toEqual([])
  })
  it('shows only favourites when asked', () => {
    expect(run({ favouritesOnly: true, favouriteIds: [1, 8] }).map((i) => i.id)).toEqual([1, 8])
  })
  it('derives Biryani from the dish name, across courses', () => {
    expect(run({ category: 'biryani' }).map((i) => i.id)).toEqual([4, 5])
    expect(run({ category: 'biryani', vegOnly: true }).map((i) => i.id)).toEqual([5])
    expect(MENU_ITEMS.find((i) => i.id === 4)?.category).toBe('mains')
  })
  it('knows when the menu is filtered', () => {
    expect(isFiltered(base)).toBe(false)
    expect(isFiltered({ ...base, query: '   ' })).toBe(false)
    expect(isFiltered({ ...base, query: 'dal' })).toBe(true)
    expect(isFiltered({ ...base, category: 'biryani' })).toBe(true)
    expect(isFiltered({ ...base, sort: 'price-asc' })).toBe(true)
  })
  it('combines filters', () => {
    expect(run({ category: 'mains', vegOnly: true }).map((i) => i.id)).toEqual([5, 7])
  })
  it('sorts by price without changing the original array', () => {
    const sorted = run({ sort: 'price-asc' })
    expect(sorted[0].title).toBe('Fresh Lime Soda')
    expect(sorted[sorted.length - 1].title).toBe('Butter Chicken')
    expect(MENU_ITEMS[0].id).toBe(1)
  })
})