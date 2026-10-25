import { paymentLabel, trackingStep, type Order } from '../../lib/orders'
import { useCartStore } from '../../store/cartStore'
import { useOrdersStore } from '../../store/ordersStore'
import { useUiStore } from '../../store/uiStore'
import Modal from '../ui/Modal'

export default function HistoryDialog() {
  const open = useUiStore((s) => s.panel === 'history')
  const closePanel = useUiStore((s) => s.closePanel)

  return (
    <Modal
      open={open}
      onClose={closePanel}
      title="Order history"
      description="Orders placed in this browser."
      wide
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
  const now = Date.now()

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
    return <p className="text-muted">No orders yet.</p>
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => {
        const delivered = trackingStep(order.placedAt, now) === 4
        return (
          <li key={order.id} className="rounded-xl border border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold">#{order.id}</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  delivered ? 'bg-green-100 text-green-900' : 'bg-cream-deep text-gold-text'
                }`}
              >
                {delivered ? 'Delivered' : 'In progress'}
              </span>
            </div>
            <p className="text-xs text-muted">
              {new Date(order.placedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              {' · '}
              {paymentLabel(order)}
            </p>

            <ul className="mt-3 space-y-1 text-sm">
              {order.items.map((item, index) => (
                <li key={`${item.itemId}-${index}`}>
                  {item.title} × {item.qty}
                  <span className="block text-xs text-muted">{item.options}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="font-extrabold">₹{order.totals.total}</p>
              <div className="flex gap-2">
                {!delivered && (
                  <button
                    type="button"
                    onClick={() => track(order)}
                    className="rounded-full border border-line px-4 py-1.5 text-sm font-semibold hover:border-gold"
                  >
                    Track
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => reorder(order)}
                  className="rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-on-gold"
                >
                  Reorder
                </button>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}