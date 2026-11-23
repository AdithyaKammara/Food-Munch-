import { useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { gsap, useGSAP } from '../../../lib/gsap'
import Wordmark from '../../brand/Wordmark'
import CartButton from './CartButton'
import IconButton from './IconButton'
import MobileMenu from './MobileMenu'
import NavLinks from './NavLinks'
import ProfileButton from './ProfileButton'
import SearchButton from './SearchButton'
import { TRACKED_SECTIONS } from './links'
import { useActiveSection } from './useActiveSection'

/**
 * The forest-green navbar from the reference (component-guidelines.md §5). It sticks to the top;
 * once stuck, a scroll-state container query lifts its shadow (see `.site-header` in index.css).
 */
export default function NavbarSection() {
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(TRACKED_SECTIONS)
  const progress = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // The bar's entrance is a CSS animation (`.site-bar` in index.css): a GSAP `from` here read
    // computed styles during the first render and forced a full layout (Phase 9 profile).
    // Thin reading-progress line. It follows the scroll position, so it is kept for everyone.
    gsap.fromTo(
      progress.current,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
    )
  })

  return (
    <header className="site-header sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        ref={progress}
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left scale-x-0 bg-copper-600"
      />
      <div
        className="site-bar on-forest mx-auto flex max-w-7xl items-center gap-2 rounded-full bg-forest-800 py-2 pl-3 pr-2 shadow-card transition-shadow duration-300 sm:gap-3 sm:pl-5"
      >
        <Wordmark tone="light" />

        <nav aria-label="Main" className="mx-auto hidden lg:block">
          <NavLinks active={active} />
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <span className="hidden lg:contents">
            <SearchButton />
          </span>
          <CartButton />
          <span aria-hidden="true" className="mx-1 hidden h-8 w-px bg-cream-50/20 sm:block" />
          <span className="hidden sm:contents">
            <ProfileButton />
          </span>
          <IconButton
            tone="dark"
            label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="lg:hidden"
          >
            <Menu size={20} aria-hidden="true" />
          </IconButton>
        </div>
      </div>

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} active={active} />
    </header>
  )
}
