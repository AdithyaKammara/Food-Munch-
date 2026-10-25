import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { buildDeliverySlots, buildOrder, type PaymentMethod } from '../../lib/orders'
import { calcTotals } from '../../lib/pricing'
import { normalizePhone, validateAddress, validateName, validatePhone } from '../../lib/validation'
import { useCartStore } from '../../store/cartStore'
import { useOrdersStore } from '../../store/ordersStore'
import { useUiStore } from '../../store/uiStore'
import { useUserStore } from '../../store/userStore'
import { TextAreaField, TextField } from '../ui/Field'
import Modal from '../ui/Modal'

export default function CheckoutDialog() {
  const open = useUiStore((s) => s.panel === 'checkout')
  const closePanel = useUiStore((s) => s.closePanel)

  return (
    <Modal
      open={open}
      onClose={closePanel}
      title="Checkout"
      description="Demo checkout: no real payment is taken."
      wide
    >
      <CheckoutBody />
    </Modal>
  )
}

type FieldErrors = {
  name: string | null
  phone: string | null
  address: string | null
}

function CheckoutBody() {
  const user = useUserStore((s) => s.user)
  const login = useUserStore((s) => s.login)
  const setAddress = useUserStore((s) => s.setAddress)

  const lines = useCartStore((s) => s.lines)
  const promoCode = useCartStore((s) => s.promoCode)
  const tip = useCartStore((s) => s.tip)
  const clearCart = useCartStore((s) => s.clear)

  const isFirstOrder = useOrdersStore((s) => s.orders.length === 0)
  const addOrder = useOrdersStore((s) => s.addOrder)

  const openPanel = useUiStore((s) => s.openPanel)
  const closePanel = useUiStore((s) => s.closePanel)

  const [slots] = useState(() => buildDeliverySlots(new Date()))
  const [step, setStep] = useState<'details' | 'upi'>('details')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddressText] = useState(user?.address ?? '')
  const [slot, setSlot] = useState(slots[0])
  const [method, setMethod] = useState<PaymentMethod>('UPI')
  const [errors, setErrors] = useState<FieldErrors>({ name: null, phone: null, address: null })

  const totals = calcTotals({ lines, promoCode, tip, isFirstOrder })

  const placeOrder = (paymentMethod: PaymentMethod) => {
    const order = buildOrder({
      lines,
      totals,
      promoCode,
      customerName: (user?.name ?? name).trim(),
      phone: user?.phone ?? normalizePhone(phone),
      address: address.trim(),
      slot,
      paymentMethod,
      now: Date.now(),
    })
    addOrder(order)
    clearCart()
    openPanel('tracking')
  }

  const submit = () => {
    const next: FieldErrors = {
      name: user ? null : validateName(name),
      phone: user ? null : validatePhone(phone),
      address: validateAddress(address),
    }
    setErrors(next)
    if (next.name || next.phone || next.address) return

    if (!user) login(name.trim(), normalizePhone(phone))
    setAddress(address.trim())

    if (method === 'UPI') setStep('upi')
    else placeOrder('COD')
  }

  // ---------- Empty bag ----------
  if (lines.length === 0) {
    return (
      <div className="text-center">
        <p className="font-semibold">Your bag is empty.</p>
        <button
          type="button"
          onClick={closePanel}
          className="mt-4 rounded-full bg-gold px-5 py-2 text-sm font-bold text-on-gold"
        >
          Back to the menu
        </button>
      </div>
    )
  }

  // ---------- Demo UPI step ----------
  if (step === 'upi') {
    return (
      <div className="text-center">
        <p className="rounded-xl bg-cream-deep p-3 text-sm font-semibold">
          Demo payment: scanning this code does nothing and no money moves.
        </p>

        <div
          role="img"
          aria-label="Demo QR code, not a real payment"
          className="mx-auto mt-4 inline-block rounded-xl border border-line bg-white p-4"
        >
          <QRCodeSVG
            value={`FOOD MUNCH DEMO ONLY - NOT A REAL PAYMENT - INR ${totals.total}`}
            size={168}
          />
        </div>

        <p className="mt-3 font-display text-2xl font-extrabold">₹{totals.total}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted">
          A real UPI payment must be confirmed by a payment provider on a server. This button only
          simulates that confirmation.
        </p>

        <button
          type="button"
          onClick={() => placeOrder('UPI')}
          className="mt-5 w-full rounded-full bg-gold px-6 py-3.5 font-bold text-on-gold shadow-card hover:shadow-card-hover"
        >
          Simulate successful payment
        </button>
        <button
          type="button"
          onClick={() => setStep('details')}
          className="mt-2 w-full rounded-full px-6 py-2.5 text-sm font-semibold text-muted hover:text-ink"
        >
          Back
        </button>
      </div>
    )
  }

  // ---------- Details form ----------
  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      {user ? (
        <p className="rounded-xl bg-cream-deep p-3 text-sm">
          Ordering as <strong>{user.name}</strong> · {user.phone}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            autoComplete="name"
          />
          <TextField
            label="Phone number"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            autoComplete="tel"
            maxLength={16}
          />
        </div>
      )}

      <TextAreaField
        label="Delivery address"
        rows={3}
        value={address}
        onChange={(e) => setAddressText(e.target.value)}
        error={errors.address}
        hint="House or flat number, street, landmark."
        autoComplete="street-address"
      />

      <div>
        <label htmlFor="checkout-slot" className="text-sm font-semibold">
          Delivery time
        </label>
        <select
          id="checkout-slot"
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm"
        >
          {slots.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">Payment method</legend>

        <label className="mt-2 flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3">
          <input
            type="radio"
            name="payment"
            checked={method === 'UPI'}
            onChange={() => setMethod('UPI')}
            className="mt-1 accent-gold-dark"
          />
          <span>
            <span className="font-semibold">UPI QR (demo)</span>
            <span className="block text-xs text-muted">Simulated: no money moves.</span>
          </span>
        </label>

        <label className="mt-2 flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3">
          <input
            type="radio"
            name="payment"
            checked={method === 'COD'}
            onChange={() => setMethod('COD')}
            className="mt-1 accent-gold-dark"
          />
          <span>
            <span className="font-semibold">Cash on Delivery</span>
            <span className="block text-xs text-muted">Pay at the door.</span>
          </span>
        </label>
      </fieldset>

      <dl className="space-y-1 rounded-xl bg-cream p-4 text-sm">
        <SummaryRow label="Subtotal" value={`₹${totals.subtotal}`} />
        <SummaryRow label="Discount" value={`-₹${totals.discount}`} />
        <SummaryRow label="GST (5% after discount)" value={`₹${totals.tax}`} />
        <SummaryRow label="Rider tip" value={`₹${totals.tip}`} />
        <div className="flex justify-between border-t border-line pt-2 text-base font-extrabold">
          <dt>Grand total</dt>
          <dd>₹{totals.total}</dd>
        </div>
      </dl>

      <button
        type="submit"
        className="w-full rounded-full bg-gold px-6 py-3.5 font-bold text-on-gold shadow-card hover:shadow-card-hover"
      >
        {method === 'UPI'
          ? `Continue to demo payment · ₹${totals.total}`
          : `Place order · ₹${totals.total}`}
      </button>
    </form>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}