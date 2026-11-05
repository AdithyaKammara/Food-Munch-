export default function OrderNowButton({ onClick, className = '' }: { onClick?: () => void; className?: string }) {
  return (
    <a
      href="#menu"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-gold px-6 py-3.5 font-bold text-on-gold lg:px-5 xl:px-6 shadow-gold transition-transform hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
      Order Now
    </a>
  )
}
