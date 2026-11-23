import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { buildDeliverySlots, buildOrder, type PaymentMethod } from '../../lib/orders'
import { calcTotals } from '../../lib/pricing'
import { normalizePhone, validateAddress, validateName, validatePhone } from '../../lib/validation'
import { useCartStore } from '../../store/cartStore'
import { useOrdersStore } from '../../store/ordersStore'
import { useUiStore } from '../../store/uiStore'
import { useUserStore } from '../../store/userStore'
import Button from '../ui/Button'
import { buttonClasses } from '../ui/buttonClasses'
import { TextAreaField, TextField } from '../ui/Field'
import { fieldClasses } from '../ui/fieldClasses'
import Modal from '../ui/Modal'
import Price from '../ui/Price'

// A whole row is the label for its radio; the chosen one gets a copper border.
const optionRow =
  'flex min-h-12 cursor-pointer items-start gap-3 rounded-sm border border-line-200 px-3.5 py-3 transition-colors hover:border-copper-600 has-[:checked]:border-copper-600 has-[:checked]:bg-cream-100'

export default function CheckoutDialog() {
  const open = useUiStore((s) => s.panel === 'checkout')
  const closePanel = useUiStore((s) => s.closePanel)

  return (
    <Modal
      open={open}
      onClose={closePanel}
      title="Checkout"
      description="Demo checkout: no real payment is taken."
      size="lg"
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
  // The demo UPI confirmation shows a spinner for 900ms, like a provider replying (animation-guidelines.md §12).
  const [confirming, setConfirming] = useState(false)

  const totals = calcTotals({ lines, promoCode, tip, isFirstOrder })

  // Typing in a field clears its error; the check itself still runs on submit (modern-web-guidance: forms).
  const clearError = (field: keyof FieldErrors) => setErrors((e) => (e[field] ? { ...e, [field]: null } : e))

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

  useEffect(() => {
    if (!confirming) return
    const timer = setTimeout(() => placeOrder('UPI'), 900)
    return () => clearTimeout(timer)
    // placeOrder reads the latest state when the timer fires; it is not a trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirming])

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

  // ---------- Empty cart ----------
  if (lines.length === 0) {
    return (
      <div className="text-center">
        <p className="font-semibold">Your cart is empty.</p>
        <button type="button" onClick={closePanel} className={buttonClasses('primary', 'md', 'mt-4')}>
          Back to the menu
        </button>
      </div>
    )
  }

  // ---------- Demo UPI step ----------
  if (step === 'upi') {
    return (
      <div className="text-center">
        <p className="rounded-sm bg-cream-200 p-3 text-sm font-semibold">
          Demo payment: scanning this code does nothing and no money moves.
        </p>

        <div
          role="img"
          aria-label="Demo QR code, not a real payment"
          className="mx-auto mt-5 inline-block rounded-md border border-line-200 bg-white p-4"
        >
          <QRCodeSVG
            value={`FOOD MUNCH DEMO ONLY - NOT A REAL PAYMENT - INR ${totals.total}`}
            size={168}
          />
        </div>

        <p className="mt-3">
          <Price amount={totals.total} className="text-[1.75rem]" />
        </p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-ink-600">
          A real UPI payment must be confirmed by a payment provider on a server. This button only
          simulates that confirmation.
        </p>

        <Button size="lg" loading={confirming} onClick={() => setConfirming(true)} className="mt-5 w-full">
          {confirming ? 'Confirming…' : 'Simulate successful payment'}
        </Button>
        <button
          type="button"
          onClick={() => setStep('details')}
          className="mt-2 min-h-11 w-full rounded-full px-6 text-[0.9375rem] font-semibold text-ink-600 hover:text-ink-900"
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
        <p className="rounded-sm bg-cream-200 p-3 text-sm">
          Ordering as <strong>{user.name}</strong> · {user.phone}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Full name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              clearError('name')
            }}
            error={errors.name}
            autoComplete="name"
          />
          <TextField
            label="Phone number"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              clearError('phone')
            }}
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
        onChange={(e) => {
          setAddressText(e.target.value)
          clearError('address')
        }}
        error={errors.address}
        hint="House or flat number, street, landmark."
        autoComplete="street-address"
      />

      <div className="relative">
        <label htmlFor="checkout-slot" className="text-sm font-semibold">
          Delivery time
        </label>
        <select
          id="checkout-slot"
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          className={fieldClasses(null, 'appearance-none pr-10')}
        >
          {slots.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute bottom-3.5 right-3.5" />
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">Payment method</legend>
        <div className="mt-1.5 space-y-2">

        <label className={optionRow}>
          <input
            type="radio"
            name="payment"
            checked={method === 'UPI'}
            onChange={() => setMethod('UPI')}
            className="mt-1 size-4 accent-copper-600"
          />
          <span>
            <span className="font-semibold">UPI QR (demo)</span>
            <span className="block text-[0.8125rem] text-ink-600">Simulated: no money moves.</span>
          </span>
        </label>

        <label className={optionRow}>
          <input
            type="radio"
            name="payment"
            checked={method === 'COD'}
            onChange={() => setMethod('COD')}
            className="mt-1 size-4 accent-copper-600"
          />
          <span>
            <span className="font-semibold">Cash on Delivery</span>
            <span className="block text-[0.8125rem] text-ink-600">Pay at the door.</span>
          </span>
        </label>
        </div>
      </fieldset>

      <dl className="space-y-1.5 rounded-sm bg-cream-200 p-4 text-[0.9375rem]">
        <SummaryRow label="Subtotal" amount={totals.subtotal} />
        <SummaryRow label="Discount" amount={totals.discount} minus={totals.discount > 0} />
        <SummaryRow label="GST (5% after discount)" amount={totals.tax} />
        <SummaryRow label="Rider tip" amount={totals.tip} />
        <div className="flex items-baseline justify-between border-t border-line-200 pt-2.5">
          <dt className="font-display text-title font-semibold">Grand total</dt>
          <dd>
            <Price amount={totals.total} className="text-price" />
          </dd>
        </div>
      </dl>

      <button type="submit" className={buttonClasses('primary', 'lg', 'w-full')}>
        {method === 'UPI' ? 'Continue to demo payment' : 'Place order'} ·{' '}
        <Price amount={totals.total} plain className="font-semibold" />
      </button>
    </form>
  )
}

function SummaryRow({ label, amount, minus = false }: { label: string; amount: number; minus?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-600">{label}</dt>
      <dd className={minus ? 'font-semibold text-success' : undefined}>
        {minus && '−'}
        <Price amount={amount} plain />
      </dd>
    </div>
  )
}