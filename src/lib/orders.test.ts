import { describe, expect, it } from 'vitest'
import { ADDONS, MENU_ITEMS, PORTIONS } from '../data/menu'
import { unitPrice, type CartLine, type PromoCode, type Totals } from './pricing'
import {
  DELIVER_NOW_SLOT,
  TRACKING_STEPS,
  buildDeliverySlots,
  buildOrder,
  describeLine,
  makeOrderId,
  paymentLabel,
  trackingProgress,
  trackingStep,
} from './orders'

const T0 = 1_700_000_000_000 // a fixed "order placed" time
const sec = (s: number) => T0 + s * 1000

const biryaniLine = {
  itemId: 4,
  portionId: PORTIONS[0].id,
  spice: 'Standard',
  addons: [],
  qty: 2,
} as unknown as CartLine

const fakeTotals = {
  subtotal: 640,
  discount: 0,
  tax: 32,
  tip: 0,
  total: 672,
} as unknown as Totals

describe('demo tracking timeline', () => {
  it('starts at step 1 (confirmed)', () => {
    expect(trackingStep(T0, sec(0))).toBe(1)
    expect(trackingStep(T0, sec(4.9))).toBe(1)
  })

  it('moves to step 2 at 5 s and step 3 at 15 s', () => {
    expect(trackingStep(T0, sec(5))).toBe(2)
    expect(trackingStep(T0, sec(14.9))).toBe(2)
    expect(trackingStep(T0, sec(15))).toBe(3)
  })

  it('is delivered (step 4) at 30 s and stays delivered', () => {
    expect(trackingStep(T0, sec(30))).toBe(4)
    expect(trackingStep(T0, sec(600))).toBe(4)
  })

  it('treats a clock earlier than placedAt as step 1', () => {
    expect(trackingStep(T0, sec(-10))).toBe(1)
  })

  it('progress goes from 0 to 1 and is capped at 1', () => {
    expect(trackingProgress(T0, sec(0))).toBe(0)
    expect(trackingProgress(T0, sec(15))).toBe(0.5)
    expect(trackingProgress(T0, sec(90))).toBe(1)
  })

  it('has 4 steps ending with Delivered', () => {
    expect(TRACKING_STEPS).toHaveLength(4)
    expect(TRACKING_STEPS[3].title).toBe('Delivered')
  })
})

describe('order helpers', () => {
  it('makeOrderId uses FM + last 6 digits of the time', () => {
    expect(makeOrderId(1_700_000_123_456)).toBe('FM123456')
  })

  it('paymentLabel is honest about the demo UPI', () => {
    expect(paymentLabel({ paymentMethod: 'UPI' })).toBe('UPI (demo, no money moved)')
    expect(paymentLabel({ paymentMethod: 'COD' })).toBe('Cash on Delivery')
  })

  it('describeLine hides Standard spice and lists add-ons', () => {
    const portionName = PORTIONS[0].label.split(' (')[0]
    expect(describeLine(biryaniLine)).toBe(portionName)

    const withAddon = { ...biryaniLine, addons: [ADDONS[0].id] } as unknown as CartLine
    expect(describeLine(withAddon)).toBe(`${portionName} · ${ADDONS[0].label}`)
  })
})

describe('buildOrder', () => {
  const base = {
    lines: [biryaniLine],
    totals: fakeTotals,
    promoCode: 'MUNCH10' as PromoCode,
    customerName: 'Test User',
    phone: '9876543210',
    address: '12 Test Street, Hyderabad',
    slot: DELIVER_NOW_SLOT,
    now: T0,
  }

  it('builds a UPI demo order with readable items', () => {
    const order = buildOrder({ ...base, paymentMethod: 'UPI' })
    const dish = MENU_ITEMS.find((m) => m.id === 4)!

    expect(order.id).toBe(makeOrderId(T0))
    expect(order.paymentStatus).toBe('demo-paid')
    expect(order.items[0].title).toBe(dish.title)
    expect(order.items[0].qty).toBe(2)
    expect(order.items[0].unitPrice).toBe(unitPrice(biryaniLine))
    expect(order.totals.total).toBe(672)
    expect(order.rating).toBeNull()
    // discount was 0, so the promo code must not be saved
    expect(order.promoCode).toBeNull()
  })

  it('builds a COD order and keeps the promo when it gave a discount', () => {
    const totals = { ...fakeTotals, discount: 64 } as unknown as Totals
    const order = buildOrder({ ...base, totals, paymentMethod: 'COD' })

    expect(order.paymentStatus).toBe('pay-on-delivery')
    expect(order.promoCode).toBe('MUNCH10')
  })
})

describe('buildDeliverySlots', () => {
  it('gives Deliver now + 3 slots, at least 45 min ahead', () => {
    const slots = buildDeliverySlots(new Date(2026, 9, 25, 10, 0))
    expect(slots).toHaveLength(4)
    expect(slots[0]).toBe(DELIVER_NOW_SLOT)
    expect(slots[1]).toBe('Today, 11:00 AM – 11:30 AM')
  })

  it('rolls over to Tomorrow late at night', () => {
    const slots = buildDeliverySlots(new Date(2026, 9, 25, 23, 30))
    expect(slots[1]).toBe('Tomorrow, 12:30 AM – 1:00 AM')
  })
})