import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { lineKey, type CartLine, type PromoCode } from '../lib/pricing'

interface CartState {
  lines: CartLine[]
  promoCode: PromoCode | null
  tip: number
  addLine: (line: Omit<CartLine, 'qty'>) => void
  changeQty: (key: string, delta: number) => void
  setPromoCode: (code: PromoCode | null) => void
  setTip: (amount: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      promoCode: null,
      tip: 0,
      addLine: (line) =>
        set((state) => {
          const key = lineKey(line)
          const exists = state.lines.some((l) => lineKey(l) === key)
          return {
            lines: exists
              ? state.lines.map((l) => (lineKey(l) === key ? { ...l, qty: l.qty + 1 } : l))
              : [...state.lines, { ...line, qty: 1 }],
          }
        }),
      changeQty: (key, delta) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (lineKey(l) === key ? { ...l, qty: l.qty + delta } : l))
            .filter((l) => l.qty > 0),
        })),
      setPromoCode: (code) => set({ promoCode: code }),
      // Pressing the same tip again turns it off.
      setTip: (amount) => set((state) => ({ tip: state.tip === amount ? 0 : amount })),
      clear: () => set({ lines: [], promoCode: null, tip: 0 }),
    }),
    { name: 'foodMunchCartV3' },
  ),
)

export const selectCartCount = (state: CartState) =>
  state.lines.reduce((total, l) => total + l.qty, 0)