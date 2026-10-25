import { useState, type FormEvent } from 'react'
import { normalizePhone, validateName, validatePhone } from '../../lib/validation'
import { useUiStore } from '../../store/uiStore'
import { useUserStore } from '../../store/userStore'
import { TextField } from '../ui/Field'
import Modal from '../ui/Modal'

export default function AuthDialog() {
  const open = useUiStore((s) => s.panel === 'auth')
  const closePanel = useUiStore((s) => s.closePanel)

  return (
    <Modal
      open={open}
      onClose={closePanel}
      title="Your account"
      description="Demo sign-in: your details stay in this browser only."
    >
      <AuthBody />
    </Modal>
  )
}

function AuthBody() {
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
    <form onSubmit={submit} noValidate className="space-y-4">
      <TextField
        label="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoComplete="name"
        placeholder="e.g. Asha Reddy"
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
        placeholder="10-digit mobile number"
      />
      <p className="rounded-xl bg-cream-deep p-3 text-xs text-muted">
        This is not real account security: there is no password and no server. Real sign-in needs a
        backend.
      </p>
      <button
        type="submit"
        className="w-full rounded-full bg-gold px-6 py-3 font-bold text-on-gold shadow-card hover:shadow-card-hover"
      >
        Save and continue
      </button>
      {user && (
        <button
          type="button"
          onClick={() => {
            logout()
            closePanel()
          }}
          className="w-full rounded-full border border-line px-6 py-3 text-sm font-bold hover:border-red-600 hover:text-red-700"
        >
          Log out
        </button>
      )}
    </form>
  )
}