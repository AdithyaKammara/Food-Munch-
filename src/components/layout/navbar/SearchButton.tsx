import { Search } from 'lucide-react'
import { prefersReducedMotion } from '../../../lib/motion'
import IconButton from './IconButton'

/**
 * The navbar's search opens the menu's own search field instead of being a second search box
 * (implementation-plan.md §1: two search boxes competed on desktop).
 */
export default function SearchButton() {
  const goToSearch = () => {
    const field = document.getElementById('menu-search')
    document.getElementById('menu')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    field?.focus({ preventScroll: true })
  }

  return (
    <IconButton tone="dark" label="Search dishes" onClick={goToSearch}>
      <Search size={20} aria-hidden="true" />
    </IconButton>
  )
}
