import { describe, expect, it } from 'vitest'
import {
  calcTotals,
  checkPromo,
  lineKey,
  lineMacros,
  parsePromoCode,
  unitPrice,
  type CartLine,
} from './pricing'

// Dish ids: 1 Paneer Tikka ₹210, 4 Chicken Biryani ₹320, 7 Dal Tadka ₹190, 8 Gulab Jamun ₹110
const line = (over: Partial<CartLine> = {}): CartLine => ({
  itemId: 1,
  portionId: 'regular',
  spice: 'Medium',
  addons: [],
  qty: 1,
  ...over,
})

describe('unitPrice', () => {
  it('uses the base price for a regular portion', () => {
    expect(unitPrice(line())).toBe(210)
  })
  it('adds ₹160 for a family pack', () => {
    expect(unitPrice(line({ portionId: 'family' }))).toBe(370)
  })
  it('adds add-on prices', () => {
    expect(unitPrice(line({ addons: ['raita', 'egg'] }))).toBe(260)
  })
  it('combines family pack and add-ons', () => {
    expect(unitPrice(line({ portionId: 'family', addons: ['salan'] }))).toBe(410)
  })
  it('returns 0 for an unknown dish', () => {
    expect(unitPrice(line({ itemId: 999 }))).toBe(0)
  })
})

describe('lineMacros', () => {
  it('scales macros by 1.8 for a family pack, then by quantity', () => {
    expect(lineMacros(line({ portionId: 'family', qty: 2 }))).toEqual({
      calories: 1152,
      protein: 68,
    })
  })
})

describe('lineKey', () => {
  it('is the same regardless of add-on order', () => {
    expect(lineKey(line({ addons: ['egg', 'raita'] }))).toBe(
      lineKey(line({ addons: ['raita', 'egg'] })),
    )
  })
  it('differs when options differ', () => {
    expect(lineKey(line())).not.toBe(lineKey(line({ portionId: 'family' })))
  })
})

describe('parsePromoCode', () => {
  it('accepts codes in any case with spaces', () => {
    expect(parsePromoCode(' first50 ')).toBe('FIRST50')
  })
  it('rejects unknown codes', () => {
    expect(parsePromoCode('FREEFOOD')).toBeNull()
  })
})

describe('checkPromo', () => {
  it('FIRST50 needs ₹200 minimum', () => {
    expect(checkPromo('FIRST50', 199, true).applicable).toBe(false)
    expect(checkPromo('FIRST50', 200, true)).toEqual({ applicable: true, discount: 50 })
  })
  it('FIRST50 is first order only', () => {
    expect(checkPromo('FIRST50', 400, false).applicable).toBe(false)
  })
  it('MUNCH10 is 10% and capped at ₹100', () => {
    expect(checkPromo('MUNCH10', 300, false)).toEqual({ applicable: true, discount: 30 })
    expect(checkPromo('MUNCH10', 1500, false)).toEqual({ applicable: true, discount: 100 })
  })
  it('LUCKY60 and FEAST75 respect their minimums', () => {
    expect(checkPromo('LUCKY60', 250, false)).toEqual({ applicable: true, discount: 60 })
    expect(checkPromo('FEAST75', 499, false).applicable).toBe(false)
    expect(checkPromo('FEAST75', 500, false)).toEqual({ applicable: true, discount: 75 })
  })
})

describe('calcTotals', () => {
  it('returns zeros for an empty cart, even with a tip', () => {
    const t = calcTotals({ lines: [], promoCode: null, tip: 50, isFirstOrder: true })
    expect(t.subtotal).toBe(0)
    expect(t.tip).toBe(0)
    expect(t.total).toBe(0)
  })

  it('adds 5% GST on the subtotal when there is no promo', () => {
    const t = calcTotals({
      lines: [line({ itemId: 4 })],
      promoCode: null,
      tip: 0,
      isFirstOrder: true,
    })
    expect(t).toMatchObject({ subtotal: 320, discount: 0, tax: 16, total: 336 })
  })

  it('charges GST after the discount (₹430 - ₹50 FIRST50)', () => {
    const t = calcTotals({
      lines: [line({ itemId: 4 }), line({ itemId: 8 })],
      promoCode: 'FIRST50',
      tip: 0,
      isFirstOrder: true,
    })
    expect(t).toMatchObject({ subtotal: 430, discount: 50, tax: 19, total: 399 })
  })

  it('adds the rider tip to the total', () => {
    const t = calcTotals({
      lines: [line({ itemId: 4 }), line({ itemId: 8 })],
      promoCode: 'FIRST50',
      tip: 20,
      isFirstOrder: true,
    })
    expect(t.total).toBe(419)
  })

  it('gives no discount when the minimum is not met', () => {
    const t = calcTotals({
      lines: [line({ itemId: 7 })],
      promoCode: 'FIRST50',
      tip: 0,
      isFirstOrder: true,
    })
    expect(t.discount).toBe(0)
    expect(t.promo?.applicable).toBe(false)
  })

  it('multiplies by quantity', () => {
    const t = calcTotals({
      lines: [line({ itemId: 1, qty: 3 })],
      promoCode: null,
      tip: 0,
      isFirstOrder: false,
    })
    expect(t.subtotal).toBe(630)
  })
})