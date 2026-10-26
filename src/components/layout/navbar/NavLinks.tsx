import { NAV_LINKS } from './links'

export default function NavLinks({ active }: { active: string }) {
  return (
    <ul className="flex items-center gap-1 xl:gap-2">
      {NAV_LINKS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={isActive ? 'true' : undefined}
              className="group flex w-[4.75rem] flex-col items-center gap-1 rounded-2xl pb-1 pt-0.5 text-[14px] xl:w-20"
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-full transition-colors ${
                  isActive ? 'bg-[#ffe7a3] text-ink' : 'text-ink group-hover:bg-cream-deep'
                }`}
              >
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className={`whitespace-nowrap ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
              <span
                aria-hidden="true"
                className={`h-[3px] rounded-full bg-gold transition-all duration-300 ${isActive ? 'w-9' : 'w-0'}`}
              />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
