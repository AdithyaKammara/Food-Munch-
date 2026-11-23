import { useEffect, useState } from 'react'
import { Check, Star } from 'lucide-react'
import {
  TRACKING_STEPS,
  paymentLabel,
  trackingProgress,
  trackingStep,
} from '../../lib/orders'
import { useOrdersStore } from '../../store/ordersStore'
import { useUiStore } from '../../store/uiStore'
import { buttonClasses } from '../ui/buttonClasses'
import Modal from '../ui/Modal'
import Price from '../ui/Price'

export default function TrackingDialog() {
  const open = useUiStore((s) => s.panel === 'tracking')
  const closePanel = useUiStore((s) => s.closePanel)

  // Every way out (button, X, Esc, clicking outside) lands here, so a delivered order always finishes.
  const close = () => {
    const { orders, activeOrderId, setActive } = useOrdersStore.getState()
    const active = orders.find((o) => o.id === activeOrderId)
    if (active && trackingStep(active.placedAt, Date.now()) === 4) setActive(null)
    closePanel()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Order status"
      description="Demo timeline: it is simulated, not real GPS tracking."
      size="lg"
    >
      <TrackingBody onClose={close} />
    </Modal>
  )
}

function TrackingBody({ onClose }: { onClose: () => void }) {
  const activeOrder = useOrdersStore((s) => s.orders.find((o) => o.id === s.activeOrderId))
  const rateOrder = useOrdersStore((s) => s.rateOrder)

  // Closing a delivered order clears it, so keep showing it while the dialog fades out.
  const [lastOrder, setLastOrder] = useState(activeOrder)
  if (activeOrder && activeOrder !== lastOrder) setLastOrder(activeOrder)
  const order = activeOrder ?? lastOrder

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!order) {
    return <p className="text-ink-600">There is no active order to track.</p>
  }

  const step = trackingStep(order.placedAt, now)
  const percent = Math.round(trackingProgress(order.placedAt, now) * 100)
  const delivered = step === 4

  return (
    <div className="space-y-5">
      <p className="rounded-sm bg-cream-200 p-3 text-sm">
        This timeline is a demo that speeds through in about 30 seconds. A real service would need a
        server and rider location updates.
      </p>

      <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
        <div>
          <dt className="inline text-ink-600">Order: </dt>
          <dd className="inline font-semibold">#{order.id}</dd>
        </div>
        <div>
          <dt className="inline text-ink-600">Total: </dt>
          <dd className="inline font-semibold">
            <Price amount={order.totals.total} plain />
          </dd>
        </div>
        <div>
          <dt className="inline text-ink-600">Delivery: </dt>
          <dd className="inline font-semibold">{order.slot}</dd>
        </div>
        <div>
          <dt className="inline text-ink-600">Payment: </dt>
          <dd className="inline font-semibold">{paymentLabel(order)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="inline text-ink-600">Address: </dt>
          <dd className="inline font-semibold">{order.address}</dd>
        </div>
      </dl>

      <div
        role="progressbar"
        aria-label="Delivery progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-2 overflow-hidden rounded-full bg-line-200"
      >
        <div className="h-full origin-left rounded-full bg-copper-600 transition-transform" style={{ transform: `scaleX(${percent / 100})` }} />
      </div>

      <p role="status" className="sr-only">
        {TRACKING_STEPS[step - 1].title}
      </p>

      <ol className="space-y-4">
        {TRACKING_STEPS.map((s) => {
          const done = s.step < step || delivered
          const current = s.step === step && !delivered
          return (
            <li key={s.step} aria-current={current ? 'step' : undefined} className="flex gap-3">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                  done
                    ? 'bg-veg text-cream-50'
                    : current
                      ? 'bg-copper-600 text-white'
                      : 'bg-line-200 text-ink-600'
                }`}
              >
                {done ? <Check size={14} aria-hidden="true" /> : s.step}
              </span>
              <div className={done || current ? '' : 'opacity-60'}>
                <p className="font-display text-title font-semibold">
                  {s.title}
                  {done && <span className="sr-only"> (done)</span>}
                </p>
                <p className="text-sm text-ink-600">{s.text}</p>
              </div>
            </li>
          )
        })}
      </ol>

      {delivered && (
        <div className="rounded-md border border-line-200 p-4 text-center">
          <p className="font-display text-title font-semibold">Rate your order</p>
          <div className="mt-2 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`Rate ${n} out of 5`}
                aria-pressed={order.rating === n}
                onClick={() => rateOrder(order.id, n)}
                className="grid size-11 place-items-center rounded-full hover:bg-cream-200"
              >
                <Star
                  size={26}
                  aria-hidden="true"
                  className={(order.rating ?? 0) >= n ? 'fill-star text-star' : 'text-ink-600'}
                />
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-ink-600">Saved on this device only.</p>
        </div>
      )}

      <button
        type="button"
        onClick={onClose}
        className={buttonClasses(delivered ? 'primary' : 'secondary', 'lg', 'w-full')}
      >
        {delivered ? 'Done' : 'Close (reopen from Track order)'}
      </button>
    </div>
  )
}