import * as Dialog from '@radix-ui/react-dialog'
import { ReceiptText, Truck, User, X } from 'lucide-react'
import { useOrdersStore } from '../../../store/ordersStore'
import { useUiStore, type Panel } from '../../../store/uiStore'
import { useUserStore } from '../../../store/userStore'
import BrandLogo from './BrandLogo'
import NavbarSearch from './NavbarSearch'
import OrderNowButton from './OrderNowButton'
import { NAV_LINKS } from './links'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  active: string
}

/** Slide-in menu for phones and tablets. */
export default function MobileMenu({ open, onOpenChange, active }: Props) {
  const user = useUserStore((s) => s.user)
  const orderCount = useOrdersStore((s) => s.orders.length)
  const activeOrderId = useOrdersStore((s) => s.activeOrderId)
  const openPanel = useUiStore((s) => s.openPanel)

  const close = () => onOpenChange(false)
  const go = (panel: Panel) => {
    close()
    openPanel(panel)
  }

  const row =
    'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-[17px] font-semibold transition-colors hover:bg-cream-deep'

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          id="mobile-menu"
          className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col overflow-y-auto bg-[#fffaf1] p-5 shadow-card-hover"
        >
          <div className="flex items-center justify-between">
            <BrandLogo onClick={close} />
            <Dialog.Close
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-[#eee2c8] bg-white hover:border-gold"
            >
              <X size={20} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <Dialog.Description className="sr-only">Site sections, search and your account.</Dialog.Description>

          <div className="mt-6">
            <NavbarSearch id="mobile-search" onSubmit={close} />
          </div>

          <nav aria-label="Main" className="mt-4">
            <ul className="space-y-1">
              {NAV_LINKS.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={close}
                    aria-current={active === id ? 'true' : undefined}
                    className={`${row} ${active === id ? 'bg-[#ffe7a3]' : ''}`}
                  >
                    <Icon size={20} aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-4 space-y-1 border-t border-[#eee2c8] pt-4">
            {activeOrderId && (
              <button type="button" onClick={() => go('tracking')} className={row}>
                <Truck size={20} aria-hidden="true" className="text-green-700" />
                Track your order
              </button>
            )}
            <button type="button" onClick={() => go('history')} className={row}>
              <ReceiptText size={20} aria-hidden="true" />
              Order history{orderCount ? ` (${orderCount})` : ''}
            </button>
            <button type="button" onClick={() => go('auth')} className={row}>
              <User size={20} aria-hidden="true" />
              {user ? `Account (${user.name.split(' ')[0]})` : 'Log in'}
            </button>
          </div>

          <OrderNowButton onClick={close} className="mt-auto w-full" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
