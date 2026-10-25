import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { MENU_ITEMS } from '../../data/menu'
import { describeLine } from '../../lib/orders'
import { PROMOS, calcTotals, lineKey, parsePromoCode, unitPrice } from '../../lib/pricing'
import { useCartStore } from '../../store/cartStore'
import { useOrdersStore } from '../../store/ordersStore'
import { useUiStore } from '../../store/uiStore'

const TIP_OPTIONS = [20, 50, 100]

export default function CartDrawer() {
  const open = useUiStore((s) => s.panel === 'cart')
  const openPanel = useUiStore((s) => s.openPanel)
  const closePanel = useUiStore((s) => s.closePanel)

  const lines = useCartStore((s) => s.lines)
  const promoCode = useCartStore((s) => s.promoCode)
  const tip = useCartStore((s) => s.tip)
  const changeQty = useCartStore((s) => s.changeQty)
  const setPromoCode = useCartStore((s) => s.setPromoCode)
  const setTip = useCartStore((s) => s.setTip)

  const isFirstOrder = useOrdersStore((s) => s.orders.length === 0)

  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')

  const totals = calcTotals({ lines, promoCode, tip, isFirstOrder })

  const applyPromo = () => {
    const code = parsePromoCode(promoInput)
    if (!code) {
      setPromoCode(null)
      setPromoError(promoInput.trim() ? 'That code is not valid.' : 'Enter a code first.')
      return
    }
    setPromoError('')
    setPromoCode(code)
  }

  const removePromo = () => {
    setPromoCode(null)
    setPromoInput('')
    setPromoError('')
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) closePanel()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-card-hover">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-line p-4">
            <div>
              <Dialog.Title className="flex items-center gap-2 text-xl font-extrabold">
                <ShoppingBag size={20} aria-hidden="true" className="text-gold-dark" />
                Your Bag
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted">
                {totals.calories} kcal · {totals.protein}g protein in total
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close cart"
              className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-gold"
            >
              <X size={18} aria-hidden="true" />
            </Dialog.Close>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {lines.length === 0 ? (
              <div className="grid h-full place-items-center text-center text-muted">
                <div>
                  <ShoppingBag size={40} aria-hidden="true" className="mx-auto mb-3" />
                  <p className="font-semibold text-ink">Your bag is empty.</p>
                  <button
                    type="button"
                    onClick={closePanel}
                    className="mt-4 rounded-full bg-gold px-5 py-2 text-sm font-bold text-on-gold"
                  >
                    Browse the menu
                  </button>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {lines.map((line) => {
                  const item = MENU_ITEMS.find((m) => m.id === line.itemId)
                  const key = lineKey(line)
                  return (
                    <li key={key} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="font-bold">{item?.title ?? 'Unknown dish'}</p>
                        <p className="text-xs text-muted">{describeLine(line)}</p>
                        <p className="mt-1 text-sm font-semibold text-gold-text">
                          ₹{unitPrice(line)} each
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item?.title}`}
                          onClick={() => changeQty(key, -1)}
                          className="grid h-8 w-8 place-items-center rounded-full border border-line hover:border-gold"
                        >
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <span className="w-5 text-center font-bold" aria-label={`Quantity ${line.qty}`}>
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item?.title}`}
                          onClick={() => changeQty(key, 1)}
                          className="grid h-8 w-8 place-items-center rounded-full border border-line hover:border-gold"
                        >
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {lines.length > 0 && (
            <div className="space-y-4 border-t border-line bg-cream p-4">
              {/* Promo */}
              <div>
                <label htmlFor="promo-input" className="text-sm font-semibold">
                  Promo code
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    id="promo-input"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                    placeholder="FIRST50, MUNCH10, FEAST75"
                    className="min-w-0 flex-1 rounded-full border border-line bg-surface px-4 py-2 text-sm uppercase placeholder:normal-case"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="rounded-full bg-ink px-5 py-2 text-sm font-bold text-white"
                  >
                    Apply
                  </button>
                </div>
                <div role="status" className="mt-1 min-h-5 text-sm">
                  {promoError && <span className="text-red-700">{promoError}</span>}
                  {!promoError && promoCode && totals.promo?.applicable && (
                    <span className="font-semibold text-green-800">
                      {promoCode} applied: {PROMOS[promoCode].title}.{' '}
                      <button type="button" onClick={removePromo} className="underline">
                        Remove
                      </button>
                    </span>
                  )}
                  {!promoError && promoCode && totals.promo && !totals.promo.applicable && (
                    <span className="text-red-700">
                      {totals.promo.reason}.{' '}
                      <button type="button" onClick={removePromo} className="underline">
                        Remove
                      </button>
                    </span>
                  )}
                </div>
              </div>

              {/* Tip */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Rider tip</span>
                <div className="flex gap-2">
                  {TIP_OPTIONS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      aria-pressed={tip === amount}
                      onClick={() => setTip(amount)}
                      className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                        tip === amount ? 'border-gold bg-gold text-on-gold' : 'border-line bg-surface'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <dl className="space-y-1 text-sm">
                <Row label="Subtotal" value={`₹${totals.subtotal}`} />
                <Row label="Discount" value={`-₹${totals.discount}`} />
                <Row label="GST (5% after discount)" value={`₹${totals.tax}`} />
                <Row label="Rider tip" value={`₹${totals.tip}`} />
                <div className="flex justify-between border-t border-line pt-2 text-base font-extrabold">
                  <dt>Grand total</dt>
                  <dd>₹{totals.total}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => openPanel('checkout')}
                className="w-full rounded-full bg-gold px-6 py-3.5 font-bold text-on-gold shadow-card hover:shadow-card-hover"
              >
                Place Order
              </button>
              <p className="text-center text-xs text-muted">
                Demo checkout: no real payment is taken.
              </p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}