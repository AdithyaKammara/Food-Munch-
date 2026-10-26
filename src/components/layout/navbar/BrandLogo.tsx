import { ChefHat } from 'lucide-react'

export default function BrandLogo({ onClick }: { onClick?: () => void }) {
  return (
    <a href="#home" onClick={onClick} className="flex shrink-0 items-center gap-3 rounded-2xl">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold text-on-gold shadow-[0_6px_14px_rgba(255,191,0,0.35)] sm:h-[52px] sm:w-[52px]">
        <ChefHat size={26} aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block whitespace-nowrap font-display text-xl font-extrabold tracking-tight sm:text-2xl">
          Food <span className="text-gold-dark">Munch</span>
        </span>
        <span className="hidden whitespace-nowrap text-[13px] text-muted sm:block lg:hidden 2xl:block">
          Authentic Hyderabadi Flavours
        </span>
      </span>
    </a>
  )
}
