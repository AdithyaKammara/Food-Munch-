import { ADDONS, MENU_ITEMS, PORTIONS } from '../data/menu'
import { unitPrice, type CartLine, type PromoCode, type Totals } from './pricing'

export type PaymentMethod = 'UPI' | 'COD'
export type PaymentStatus = 'demo-paid' | 'pay-on-delivery'
export type TrackingStep = 1 | 2 | 3 | 4

export interface OrderItem {
  itemId: number
  title: string
  qty: number
  unitPrice: number
  options: string
}

export interface OrderTotals {
  subtotal: number
  discount: number
  tax: number
  tip: number
  total: number
}

export interface Order {
  id: string
  placedAt: number
  customerName: string
  phone: string
  address: string
  slot: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  promoCode: PromoCode | null
  lines: CartLine[] // kept so an order can be re-ordered
  items: OrderItem[]
  totals: OrderTotals
  rating: number | null
}

export const TRACKING_STEPS: { step: TrackingStep; title: string; text: string }[] = [
  { step: 1, title: 'Order confirmed', text: 'Your order has been received.' },
  { step: 2, title: 'Kitchen preparing', text: 'The kitchen is preparing your meal.' },
  { step: 3, title: 'Out for delivery', text: 'Your order is on its way.' },
  { step: 4, title: 'Delivered', text: 'Enjoy your meal!' },
]

/** DEMO timeline: seconds after placing the order at which each step begins. */
export const DEMO_STEP_START_SECONDS = [0, 5, 15, 30] as const
export const DEMO_TOTAL_SECONDS = 30

export function trackingStep(placedAt: number, now: number): TrackingStep {
  const elapsed = Math.max(0, (now - placedAt) / 1000)
  if (elapsed >= DEMO_STEP_START_SECONDS[3]) return 4
  if (elapsed >= DEMO_STEP_START_SECONDS[2]) return 3
  if (elapsed >= DEMO_STEP_START_SECONDS[1]) return 2
  return 1
}

/** 0 to 1 across the whole demo timeline. */
export function trackingProgress(placedAt: number, now: number): number {
  const elapsed = Math.max(0, (now - placedAt) / 1000)
  return Math.min(1, elapsed / DEMO_TOTAL_SECONDS)
}

export function makeOrderId(now: number): string {
  return 'FM' + String(now).slice(-6)
}

/** Readable summary of a cart line's options, e.g. "Family Pack · Extra Spicy · Extra Mint Raita". */
export function describeLine(line: CartLine): string {
  const portion = PORTIONS.find((p) => p.id === line.portionId)?.label.split(' (')[0] ?? 'Regular'
  const addons = line.addons.map((id) => ADDONS.find((a) => a.id === id)?.label)
  const spice = line.spice !== 'Standard' ? line.spice : null
  return [portion, spice, ...addons].filter(Boolean).join(' · ')
}

export function paymentLabel(order: Pick<Order, 'paymentMethod'>): string {
  return order.paymentMethod === 'UPI' ? 'UPI (demo, no money moved)' : 'Cash on Delivery'
}

interface BuildOrderInput {
  lines: CartLine[]
  totals: Totals
  promoCode: PromoCode | null
  customerName: string
  phone: string
  address: string
  slot: string
  paymentMethod: PaymentMethod
  now: number
}

export function buildOrder(input: BuildOrderInput): Order {
  const { lines, totals, promoCode, paymentMethod, now } = input
  return {
    id: makeOrderId(now),
    placedAt: now,
    customerName: input.customerName,
    phone: input.phone,
    address: input.address,
    slot: input.slot,
    paymentMethod,
    paymentStatus: paymentMethod === 'UPI' ? 'demo-paid' : 'pay-on-delivery',
    promoCode: totals.discount > 0 ? promoCode : null,
    lines,
    items: lines.map((line) => ({
      itemId: line.itemId,
      title: MENU_ITEMS.find((m) => m.id === line.itemId)?.title ?? 'Unknown dish',
      qty: line.qty,
      unitPrice: unitPrice(line),
      options: describeLine(line),
    })),
    totals: {
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      tip: totals.tip,
      total: totals.total,
    },
    rating: null,
  }
}

// ---------- Delivery slots ----------

export const DELIVER_NOW_SLOT = 'Deliver now (about 22 min)'

function formatTime(d: Date): string {
  const h = d.getHours()
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(d.getMinutes()).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

/** "Deliver now" plus three 30-minute slots, starting at least 45 minutes from `now`. */
export function buildDeliverySlots(now: Date): string[] {
  const start = new Date(now.getTime() + 45 * 60 * 1000)
  start.setSeconds(0, 0)
  const minutes = start.getMinutes()
  if (minutes !== 0 && minutes !== 30) {
    if (minutes < 30) {
      start.setMinutes(30)
    } else {
      start.setHours(start.getHours() + 1)
      start.setMinutes(0)
    }
  }

  const slots = [DELIVER_NOW_SLOT]
  for (let i = 0; i < 3; i++) {
    const from = new Date(start.getTime() + i * 30 * 60 * 1000)
    const to = new Date(from.getTime() + 30 * 60 * 1000)
    const day = from.toDateString() === now.toDateString() ? 'Today' : 'Tomorrow'
    slots.push(`${day}, ${formatTime(from)} – ${formatTime(to)}`)
  }
  return slots
}