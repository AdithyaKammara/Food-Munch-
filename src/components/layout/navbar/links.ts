import { Bike, ConciergeBell, House, Phone, UsersRound, type LucideIcon } from 'lucide-react'

export interface NavLink {
  id: string
  label: string
  icon: LucideIcon
}

/** The page sections, in the order they appear. `id` matches each section's id. */
export const NAV_LINKS: NavLink[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'menu', label: 'Menu', icon: ConciergeBell },
  { id: 'why-us', label: 'Why Us', icon: UsersRound },
  { id: 'delivery', label: 'Delivery', icon: Bike },
  { id: 'contact', label: 'Contact', icon: Phone },
]
