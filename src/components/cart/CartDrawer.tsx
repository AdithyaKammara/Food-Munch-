import { useState, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  ArrowRight,
  BadgePercent,
  HandHeart,
  Info,
  Minus,
  Plus,
  Receipt,
  ShoppingBag,
  TicketPercent,
  Trash2,
  Utensils,
  Wallet,
  X,
} from 'lucide-react'
import { MENU_ITEMS } from '../../data/menu'
import { describeLine } from '../../lib/orders'
import { PROMOS, calcTotals, lineKey, parsePromoCode, unitPrice, type CartLine } from '../../lib/pricing'
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[34rem] flex-col bg-[#fffaf1] shadow-[0_0_60px_rgba(0,0,0,0.25)]">
          {/* ---------- Header ---------- */}
          <div className="flex items-center gap-4 px-5 pb-4 pt-5 sm:px-6">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#ffeec2] text-ink sm:h-16 sm:w-16">
              <ShoppingBag size={28} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <Dialog.Title className="font-display text-2xl font-extrabold tracking-[-0.03em]">Your Bag</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[15px] text-muted">
                {lines.length > 0
                  ? `${totals.calories} kcal · ${totals.protein}g protein in total`
                  : 'Nothing here yet.'}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close cart"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#eee2c8] bg-white transition-transform hover:scale-105 active:scale-95"
            >
              <X size={22} aria-hidden="true" />
            </Dialog.Close>
          </div>

          {lines.length === 0 ? (
            <EmptyBag onBrowse={closePanel} />
          ) : (
            <>
              {/* ---------- Scrolling middle ---------- */}
              <div className="flex-1 space-y-3.5 overflow-y-auto px-4 pb-4 sm:px-6">
                <ul className="space-y-2.5">
                  {lines.map((line) => (
                    <BagItem
                      key={lineKey(line)}
                      line={line}
                      onChange={(delta) => changeQty(lineKey(line), delta)}
                    />
                  ))}
                </ul>

                {/* Promo code */}
                <section className="rounded-2xl border-2 border-dashed border-[#efdcae] bg-white/70 px-4 py-3.5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <TicketPercent size={34} aria-hidden="true" className="mt-4 hidden shrink-0 text-gold-dark sm:block" />
                    <div className="min-w-0 flex-1">
                      <label htmlFor="promo-input" className="font-semibold">
                        Promo code
                      </label>
                      <div className="mt-2 flex gap-2">
                        <input
                          id="promo-input"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                          placeholder="FIRST50, MUNCH10, FEAST75"
                          aria-describedby="promo-status"
                          className="min-w-0 flex-1 rounded-full border border-[#eee2c8] bg-white px-4 py-3 text-sm uppercase placeholder:normal-case placeholder:text-muted focus:border-gold"
                        />
                        <button
                          type="button"
                          onClick={applyPromo}
                          className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-transform active:scale-95"
                        >
                          Apply
                        </button>
                      </div>
                      <div id="promo-status" role="status" className="mt-2 text-sm empty:hidden">
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
                  </div>
                </section>

                {/* Rider tip */}
                <section className="flex flex-wrap items-center gap-x-3 gap-y-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-[#f1e6cf]">
                  <HandHeart size={30} aria-hidden="true" className="shrink-0 text-gold-dark" />
                  <div className="min-w-0 flex-1">
                    <p id="tip-label" className="font-semibold">
                      Rider tip
                    </p>
                    <p className="text-xs text-muted">Optional. Tap again to remove.</p>
                  </div>
                  <div role="group" aria-labelledby="tip-label" className="flex gap-2">
                    {TIP_OPTIONS.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        aria-pressed={tip === amount}
                        onClick={() => setTip(amount)}
                        className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                          tip === amount
                            ? 'border-gold bg-gold text-on-gold'
                            : 'border-[#eee2c8] bg-white hover:border-gold'
                        }`}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Bill details */}
                <dl className="space-y-2 px-1 text-[15px]">
                  <Row icon={<Receipt size={18} />} label="Subtotal" value={`₹${totals.subtotal}`} />
                  <Row
                    icon={<BadgePercent size={18} />}
                    label="Discount"
                    value={`-₹${totals.discount}`}
                    valueClass={totals.discount > 0 ? 'font-semibold text-green-800' : undefined}
                  />
                  <Row icon={<Receipt size={18} />} label="GST (5% after discount)" value={`₹${totals.tax}`} />
                  <Row icon={<HandHeart size={18} />} label="Rider tip" value={`₹${totals.tip}`} />
                </dl>
              </div>

              {/* ---------- Fixed bottom ---------- */}
              <div className="border-t border-[#eee2c8] bg-[#fffaf1] px-4 pb-5 pt-4 sm:px-6">
                <dl className="flex items-center justify-between px-1">
                  <dt className="flex items-center gap-3 font-display text-xl font-extrabold">
                    <Wallet size={22} aria-hidden="true" />
                    Grand total
                  </dt>
                  <dd className="font-display text-2xl font-extrabold">₹{totals.total}</dd>
                </dl>
                <button
                  type="button"
                  onClick={() => openPanel('checkout')}
                  className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-lg font-bold text-on-gold shadow-[0_12px_24px_rgba(255,191,0,0.4)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Place Order
                  <ArrowRight size={20} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
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

function BagItem({ line, onChange }: { line: CartLine; onChange: (delta: number) => void }) {
  const item = MENU_ITEMS.find((m) => m.id === line.itemId)
  const title = item?.title ?? 'Unknown dish'

  return (
    <li className="relative flex gap-3 rounded-2xl bg-white p-3 pr-4 shadow-[0_4px_14px_rgba(79,54,10,0.06)] ring-1 ring-[#f1e6cf] sm:gap-4">
      {item ? (
        <img
          src={item.image}
          alt=""
          width={96}
          height={96}
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-cream-deep text-gold-dark">
          <Utensils size={24} aria-hidden="true" />
        </span>
      )}

      <div className="flex min-w-0 flex-1 flex-col justify-center pr-7">
        <p className="font-bold leading-snug">{title}</p>
        <p className="mt-0.5 text-sm text-muted">{describeLine(line)}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-bold text-gold-text">₹{unitPrice(line)} each</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Decrease quantity of ${title}`}
              onClick={() => onChange(-1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#eee2c8] bg-white text-gold-dark transition-colors hover:border-gold active:scale-90"
            >
              <Minus size={16} aria-hidden="true" />
            </button>
            <span className="w-5 text-center font-bold" aria-live="polite">
              <span className="sr-only">Quantity </span>
              {line.qty}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity of ${title}`}
              onClick={() => onChange(1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#eee2c8] bg-white text-gold-dark transition-colors hover:border-gold active:scale-90"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label={`Remove ${title} from bag`}
        onClick={() => onChange(-line.qty)}
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full text-gold-dark transition-colors hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 size={17} aria-hidden="true" />
      </button>
    </li>
  )
}

function EmptyBag({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="grid flex-1 place-items-center px-6 pb-16 text-center">
      <div>
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#ffeec2] text-gold-dark">
          <ShoppingBag size={36} aria-hidden="true" />
        </span>
        <p className="mt-5 font-display text-2xl font-extrabold">Your bag is empty</p>
        <p className="mt-1 text-muted">Add a dish or two and it will show up here.</p>
        <a
          href="#menu"
          onClick={onBrowse}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-bold text-on-gold transition-transform hover:-translate-y-0.5"
        >
          Browse the menu <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}

function Row({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: ReactNode
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-3 text-ink/80">
        <span aria-hidden="true" className="text-gold-text">
          {icon}
        </span>
        {label}
      </dt>
      <dd className={valueClass ?? 'font-medium'}>{value}</dd>
    </div>
  )
}
