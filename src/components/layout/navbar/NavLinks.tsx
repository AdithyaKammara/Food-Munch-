import { NAV_LINKS } from './links'

export default function NavLinks({ active }: { active: string }) {
  return (
    <ul className="flex items-center gap-1 xl:gap-2">
      {NAV_LINKS.map(({ id, label }) => {
        const isActive = active === id
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={isActive ? 'true' : undefined}
              className="relative flex h-11 items-center whitespace-nowrap rounded-lg px-3 text-[15px] font-semibold hover:text-gold-text"
            >
              {label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-3 bottom-1 h-[3px] rounded-full bg-gold transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
              />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
