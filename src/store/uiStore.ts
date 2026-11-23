import { create } from 'zustand'
import type { MenuCategory } from '../data/menu'

export type Panel = 'cart' | 'checkout' | 'tracking' | 'history' | 'auth'

interface UiState {
  panel: Panel | null
  openPanel: (panel: Panel) => void
  closePanel: () => void

  /** The dish search text. Shared by the navbar search and the menu search box. */
  menuQuery: string
  setMenuQuery: (query: string) => void

  /** The chosen menu category. Shared so the footer's Menu links can open the menu filtered. */
  menuCategory: MenuCategory | 'all'
  setMenuCategory: (category: MenuCategory | 'all') => void
}

// Only one panel is open at a time.
export const useUiStore = create<UiState>()((set) => ({
  panel: null,
  openPanel: (panel) => set({ panel }),
  closePanel: () => set({ panel: null }),

  menuQuery: '',
  setMenuQuery: (menuQuery) => set({ menuQuery }),

  menuCategory: 'all',
  setMenuCategory: (menuCategory) => set({ menuCategory }),
}))
