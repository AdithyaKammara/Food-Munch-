import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order } from '../lib/orders'

interface OrdersState {
  /** Newest order first. Stored only in this browser (demo). */
  orders: Order[]
  /** The order shown in the tracking dialog. */
  activeOrderId: string | null

  addOrder: (order: Order) => void
  setActive: (orderId: string | null) => void
  rateOrder: (orderId: string, rating: number) => void
}

const MAX_ORDERS = 20

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      activeOrderId: null,

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders].slice(0, MAX_ORDERS),
          activeOrderId: order.id,
        })),

      setActive: (orderId) => set({ activeOrderId: orderId }),

      rateOrder: (orderId, rating) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, rating: Math.min(5, Math.max(1, Math.round(rating))) } : o,
          ),
        })),
    }),
    { name: 'foodMunchOrdersV4' },
  ),
)