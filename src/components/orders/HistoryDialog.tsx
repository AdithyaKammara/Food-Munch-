import { useState } from 'react'
import { CircleCheck, Clock, RefreshCw, Star, Truck, Utensils } from 'lucide-react'
import { MENU_ITEMS } from '../../data/menu'
import { paymentLabel, trackingStep, type Order } from '../../lib/orders'
import { useCartStore } from '../../store/cartStore'
import { useOrdersStore } from '../../store/ordersStore'
import { useUiStore } from '../../store/uiStore'
import { buttonClasses } from '../ui/buttonClasses'
import Modal from '../ui/Modal'
import Price from '../ui/Price'

/** Orders placed in this browser, newest first, with Track and Reorder. Behaviour unchanged. */
export default function HistoryDialog() {
  const open = useUiStore((s) => s.panel === 'history')
  const closePanel = useUiStore((s) => s.closePanel)

  return (
    <Modal
      open={open}
      onClose={closePanel}
      size="xl"
      title="Order history"
      description="Orders placed in this browser."
      closeLabel="Close order history"
    >
      <HistoryBody />
    </Modal>
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
      <div className="rounded-md border border-dashed border-line-200 px-6 py-10 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-cream-300 text-copper-600">
          <Utensils size={28} aria-hidden="true" />
        </span>
        <p className="mt-4 font-display text-title font-semibold">No orders yet</p>
        <p className="mt-1 text-ink-600">Your orders will appear here after checkout.</p>
        <a
          href="#menu"
          onClick={closePanel}
          className={buttonClasses('primary', 'md', 'mt-6')}
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
    <li className="rounded-md border border-line-200 bg-cream-50 p-5 sm:p-6">
      {/* Top row: id, date, status */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-title font-semibold sm:text-display-md">#{order.id}</p>
          <p className="mt-1 text-sm text-ink-600">
            {placed} · {paymentLabel(order)}
          </p>
        </div>
        {delivered ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-3 py-1.5 text-sm font-semibold text-success">
            <CircleCheck size={18} aria-hidden="true" className="fill-veg text-cream-50" />
            Delivered
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-3 py-1.5 text-sm font-semibold text-copper-700">
            <Clock size={17} aria-hidden="true" />
            In progress
          </span>
        )}
      </div>

      {/* Items with their photos */}
      <ul className="mt-5 space-y-3">
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
                  className="size-14 shrink-0 rounded-sm object-cover"
                />
              ) : (
                <span className="grid size-14 shrink-0 place-items-center rounded-sm bg-cream-300 text-copper-500">
                  <Utensils size={24} aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0">
                <p className="font-semibold leading-snug">
                  {item.title} × {item.qty}
                </p>
                {item.options && <p className="mt-0.5 text-sm text-ink-600">{item.options}</p>}
              </div>
            </li>
          )
        })}
      </ul>

      {/* Total and actions */}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-line-200 pt-5">
        <div>
          <p className="text-sm text-ink-600">Total</p>
          <Price amount={order.totals.total} className="block text-[1.625rem] leading-tight" />
          {order.totals.discount > 0 && (
            <p className="mt-0.5 text-sm font-semibold text-success">
              Saved <Price amount={order.totals.discount} plain className="font-semibold" />
              {order.promoCode ? ` with ${order.promoCode}` : ''}
            </p>
          )}
          {order.rating !== null && (
            <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-ink-600">
              <Star size={14} aria-hidden="true" className="fill-star text-star" />
              You rated this {order.rating} out of 5
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {!delivered && (
            <button
              type="button"
              onClick={onTrack}
              className={buttonClasses('secondary', 'md')}
            >
              <Truck size={18} aria-hidden="true" />
              Track
            </button>
          )}
          <button
            type="button"
            onClick={onReorder}
            aria-label={`Reorder #${order.id}`}
            className={buttonClasses('primary', 'md', 'group')}
          >
            <RefreshCw size={18} aria-hidden="true" className="motion-safe:transition-[rotate] motion-safe:duration-500 motion-safe:group-hover:rotate-180" />
            Reorder
          </button>
        </div>
      </div>
    </li>
  )
}
