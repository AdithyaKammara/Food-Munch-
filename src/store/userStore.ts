import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  name: string
  phone: string
  address: string
}

interface UserState {
  user: User | null
  login: (name: string, phone: string) => void
  setAddress: (address: string) => void
  logout: () => void
}

// DEMO ONLY: details are stored in this browser, with no password and no server.
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      login: (name, phone) =>
        set((state) => ({
          user: { name, phone, address: state.user?.phone === phone ? state.user.address : '' },
        })),
      setAddress: (address) =>
        set((state) => (state.user ? { user: { ...state.user, address } } : state)),
      logout: () => set({ user: null }),
    }),
    { name: 'foodMunchUserV3' },
  ),
)