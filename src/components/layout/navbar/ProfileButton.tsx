import { User } from 'lucide-react'
import { useOrdersStore } from '../../../store/ordersStore'
import { useUiStore } from '../../../store/uiStore'
import { useUserStore } from '../../../store/userStore'
import IconButton from './IconButton'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

/**
 * The account circle: initials when signed in, the user icon otherwise. It opens the account
 * dialog, which also holds order tracking and history (component-guidelines.md §5).
 * A green dot shows while an order is on its way.
 */
export default function ProfileButton() {
  const user = useUserStore((s) => s.user)
  const hasActiveOrder = useOrdersStore((s) => s.activeOrderId !== null)
  const openPanel = useUiStore((s) => s.openPanel)

  const label = `${user ? `Account and orders, ${user.name}` : 'Log in, account and orders'}${hasActiveOrder ? ' (an order is on its way)' : ''}`
  const dot = hasActiveOrder && (
    <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-veg-300 ring-2 ring-forest-800" />
  )

  if (!user) {
    return (
      <IconButton tone="dark" label={label} onClick={() => openPanel('auth')}>
        <User size={20} aria-hidden="true" />
        {dot}
      </IconButton>
    )
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => openPanel('auth')}
      className="relative grid size-11 shrink-0 place-items-center rounded-full bg-cream-300 font-display text-[15px] font-bold text-ink-900 ring-2 ring-transparent transition-[box-shadow,scale] duration-150 hover:ring-gold-300 motion-safe:active:scale-94"
    >
      <span aria-hidden="true">{initials(user.name)}</span>
      {dot}
    </button>
  )
}
