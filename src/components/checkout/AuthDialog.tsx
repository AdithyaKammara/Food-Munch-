import { useId, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Info, Leaf, Phone, User, X } from 'lucide-react'
import { normalizePhone, validateName, validatePhone } from '../../lib/validation'
import { useUiStore } from '../../store/uiStore'
import { useUserStore } from '../../store/userStore'

export default function AuthDialog() {
  const open = useUiStore((s) => s.panel === 'auth')
  const closePanel = useUiStore((s) => s.closePanel)
  const user = useUserStore((s) => s.user)

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) closePanel()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="motion-overlay fixed inset-0 z-50 bg-black/45" />
        <Dialog.Content className="motion-dialog fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-1.5rem)] max-w-[44rem] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overflow-x-hidden rounded-[1.75rem] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
          {/* ---------- Header strip ---------- */}
          <div className="relative isolate overflow-hidden bg-[#fff6e3] px-6 pb-6 pt-7 sm:px-8">
            {/* Faint gold spice shapes in the background */}
            <span aria-hidden="true" className="absolute -right-10 -top-16 -z-10 h-48 w-48 rounded-full bg-[#ffe7a3]/70" />
            <span aria-hidden="true" className="absolute left-[46%] top-5 -z-10 h-2 w-2 rounded-full bg-gold-dark/50" />
            <span aria-hidden="true" className="absolute left-[56%] top-12 -z-10 h-1.5 w-1.5 rounded-full bg-gold-dark/40" />

            <Dialog.Title className="pr-16 font-display text-[1.9rem] font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl">
              {user ? (
                <>
                  Your <span className="text-[#b47500]">account</span>
                </>
              ) : (
                <>
                  Log <span className="text-[#b47500]">in</span>
                </>
              )}
            </Dialog.Title>
            <Dialog.Description className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted sm:max-w-sm">
              {user
                ? 'Update your details for a personalised Food Munch experience.'
                : 'Add your name and number so checkout is quicker next time.'}
            </Dialog.Description>

            {/* Small spice bowl, top right */}
            <img
              src="/images/footer-spices.jpg"
              alt=""
              width={560}
              height={560}
              className="absolute right-[6rem] top-4 hidden h-[4.5rem] w-[4.5rem] rounded-full object-cover shadow-md ring-4 ring-white sm:block"
            />
            <Leaf aria-hidden="true" className="absolute right-[11.5rem] top-12 hidden h-7 w-7 rotate-[-20deg] fill-green-600 text-green-800 sm:block" />

            <Dialog.Close
              aria-label="Close"
              className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full border-2 border-gold bg-white text-ink transition-transform hover:scale-105 active:scale-95"
            >
              <X size={22} aria-hidden="true" />
            </Dialog.Close>
          </div>

          {/* key: fresh form state each time the dialog opens or the user changes */}
          <AccountForm key={user ? `${user.name}-${user.phone}` : 'guest'} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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
    <div className="relative">
      {/* Big biryani plate, cut off by the right edge (larger screens) */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-12 hidden h-[23rem] w-[23rem] sm:block">
        <img
          src="/images/why-biryani.jpg"
          alt=""
          width={1400}
          height={1050}
          className="h-full w-full rounded-full object-cover shadow-[0_24px_50px_rgba(79,54,10,0.3)] ring-[10px] ring-white"
        />
      </div>

      <form onSubmit={submit} noValidate className="relative space-y-5 px-6 pb-7 pt-6 sm:pr-[15rem] sm:pl-8">
        <IconField
          label="Full name"
          icon={<User size={20} aria-hidden="true" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
          placeholder="e.g. Asha Reddy"
        />
        <IconField
          label="Phone number"
          icon={<Phone size={19} aria-hidden="true" />}
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          autoComplete="tel"
          maxLength={16}
          placeholder="10-digit mobile number"
        />

        <p className="flex items-start gap-3 rounded-2xl bg-[#fff3d6] p-4 text-sm leading-relaxed text-ink/80">
          <Info size={26} aria-hidden="true" className="shrink-0 fill-gold text-ink" />
          Demo account: details are saved in this browser only. There is no password and no server.
        </p>

        <div className={`grid gap-3 ${user ? 'sm:grid-cols-2' : ''}`}>
          <button
            type="submit"
            className="rounded-full bg-gold px-6 py-4 text-[17px] font-bold text-on-gold shadow-[0_10px_22px_rgba(255,191,0,0.4)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {user ? 'Save changes' : 'Save and continue'}
          </button>
          {user && (
            <button
              type="button"
              onClick={() => {
                logout()
                closePanel()
              }}
              className="rounded-full border-2 border-[#eee2c8] bg-white px-6 py-4 text-[17px] font-bold transition-colors hover:border-red-600 hover:text-red-700"
            >
              Log out
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

interface IconFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: ReactNode
  error: string | null
}

/** Label above a rounded input with an icon inside it. */
function IconField({ label, icon, error, ...props }: IconFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="text-[15px] font-semibold">
        {label}
      </label>
      <div
        className={`mt-2 flex items-center gap-3 rounded-2xl border bg-white px-4 transition-colors focus-within:border-gold ${
          error ? 'border-red-600' : 'border-[#e8dcc3]'
        }`}
      >
        <span className="shrink-0 text-ink">{icon}</span>
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="w-full min-w-0 bg-transparent py-3.5 text-[16px] outline-none placeholder:text-muted"
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
