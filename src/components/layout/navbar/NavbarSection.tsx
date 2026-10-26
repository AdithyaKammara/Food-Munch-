import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { gsap, MOTION_OK, useGSAP } from '../../../lib/gsap'
import { MOTION } from '../../../lib/motion'
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
  const progress = useRef<HTMLDivElement>(null)
  const scrolled = useScrolled(8)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    // One gentle entrance for the whole bar (not every icon separately).
    mm.add(MOTION_OK, () => {
      gsap.from(bar.current, { y: -20, autoAlpha: 0, duration: MOTION.duration, ease: MOTION.ease, clearProps: 'transform' })
    })
    // Thin gold reading-progress line. It follows the scroll position, so it is kept for everyone.
    gsap.fromTo(
      progress.current,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
    )
    return () => mm.revert()
  })

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        ref={progress}
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left scale-x-0 bg-gold"
      />
      <div
        ref={bar}
        className={`mx-auto flex max-w-[86rem] items-center gap-3 rounded-[1.75rem] px-3 py-2.5 ring-1 backdrop-blur-md transition-[background-color,box-shadow] duration-300 sm:rounded-[2.25rem] sm:px-5 lg:gap-4 xl:px-6 ${
          scrolled
            ? 'bg-white/95 shadow-[0_12px_32px_rgba(79,54,10,0.14)] ring-[#f1e6cf]'
            : 'bg-white/75 shadow-[0_4px_14px_rgba(79,54,10,0.05)] ring-[#f1e6cf]/70'
        }`}
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

/** True once the page has scrolled more than `offset` pixels (checked at most once per frame). */
function useScrolled(offset: number): boolean {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    let frame = 0
    const check = () => {
      frame = 0
      setScrolled(window.scrollY > offset)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [offset])
  return scrolled
}
