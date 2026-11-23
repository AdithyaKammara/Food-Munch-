import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Info, Minus, Plus, ShoppingBag, Trash2, Utensils, X } from 'lucide-react'
import { clsx } from 'clsx'
import { MENU_ITEMS } from '../../data/menu'
import { describeLine } from '../../lib/orders'
import { PROMOS, calcTotals, lineKey, parsePromoCode, unitPrice, type CartLine } from '../../lib/pricing'
import { useCartStore } from '../../store/cartStore'
import { useOrdersStore } from '../../store/ordersStore'
import { useUiStore } from '../../store/uiStore'
import { buttonClasses } from '../ui/buttonClasses'
import Price from '../ui/Price'

const TIP_OPTIONS = [20, 50, 100]

// Small round steppers and chips share the toolbar's pill style (component-guidelines.md §11).
const chip = 'h-11 rounded-full border px-4 text-[0.9375rem] font-semibold transition-colors duration-150'

/**
 * The cart drawer (component-guidelines.md §11). Behaviour is unchanged: quantities, removal,
 * promo codes, the rider tip and the bill all work as before. Only the look is new.
 */
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
        <Dialog.Overlay className="motion-overlay fixed inset-0 z-50 bg-forest-950/50" />
        <Dialog.Content className="motion-drawer fixed right-0 top-0 z-50 flex h-full w-full max-w-[30rem] flex-col bg-cream-50 text-ink-900 shadow-dialog">
          {/* ---------- Header ---------- */}
          <div className="flex items-start gap-4 border-b border-line-200 px-5 pb-4 pt-5 sm:px-6">
            <div className="min-w-0 flex-1">
              <Dialog.Title className="font-display text-display-md font-semibold">Your cart</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-ink-600">
                {lines.length > 0
                  ? `${totals.calories} kcal · ${totals.protein}g protein in total`
                  : 'Nothing here yet.'}
              </Dialog.Description>
            </div>
            <Dialog.Close aria-label="Close cart" className={buttonClasses('quiet', 'md', '-mr-1')}>
              <X size={20} aria-hidden="true" />
            </Dialog.Close>
          </div>

          {lines.length === 0 ? (
            <EmptyCart onBrowse={closePanel} />
          ) : (
            <>
              {/* ---------- Scrolling middle ---------- */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6">
                <ul className="divide-y divide-line-200">
                  {lines.map((line, i) => (
                    <CartItem
                      key={lineKey(line)}
                      index={i}
                      line={line}
                      onChange={(delta) => changeQty(lineKey(line), delta)}
                    />
                  ))}
                </ul>

                {/* Promo code */}
                <section className="border-t border-line-200 py-5">
                  <label htmlFor="promo-input" className="font-display text-title font-semibold">
                    Promo code
                  </label>
                  <div className="mt-2.5 flex gap-2">
                    <input
                      id="promo-input"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                      placeholder="FIRST50, MUNCH10, FEAST75"
                      aria-describedby="promo-status"
                      autoCapitalize="characters"
                      autoCorrect="off"
                      spellCheck={false}
                      className="h-11 min-w-0 flex-1 rounded-full border border-field-500 bg-cream-50 px-4 text-base uppercase placeholder:normal-case placeholder:text-ink-600 focus:border-copper-600"
                    />
                    <button type="button" onClick={applyPromo} className={buttonClasses('secondary', 'md')}>
                      Apply
                    </button>
                  </div>
                  <div id="promo-status" role="status" className="mt-2 text-sm empty:hidden">
                    {promoError && <span className="font-medium text-nonveg">{promoError}</span>}
                    {!promoError && promoCode && totals.promo?.applicable && (
                      <span className="font-semibold text-success">
                        {promoCode} applied: {PROMOS[promoCode].title}.{' '}
                        <button type="button" onClick={removePromo} className="underline underline-offset-2">
                          Remove
                        </button>
                      </span>
                    )}
                    {!promoError && promoCode && totals.promo && !totals.promo.applicable && (
                      <span className="text-nonveg">
                        {totals.promo.reason}.{' '}
                        <button type="button" onClick={removePromo} className="underline underline-offset-2">
                          Remove
                        </button>
                      </span>
                    )}
                  </div>
                </section>

                {/* Rider tip */}
                <section className="border-t border-line-200 py-5">
                  <p id="tip-label" className="font-display text-title font-semibold">
                    Rider tip
                  </p>
                  <p className="text-sm text-ink-600">Optional. Tap again to remove.</p>
                  <div role="group" aria-labelledby="tip-label" className="mt-3 flex flex-wrap gap-2">
                    {TIP_OPTIONS.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        aria-pressed={tip === amount}
                        onClick={() => setTip(amount)}
                        className={clsx(
                          chip,
                          tip === amount
                            ? 'border-copper-600 bg-copper-600 text-white'
                            : 'border-line-200 bg-cream-50 hover:border-copper-600',
                        )}
                      >
                        <Price amount={amount} plain className="font-semibold" />
                      </button>
                    ))}
                  </div>
                </section>

                {/* Bill details */}
                <dl className="space-y-2 border-t border-line-200 py-5 text-[0.9375rem]">
                  <Row label="Subtotal" value={<Price amount={totals.subtotal} plain className="font-medium" />} />
                  <Row
                    label="Discount"
                    value={
                      totals.discount > 0 ? (
                        <span className="font-semibold text-success">
                          −<Price amount={totals.discount} plain className="font-semibold" />
                        </span>
                      ) : (
                        <Price amount={0} plain className="font-medium" />
                      )
                    }
                  />
                  <Row label="GST (5% after discount)" value={<Price amount={totals.tax} plain className="font-medium" />} />
                  <Row label="Rider tip" value={<Price amount={totals.tip} plain className="font-medium" />} />
                </dl>
              </div>

              {/* ---------- Pinned bottom ---------- */}
              <div className="border-t border-line-200 bg-cream-100 px-5 pb-5 pt-4 sm:px-6">
                <dl className="flex items-baseline justify-between">
                  <dt className="font-display text-title font-semibold">Grand total</dt>
                  <dd>
                    {/* key: a fresh element (and a small pop) whenever the total changes */}
                    <span key={totals.total} className="motion-pop inline-block">
                      <Price amount={totals.total} className="text-[1.625rem] leading-none" />
                    </span>
                  </dd>
                </dl>
                <button
                  type="button"
                  onClick={() => openPanel('checkout')}
                  className={buttonClasses('primary', 'lg', 'mt-4 w-full')}
                >
                  Place order
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.8125rem] text-ink-600">
                  <Info size={14} aria-hidden="true" />
                  Demo checkout: no real payment is taken.
                </p>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function CartItem({
  line,
  index,
  onChange,
}: {
  line: CartLine
  index: number
  onChange: (delta: number) => void
}) {
  const item = MENU_ITEMS.find((m) => m.id === line.itemId)
  const title = item?.title ?? 'Unknown dish'

  // Removing: the line collapses first, then leaves the cart.
  // The timer is a safety net in case the animation event never fires (reduced motion has none).
  const [removing, setRemoving] = useState(false)
  useEffect(() => {
    if (!removing) return
    const timer = setTimeout(() => onChange(-line.qty), 300)
    return () => clearTimeout(timer)
  }, [removing, onChange, line.qty])

  return (
    <li
      style={{ '--i': index } as CSSProperties}
      onAnimationEnd={(e) => {
        if (removing && e.target === e.currentTarget) onChange(-line.qty)
      }}
      className={clsx(removing ? 'motion-collapse' : 'motion-rise', 'flex gap-4 py-4')}
    >
      {item ? (
        <img src={item.image} alt="" width={80} height={80} className="size-16 shrink-0 rounded-sm object-cover sm:size-[4.5rem]" />
      ) : (
        <span className="grid size-16 shrink-0 place-items-center rounded-sm bg-cream-300 text-copper-500 sm:size-[4.5rem]">
          <Utensils size={24} aria-hidden="true" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display text-title font-semibold leading-snug">{title}</p>
            <p className="mt-0.5 text-sm text-ink-600">{describeLine(line)}</p>
          </div>
          <button
            type="button"
            aria-label={`Remove ${title} from cart`}
            disabled={removing}
            onClick={() => setRemoving(true)}
            className="-mr-2 -mt-1.5 grid size-11 shrink-0 place-items-center rounded-full text-ink-600 transition-colors hover:bg-cream-300 hover:text-nonveg"
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-sm text-ink-600">
            <Price amount={unitPrice(line)} plain className="font-semibold text-ink-900" /> each
          </p>
          <div className="flex items-center gap-1 rounded-full border border-line-200 p-0.5">
            <button
              type="button"
              aria-label={`Decrease quantity of ${title}`}
              onClick={() => onChange(-1)}
              className="grid size-10 place-items-center rounded-full text-copper-700 transition-colors hover:bg-cream-300 motion-safe:active:scale-94"
            >
              <Minus size={16} aria-hidden="true" />
            </button>
            <span className="tabular w-6 text-center font-semibold" aria-live="polite">
              <span className="sr-only">Quantity </span>
              <span key={line.qty} className="motion-pop inline-block">
                {line.qty}
              </span>
            </span>
            <button
              type="button"
              aria-label={`Increase quantity of ${title}`}
              onClick={() => onChange(1)}
              className="grid size-10 place-items-center rounded-full text-copper-700 transition-colors hover:bg-cream-300 motion-safe:active:scale-94"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

function EmptyCart({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="grid flex-1 place-items-center px-6 pb-16 text-center">
      <div className="motion-rise">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-cream-300 text-copper-600">
          <ShoppingBag size={28} aria-hidden="true" />
        </span>
        <p className="mt-5 font-display text-display-md font-semibold">Your cart is empty</p>
        <p className="mt-1 text-ink-600">Add a dish or two and it will show up here.</p>
        <a href="#menu" onClick={onBrowse} className={buttonClasses('primary', 'md', 'mt-6')}>
          Browse the menu
        </a>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink-600">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
