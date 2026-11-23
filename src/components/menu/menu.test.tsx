// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MenuSection from './MenuSection'
import { useFavoritesStore } from '../../store/favoritesStore'
import { useUiStore } from '../../store/uiStore'

// jsdom lacks these, and GSAP reads matchMedia as soon as it is imported (see navbar.test.tsx).
vi.hoisted(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
})

afterEach(() => {
  cleanup()
  useUiStore.setState({ menuQuery: '', menuCategory: 'all' })
  useFavoritesStore.setState({ ids: [] })
})

const railHeading = () => document.getElementById('rail-heading')?.textContent
const cardTitles = () => within(screen.getByRole('list', { name: /dish/ })).getAllByRole('heading').map((h) => h.textContent)
const tile = (name: string) => within(screen.getByRole('list', { name: "What's on your plate?" })).getByRole('button', { name })

describe('MenuSection', () => {
  it("shows the chef's recommendations until something is filtered, and can open every dish", async () => {
    render(<MenuSection />)
    expect(railHeading()).toBe("Chef's recommendations")
    expect(cardTitles()).toHaveLength(6)
    await userEvent.click(screen.getByRole('button', { name: 'See all 12 dishes' }))
    expect(railHeading()).toBe('All dishes')
    expect(cardTitles()).toHaveLength(12)
  })

  it('keeps the category pills and tiles in sync, and a second press on a tile returns to All', async () => {
    render(<MenuSection />)
    await userEvent.click(tile('Biryani'))
    expect(screen.getByRole('radio', { name: 'Biryani' })).toBeChecked()
    expect(tile('Biryani')).toHaveAttribute('aria-pressed', 'true')
    expect(railHeading()).toBe('Biryani (2)')
    expect(cardTitles()).toEqual(['Hyderabadi Chicken Biryani', 'Veg Dum Biryani'])

    await userEvent.click(tile('Biryani'))
    expect(screen.getByRole('radio', { name: 'All' })).toBeChecked()
    expect(railHeading()).toBe("Chef's recommendations")
  })

  it('lets arrow keys choose a pill, with a single tab stop in the group', async () => {
    render(<MenuSection />)
    const group = screen.getByRole('radiogroup', { name: 'Category' })
    expect(within(group).getAllByRole('radio').filter((r) => r.tabIndex === 0)).toHaveLength(1)
    screen.getByRole('radio', { name: 'All' }).focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Starters' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Starters' })).toHaveFocus()
    await userEvent.keyboard('{End}')
    expect(screen.getByRole('radio', { name: 'Drinks' })).toBeChecked()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'All' })).toBeChecked()
  })

  it('applies the filter panel settings and marks the Filter button', async () => {
    render(<MenuSection />)
    await userEvent.click(screen.getByRole('switch', { name: 'Veg only', hidden: true }))
    expect(railHeading()).toBe('Your filtered dishes (9)')
    expect(screen.getByRole('button', { name: /Filter.*filters on/ })).toBeInTheDocument()
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Sort by', hidden: true }), 'price-asc')
    expect(cardTitles()[0]).toBe('Fresh Lime Soda')
  })

  it('shows an empty state for a search with no match, and Clear filters resets everything', async () => {
    render(<MenuSection />)
    await userEvent.click(tile('Desserts'))
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search dishes' }), 'pizza')
    expect(screen.getByText('No dishes match.')).toBeInTheDocument()
    const clear = screen.getAllByRole('button', { name: 'Clear filters' }).find((b) => !b.closest('[popover]'))!
    await userEvent.click(clear)
    expect(screen.getByRole('searchbox', { name: 'Search dishes' })).toHaveValue('')
    expect(screen.getByRole('radio', { name: 'All' })).toBeChecked()
    expect(railHeading()).toBe("Chef's recommendations")
  })

  it('names each card by its dish and keeps the favourite label steady when pressed', async () => {
    render(<MenuSection />)
    const fav = screen.getByRole('button', { name: 'Favourite Paneer Tikka' })
    expect(fav).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(fav)
    expect(screen.getByRole('button', { name: 'Favourite Paneer Tikka' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('switch', { name: 'Favourites (1)', hidden: true })).toBeInTheDocument()
  })
})
