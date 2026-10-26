import { useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { gsap, MOTION_OK, useGSAP } from '../../../lib/gsap'
import BrandLogo from './BrandLogo'
import CartButton from './CartButton'
import MobileMenu from './MobileMenu'
import NavLinks from './NavLinks'
import NavbarSearch from './NavbarSearch'
import OrderHistoryButton from './OrderHistoryButton'
import OrderNowButton from './OrderNowButton'
import ProfileButton from './ProfileButton'
import { NAV_LINKS } from './links'
import { useActiveSection } from './useActiveSection'

const SECTION_IDS = NAV_LINKS.map((l) => l.id)

/** Floating, rounded navbar that stays at the top while you scroll. */
export default function NavbarSection() {
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  const bar = useRef<HTMLDivElement>(null)

  // One gentle entrance for the whole bar (not every icon separately).
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from(bar.current, { y: -24, autoAlpha: 0, duration: 0.7, ease: 'power3.out', clearProps: 'transform' })
      })
      return () => mm.revert()
    },
    { scope: bar },
  )

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        ref={bar}
        className="mx-auto flex max-w-[86rem] items-center gap-3 rounded-[1.75rem] bg-white/90 px-3 py-2.5 shadow-[0_12px_32px_rgba(79,54,10,0.12)] ring-1 ring-[#f1e6cf] backdrop-blur-md sm:rounded-[2.25rem] sm:px-5 lg:gap-4 xl:px-6"
      >
        <BrandLogo />

        {/* Large screens: links in the middle */}
        <nav aria-label="Main" className="mx-auto hidden lg:block">
          <NavLinks active={active} />
        </nav>

        <span aria-hidden="true" className="hidden h-12 w-px bg-[#eee2c8] xl:block" />

        <div className="hidden w-48 shrink-0 xl:block 2xl:w-60">
          <NavbarSearch id="navbar-search" />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <span className="hidden sm:contents">
            <OrderHistoryButton />
            <ProfileButton />
          </span>
          <CartButton />
          <span className="ml-1 hidden md:block">
            <OrderNowButton />
          </span>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform active:scale-95 sm:h-12 sm:w-12 lg:hidden"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} active={active} />
    </header>
  )
}
