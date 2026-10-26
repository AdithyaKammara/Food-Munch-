import { forwardRef, type ReactNode } from 'react'

interface Props {
  label: string
  onClick: () => void
  children: ReactNode
  className?: string
}

/** A round icon-only button. `label` is what screen readers announce. */
const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { label, onClick, children, className = '' },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#eee2c8] bg-white text-ink transition-colors hover:border-gold hover:bg-[#fff7e0] active:scale-95 sm:h-12 sm:w-12 ${className}`}
    >
      {children}
    </button>
  )
})

export default IconButton
