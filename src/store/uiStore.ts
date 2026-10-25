import { create } from 'zustand'

export type Panel = 'cart' | 'checkout' | 'tracking' | 'history' | 'auth'

interface UiState {
  panel: Panel | null
  openPanel: (panel: Panel) => void
  closePanel: () => void
}

// Only one panel is open at a time.
export const useUiStore = create<UiState>()((set) => ({
  panel: null,
  openPanel: (panel) => set({ panel }),
  closePanel: () => set({ panel: null }),
}))