import { BookOpen, ConciergeBell, House, Phone, TicketPercent, type LucideIcon } from 'lucide-react'

export interface NavLink {
  id: string
  label: string
  /** Shown in the mobile menu only; the desktop bar uses text alone. */
  icon: LucideIcon
}

/** The page sections in the main navigation, in page order. `id` matches each section's id. */
export const NAV_LINKS: NavLink[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'menu', label: 'Menu', icon: ConciergeBell },
  { id: 'offers', label: 'Offers', icon: TicketPercent },
  { id: 'about', label: 'About', icon: BookOpen },
  { id: 'contact', label: 'Contact', icon: Phone },
]

/**
 * Every section the scrollspy watches. Delivery has no nav link, but watching it means no link
 * stays highlighted while the visitor is reading it.
 */
export const TRACKED_SECTIONS = ['home', 'menu', 'offers', 'about', 'delivery', 'contact']
