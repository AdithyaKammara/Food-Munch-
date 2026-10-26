import { ArrowRight } from 'lucide-react'

export default function OrderNowButton({ onClick, className = '' }: { onClick?: () => void; className?: string }) {
  return (
    <a
      href="#menu"
      onClick={onClick}
      className={`group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gold px-6 py-3.5 font-bold text-on-gold shadow-[0_8px_18px_rgba(255,191,0,0.4)] transition-transform hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
      Order Now
      <ArrowRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
    </a>
  )
}
