import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { CircleCheck, Clock, ReceiptText, RefreshCw, Sprout, Star, Truck, Utensils, X } from 'lucide-react'
import { MENU_ITEMS } from '../../data/menu'
import { paymentLabel, trackingStep, type Order } from '../../lib/orders'
import { useCartStore } from '../../store/cartStore'
import { useOrdersStore } from '../../store/ordersStore'
import { useUiStore } from '../../store/uiStore'

export default function HistoryDialog() {
  const open = useUiStore((s) => s.panel === 'history')
  const closePanel = useUiStore((s) => s.closePanel)

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) closePanel()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="motion-overlay fixed inset-0 z-50 bg-black/45" />
        <Dialog.Content className="motion-dialog fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-1.5rem)] max-w-[40rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[1.75rem] bg-[#fffaf1] shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
          {/* ---------- Header ---------- */}
          <div className="relative flex items-center gap-4 px-5 pb-5 pt-6 sm:gap-5 sm:px-8 sm:pt-7">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#ffe7a3] text-ink sm:h-[4.5rem] sm:w-[4.5rem]">
              <ReceiptText size={30} aria-hidden="true" />
            </span>
            <div className="min-w-0 pr-12">
              <Dialog.Title className="font-display text-2xl font-extrabold tracking-[-0.03em] sm:text-[2rem]">
                Order history
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[15px] text-muted sm:text-base">
                Orders placed in this browser.
              </Dialog.Description>
            </div>

            {/* Faint leaf drawing, like the reference */}
            <Sprout
              aria-hidden="true"
              strokeWidth={1.2}
              className="pointer-events-none absolute right-24 top-10 hidden h-16 w-16 text-gold-dark/25 sm:block"
            />

            <Dialog.Close
              aria-label="Close order history"
              className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full border border-[#eee2c8] bg-white shadow-sm transition-transform hover:scale-105 active:scale-95 sm:right-6 sm:top-6"
            >
              <X size={22} aria-hidden="true" />
            </Dialog.Close>
          </div>

          {/* ---------- Orders (scrolls when there are many) ---------- */}
          <div className="overflow-y-auto px-4 pb-5 sm:px-8 sm:pb-8">
            <HistoryBody />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function HistoryBody() {
  const orders = useOrdersStore((s) => s.orders)
  const setActive = useOrdersStore((s) => s.setActive)
  const addLine = useCartStore((s) => s.addLine)
  const openPanel = useUiStore((s) => s.openPanel)
  const closePanel = useUiStore((s) => s.closePanel)
  // Read the clock once, when the dialog opens.
  const [now] = useState(() => Date.now())

  const reorder = (order: Order) => {
    order.lines.forEach(({ qty, ...line }) => {
      for (let i = 0; i < qty; i++) addLine(line)
    })
    openPanel('cart')
  }

  const track = (order: Order) => {
    setActive(order.id)
    openPanel('tracking')
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-[#eee2c8] bg-white px-6 py-12 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fff3d6] text-gold-dark">
          <Utensils size={28} aria-hidden="true" />
        </span>
        <p className="mt-4 font-display text-xl font-bold">No orders yet</p>
        <p className="mt-1 text-muted">Your orders will appear here after checkout.</p>
        <a
          href="#menu"
          onClick={closePanel}
          className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 font-bold text-on-gold transition-transform hover:-translate-y-0.5"
        >
          Browse the menu
        </a>
      </div>
    )
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          delivered={trackingStep(order.placedAt, now) === 4}
          onReorder={() => reorder(order)}
          onTrack={() => track(order)}
        />
      ))}
    </ul>
  )
}

interface CardProps {
  order: Order
  delivered: boolean
  onReorder: () => void
  onTrack: () => void
}

function OrderCard({ order, delivered, onReorder, onTrack }: CardProps) {
  const placed = new Date(order.placedAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <li className="rounded-3xl border border-[#eee2c8] bg-white p-5 sm:p-7">
      {/* Top row: id, date, status */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-xl font-extrabold sm:text-2xl">#{order.id}</p>
          <p className="mt-1 text-sm text-muted sm:text-[15px]">
            {placed} · {paymentLabel(order)}
          </p>
        </div>
        {delivered ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3.5 py-1.5 text-sm font-bold text-green-800 ring-1 ring-green-100">
            <CircleCheck size={18} aria-hidden="true" className="fill-green-700 text-white" />
            Delivered
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff3d6] px-3.5 py-1.5 text-sm font-bold text-gold-text">
            <Clock size={17} aria-hidden="true" />
            In progress
          </span>
        )}
      </div>

      {/* Items with their photos */}
      <ul className="mt-5 space-y-4">
        {order.items.map((item, index) => {
          const image = MENU_ITEMS.find((m) => m.id === item.itemId)?.image
          return (
            <li key={`${item.itemId}-${index}`} className="flex items-center gap-4">
              {image ? (
                <img
                  src={image}
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover sm:h-20 sm:w-20"
                />
              ) : (
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-cream-deep text-gold-dark sm:h-20 sm:w-20">
                  <Utensils size={24} aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0">
                <p className="text-[17px] font-semibold leading-snug sm:text-lg">
                  {item.title} × {item.qty}
                </p>
                {item.options && <p className="mt-0.5 text-sm text-muted sm:text-[15px]">{item.options}</p>}
              </div>
            </li>
          )
        })}
      </ul>

      {/* Total and actions */}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-[#eee2c8] pt-5">
        <div>
          <p className="text-sm text-muted">Total</p>
          <p className="font-display text-3xl font-extrabold">₹{order.totals.total}</p>
          {order.totals.discount > 0 && (
            <p className="mt-0.5 text-sm font-semibold text-green-800">
              Saved ₹{order.totals.discount}
              {order.promoCode ? ` with ${order.promoCode}` : ''}
            </p>
          )}
          {order.rating !== null && (
            <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-muted">
              <Star size={14} aria-hidden="true" className="fill-gold text-gold-dark" />
              You rated this {order.rating} out of 5
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {!delivered && (
            <button
              type="button"
              onClick={onTrack}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#eee2c8] bg-white px-5 py-3 font-bold transition-colors hover:border-gold"
            >
              <Truck size={19} aria-hidden="true" />
              Track
            </button>
          )}
          <button
            type="button"
            onClick={onReorder}
            aria-label={`Reorder #${order.id}`}
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-lg font-bold text-on-gold shadow-[0_10px_22px_rgba(255,191,0,0.4)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <RefreshCw size={20} aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-180" />
            Reorder
          </button>
        </div>
      </div>
    </li>
  )
}
