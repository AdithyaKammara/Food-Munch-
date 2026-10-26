import { useRef } from 'react'
import { ShoppingCart } from 'lucide-react'
import { gsap, MOTION_OK, useGSAP } from '../../../lib/gsap'
import { selectCartCount, useCartStore } from '../../../store/cartStore'
import { useUiStore } from '../../../store/uiStore'
import IconButton from './IconButton'

export default function CartButton() {
  const count = useCartStore(selectCartCount)
  const openPanel = useUiStore((s) => s.openPanel)

  // "Bump" the cart when something is added (not on page load, not when removing).
  const ref = useRef<HTMLButtonElement>(null)
  const previousCount = useRef(count)

  useGSAP(
    () => {
      const added = count > previousCount.current
      previousCount.current = count
      const button = ref.current
      if (!added || !button) return

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline()
          .fromTo(button, { scale: 1 }, { scale: 1.18, duration: 0.15, ease: 'power2.out' })
          .to(button, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)', clearProps: 'transform' })
        const badge = button.querySelector('[data-cart-badge]')
        if (badge) {
          gsap.fromTo(badge, { scale: 0.4 }, { scale: 1, duration: 0.4, ease: 'back.out(3)', clearProps: 'transform' })
        }
      })
      return () => mm.revert()
    },
    { dependencies: [count], revertOnUpdate: true },
  )

  return (
    <IconButton ref={ref} label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`} onClick={() => openPanel('cart')}>
      <ShoppingCart size={20} aria-hidden="true" />
      {count > 0 && (
        <span
          data-cart-badge
          className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1 text-xs font-bold text-white ring-2 ring-white"
        >
          {count}
        </span>
      )}
    </IconButton>
  )
}
