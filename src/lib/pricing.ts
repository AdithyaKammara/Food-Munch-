import {
  ADDONS,
  MENU_ITEMS,
  PORTIONS,
  type AddonId,
  type MenuItem,
  type PortionId,
} from '../data/menu'

export const TAX_RATE = 0.05

export interface CartLine {
  itemId: number
  portionId: PortionId
  spice: string
  addons: AddonId[]
  qty: number
}

/** Two cart lines with the same dish and options share one key, so they merge. */
export function lineKey(line: Omit<CartLine, 'qty'>): string {
  const addons = [...line.addons].sort().join('_') || 'none'
  const spice = line.spice.toLowerCase().replace(/\s+/g, '')
  return `${line.itemId}-${line.portionId}-${spice}-${addons}`
}

function findItem(itemId: number, menu: MenuItem[]): MenuItem | undefined {
  return menu.find((m) => m.id === itemId)
}

/** Price of ONE unit of this cart line (dish + portion surcharge + add-ons). */
export function unitPrice(line: CartLine, menu: MenuItem[] = MENU_ITEMS): number {
  const item = findItem(line.itemId, menu)
  if (!item) return 0
  const portionExtra = PORTIONS.find((p) => p.id === line.portionId)?.extra ?? 0
  const addonsExtra = line.addons.reduce(
    (sum, id) => sum + (ADDONS.find((a) => a.id === id)?.price ?? 0),
    0,
  )
  return item.price + portionExtra + addonsExtra
}

/** Calories and protein for the whole line (all units). */
export function lineMacros(line: CartLine, menu: MenuItem[] = MENU_ITEMS) {
  const item = findItem(line.itemId, menu)
  if (!item) return { calories: 0, protein: 0 }
  const multiplier = PORTIONS.find((p) => p.id === line.portionId)?.macroMultiplier ?? 1
  return {
    calories: Math.round(item.calories * multiplier) * line.qty,
    protein: Math.round(item.protein * multiplier) * line.qty,
  }
}

// ---------- Promo codes ----------

export type PromoCode = 'FIRST50' | 'MUNCH10' | 'LUCKY60' | 'FEAST75'

export interface Promo {
  code: PromoCode
  title: string
  minSubtotal: number
  firstOrderOnly: boolean
  discount: (subtotal: number) => number
}

export const PROMOS: Record<PromoCode, Promo> = {
  FIRST50: {
    code: 'FIRST50',
    title: 'Flat ₹50 off your first order (min ₹200)',
    minSubtotal: 200,
    firstOrderOnly: true,
    discount: () => 50,
  },
  MUNCH10: {
    code: 'MUNCH10',
    title: '10% off, up to ₹100 (min ₹300)',
    minSubtotal: 300,
    firstOrderOnly: false,
    discount: (subtotal) => Math.min(100, Math.round(subtotal * 0.1)),
  },
  LUCKY60: {
    code: 'LUCKY60',
    title: 'Wheel reward: flat ₹60 off (min ₹250)',
    minSubtotal: 250,
    firstOrderOnly: false,
    discount: () => 60,
  },
  FEAST75: {
    code: 'FEAST75',
    title: 'Party deal: flat ₹75 off (min ₹500)',
    minSubtotal: 500,
    firstOrderOnly: false,
    discount: () => 75,
  },
}

/** Turns what the user typed into a valid code, or null if it doesn't exist. */
export function parsePromoCode(input: string): PromoCode | null {
  const code = input.trim().toUpperCase()
  return Object.keys(PROMOS).includes(code) ? (code as PromoCode) : null
}

export type PromoCheck =
  | { applicable: true; discount: number }
  | { applicable: false; reason: string }

export function checkPromo(
  code: PromoCode,
  subtotal: number,
  isFirstOrder: boolean,
): PromoCheck {
  const promo = PROMOS[code]
  if (promo.firstOrderOnly && !isFirstOrder) {
    return { applicable: false, reason: `${code} is valid on your first order only` }
  }
  if (subtotal < promo.minSubtotal) {
    return { applicable: false, reason: `${code} needs a minimum order of ₹${promo.minSubtotal}` }
  }
  return { applicable: true, discount: Math.min(subtotal, promo.discount(subtotal)) }
}

// ---------- Totals ----------

export interface PricingInput {
  lines: CartLine[]
  promoCode: PromoCode | null
  tip: number
  isFirstOrder: boolean
}

export interface Totals {
  subtotal: number
  discount: number
  tax: number
  tip: number
  total: number
  calories: number
  protein: number
  promo: PromoCheck | null
}

export function calcTotals(input: PricingInput, menu: MenuItem[] = MENU_ITEMS): Totals {
  const { lines, promoCode, tip, isFirstOrder } = input

  const subtotal = lines.reduce((sum, l) => sum + unitPrice(l, menu) * l.qty, 0)
  const macros = lines.reduce(
    (acc, l) => {
      const m = lineMacros(l, menu)
      return { calories: acc.calories + m.calories, protein: acc.protein + m.protein }
    },
    { calories: 0, protein: 0 },
  )

  const promo = promoCode ? checkPromo(promoCode, subtotal, isFirstOrder) : null
  const discount = promo && promo.applicable ? promo.discount : 0
  const tax = Math.round((subtotal - discount) * TAX_RATE)
  const appliedTip = subtotal > 0 ? tip : 0

  return {
    subtotal,
    discount,
    tax,
    tip: appliedTip,
    total: subtotal - discount + tax + appliedTip,
    calories: macros.calories,
    protein: macros.protein,
    promo,
  }
}