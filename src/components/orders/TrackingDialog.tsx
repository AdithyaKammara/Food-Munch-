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
import Modal from '../ui/Modal'

export default function TrackingDialog() {
  const open = useUiStore((s) => s.panel === 'tracking')
  const closePanel = useUiStore((s) => s.closePanel)

  return (
    <Modal
      open={open}
      onClose={closePanel}
      title="Order status"
      description="Demo timeline: it is simulated, not real GPS tracking."
      wide
    >
      <TrackingBody />
    </Modal>
  )
}

function TrackingBody() {
  const order = useOrdersStore((s) => s.orders.find((o) => o.id === s.activeOrderId))
  const setActive = useOrdersStore((s) => s.setActive)
  const rateOrder = useOrdersStore((s) => s.rateOrder)
  const closePanel = useUiStore((s) => s.closePanel)

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!order) {
    return <p className="text-muted">There is no active order to track.</p>
  }

  const step = trackingStep(order.placedAt, now)
  const percent = Math.round(trackingProgress(order.placedAt, now) * 100)
  const delivered = step === 4

  return (
    <div className="space-y-5">
      <p className="rounded-xl bg-cream-deep p-3 text-sm">
        This timeline is a demo that speeds through in about 30 seconds. A real service would need a
        server and rider location updates.
      </p>

      <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
        <div>
          <dt className="inline text-muted">Order: </dt>
          <dd className="inline font-semibold">#{order.id}</dd>
        </div>
        <div>
          <dt className="inline text-muted">Total: </dt>
          <dd className="inline font-semibold">₹{order.totals.total}</dd>
        </div>
        <div>
          <dt className="inline text-muted">Delivery: </dt>
          <dd className="inline font-semibold">{order.slot}</dd>
        </div>
        <div>
          <dt className="inline text-muted">Payment: </dt>
          <dd className="inline font-semibold">{paymentLabel(order)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="inline text-muted">Address: </dt>
          <dd className="inline font-semibold">{order.address}</dd>
        </div>
      </dl>

      <div
        role="progressbar"
        aria-label="Delivery progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-2 overflow-hidden rounded-full bg-line"
      >
        <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${percent}%` }} />
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
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                  done
                    ? 'bg-green-700 text-white'
                    : current
                      ? 'bg-gold text-on-gold'
                      : 'bg-line text-muted'
                }`}
              >
                {done ? <Check size={14} aria-hidden="true" /> : s.step}
              </span>
              <div className={done || current ? '' : 'opacity-60'}>
                <p className="font-bold">
                  {s.title}
                  {done && <span className="sr-only"> (done)</span>}
                </p>
                <p className="text-sm text-muted">{s.text}</p>
              </div>
            </li>
          )
        })}
      </ol>

      {delivered && (
        <div className="rounded-xl border border-line p-4 text-center">
          <p className="font-bold">Rate your order</p>
          <div className="mt-2 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`Rate ${n} out of 5`}
                aria-pressed={order.rating === n}
                onClick={() => rateOrder(order.id, n)}
                className="p-1"
              >
                <Star
                  size={26}
                  aria-hidden="true"
                  className={(order.rating ?? 0) >= n ? 'fill-gold text-gold-dark' : 'text-muted'}
                />
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-muted">Saved on this device only.</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (delivered) setActive(null)
          closePanel()
        }}
        className="w-full rounded-full bg-gold px-6 py-3 font-bold text-on-gold shadow-card hover:shadow-card-hover"
      >
        {delivered ? 'Done' : 'Close (reopen from Track order)'}
      </button>
    </div>
  )
}