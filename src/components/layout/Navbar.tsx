import { useRef, useState } from 'react'
import { ChefHat, Menu, Receipt, ShoppingBag, Truck, User, X } from 'lucide-react'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'
import { selectCartCount, useCartStore } from '../../store/cartStore'
import { useOrdersStore } from '../../store/ordersStore'
import { useUiStore, type Panel } from '../../store/uiStore'
import { useUserStore } from '../../store/userStore'

const links = [
  { href: '#menu', label: 'Menu' },
  { href: '#why-us', label: 'Why us' },
  { href: '#delivery', label: 'Delivery' },
  { href: '#contact', label: 'Contact' },
]

const iconButton =
  'grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-cream-deep active:scale-95'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const count = useCartStore(selectCartCount)
  const user = useUserStore((s) => s.user)
  const orderCount = useOrdersStore((s) => s.orders.length)
  const activeOrderId = useOrdersStore((s) => s.activeOrderId)
  const openPanel = useUiStore((s) => s.openPanel)

  // ---------- "Bump" the bag when something is added ----------
  const bagRef = useRef<HTMLButtonElement>(null)
  const previousCount = useRef(count)

  useGSAP(
    () => {
      const added = count > previousCount.current
      previousCount.current = count
      const bag = bagRef.current
      if (!added || !bag) return

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline()
          .fromTo(bag, { scale: 1 }, { scale: 1.18, duration: 0.15, ease: 'power2.out' })
          .to(bag, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)', clearProps: 'transform' })

        const badge = bag.querySelector('[data-cart-badge]')
        if (badge) {
          gsap.fromTo(
            badge,
            { scale: 0.4 },
            { scale: 1, duration: 0.4, ease: 'back.out(3)', clearProps: 'transform' },
          )
        }
      })
      return () => mm.revert()
    },
    { dependencies: [count], revertOnUpdate: true },
  )

  const go = (panel: Panel) => {
    setOpen(false)
    openPanel(panel)
  }

  return (
    <header className="sticky top-0 z-40 bg-cream">
      <nav aria-label="Main" className="frame flex h-[72px] items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold text-on-gold">
            <ChefHat size={20} aria-hidden="true" />
          </span>
          <span>
            Food <span className="text-gold-text">Munch</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-4 py-2 text-[15px] font-semibold text-ink transition-colors hover:bg-cream-deep"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          {activeOrderId && (
            <button
              type="button"
              onClick={() => openPanel('tracking')}
              className="hidden items-center gap-1.5 rounded-full bg-cream-deep px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gold hover:text-on-gold md:inline-flex"
            >
              <Truck size={16} aria-hidden="true" /> Track order
            </button>
          )}
          {orderCount > 0 && (
            <button
              type="button"
              aria-label="Order history"
              onClick={() => openPanel('history')}
              className={`hidden md:grid ${iconButton}`}
            >
              <Receipt size={18} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            aria-label={user ? `Account: ${user.name}` : 'Log in'}
            onClick={() => openPanel('auth')}
            className={`hidden md:grid ${iconButton}`}
          >
            <User size={18} aria-hidden="true" />
          </button>

          <button
            ref={bagRef}
            type="button"
            aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}
            onClick={() => openPanel('cart')}
            className={`relative ${iconButton}`}
          >
            <ShoppingBag size={18} aria-hidden="true" />
            {count > 0 && (
              <span
                data-cart-badge
                className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-bold text-white"
              >
                {count}
              </span>
            )}
          </button>

          <a
            href="#menu"
            className="ml-2 hidden rounded-full bg-gold px-5 py-3 text-sm font-bold text-on-gold transition-transform hover:-translate-y-0.5 active:translate-y-0 md:inline-block"
          >
            Order Now
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
            className={`md:hidden ${iconButton}`}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="frame bg-cream pb-5 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-full px-4 py-3 text-lg font-semibold hover:bg-cream-deep"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => go('auth')}
                className="block w-full rounded-full px-4 py-3 text-left text-lg font-semibold hover:bg-cream-deep"
              >
                {user ? `Account (${user.name.split(' ')[0]})` : 'Log in'}
              </button>
            </li>
            {orderCount > 0 && (
              <li>
                <button
                  type="button"
                  onClick={() => go('history')}
                  className="block w-full rounded-full px-4 py-3 text-left text-lg font-semibold hover:bg-cream-deep"
                >
                  Order history
                </button>
              </li>
            )}
            {activeOrderId && (
              <li>
                <button
                  type="button"
                  onClick={() => go('tracking')}
                  className="block w-full rounded-full px-4 py-3 text-left text-lg font-semibold hover:bg-cream-deep"
                >
                  Track order
                </button>
              </li>
            )}
          </ul>
          <a
            href="#menu"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-gold px-5 py-3.5 text-center font-bold text-on-gold"
          >
            Order Now
          </a>
        </div>
      )}
    </header>
  )
}