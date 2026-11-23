import { useId, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { Info, Phone, ReceiptText, Truck, User } from 'lucide-react'
import { clsx } from 'clsx'
import { normalizePhone, validateName, validatePhone } from '../../lib/validation'
import { useOrdersStore } from '../../store/ordersStore'
import { useUiStore } from '../../store/uiStore'
import { useUserStore } from '../../store/userStore'
import Button from '../ui/Button'
import { buttonClasses } from '../ui/buttonClasses'
import Modal from '../ui/Modal'

/** The demo account, opened from the profile circle in the navbar. Behaviour unchanged. */
export default function AuthDialog() {
  const open = useUiStore((s) => s.panel === 'auth')
  const closePanel = useUiStore((s) => s.closePanel)
  const user = useUserStore((s) => s.user)

  return (
    <Modal
      open={open}
      onClose={closePanel}
      size="lg"
      title={user ? 'Your account' : 'Log in'}
      description={
        user
          ? 'Update your details for a quicker checkout.'
          : 'Add your name and number so checkout is quicker next time.'
      }
    >
      {/* key: fresh form state each time the dialog opens or the user changes */}
      <AccountForm key={user ? `${user.name}-${user.phone}` : 'guest'} />
      <OrderShortcuts />
    </Modal>
  )
}

function AccountForm() {
  const user = useUserStore((s) => s.user)
  const login = useUserStore((s) => s.login)
  const logout = useUserStore((s) => s.logout)
  const closePanel = useUiStore((s) => s.closePanel)

  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [errors, setErrors] = useState<{ name: string | null; phone: string | null }>({
    name: null,
    phone: null,
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next = { name: validateName(name), phone: validatePhone(phone) }
    setErrors(next)
    if (next.name || next.phone) return
    login(name.trim(), normalizePhone(phone))
    closePanel()
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <IconField
          label="Full name"
          icon={<User size={18} aria-hidden="true" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
          placeholder="e.g. Asha Reddy"
        />
        <IconField
          label="Phone number"
          icon={<Phone size={18} aria-hidden="true" />}
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          autoComplete="tel"
          maxLength={16}
          placeholder="10-digit mobile number"
        />
      </div>

      <p className="flex items-start gap-3 rounded-sm bg-cream-200 p-3.5 text-sm leading-relaxed text-ink-900">
        <Info size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-copper-700" />
        Demo account: details are saved in this browser only. There is no password and no server.
      </p>

      <div className={clsx('grid gap-3', user && 'sm:grid-cols-2')}>
        <button type="submit" className={buttonClasses('primary', 'lg', 'w-full')}>
          {user ? 'Save changes' : 'Save and continue'}
        </button>
        {user && (
          <button
            type="button"
            onClick={() => {
              logout()
              closePanel()
            }}
            className={buttonClasses('secondary', 'lg', 'w-full')}
          >
            Log out
          </button>
        )}
      </div>
    </form>
  )
}

interface IconFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: ReactNode
  error: string | null
}

/** Label above an input with an icon inside it, in the dialogs' field style. */
function IconField({ label, icon, error, ...props }: IconFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div
        className={clsx(
          'mt-1.5 flex min-h-11 items-center gap-2.5 rounded-sm border bg-cream-50 px-3.5 transition-colors focus-within:border-copper-600 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus',
          error ? 'border-nonveg' : 'border-field-500',
        )}
      >
        <span className="shrink-0 text-ink-600">{icon}</span>
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="w-full min-w-0 bg-transparent py-2.5 text-base outline-none placeholder:text-ink-600"
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm font-medium text-nonveg">
          {error}
        </p>
      )}
    </div>
  )
}

/** Order tracking and history, reached from the account circle in the navbar. */
function OrderShortcuts() {
  const orderCount = useOrdersStore((s) => s.orders.length)
  const hasActiveOrder = useOrdersStore((s) => s.activeOrderId !== null)
  const openPanel = useUiStore((s) => s.openPanel)
  if (!orderCount && !hasActiveOrder) return null

  return (
    <div className="mt-6 flex flex-wrap gap-3 border-t border-line-200 pt-5">
      {hasActiveOrder && (
        <Button variant="secondary" onClick={() => openPanel('tracking')} icon={<Truck size={18} aria-hidden="true" />}>
          Track your order
        </Button>
      )}
      {orderCount > 0 && (
        <Button variant="secondary" onClick={() => openPanel('history')} icon={<ReceiptText size={18} aria-hidden="true" />}>
          Order history ({orderCount})
        </Button>
      )}
    </div>
  )
}
