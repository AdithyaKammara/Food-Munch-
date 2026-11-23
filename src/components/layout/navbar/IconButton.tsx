import { forwardRef, type ReactNode } from 'react'
import { clsx } from 'clsx'

interface Props {
  label: string
  onClick: () => void
  children: ReactNode
  /** `light`: on cream surfaces. `dark`: on the forest-green navbar. */
  tone?: 'light' | 'dark'
  className?: string
  'aria-expanded'?: boolean
  'aria-controls'?: string
}

/** A round 44px icon-only button. `label` is what screen readers announce. */
const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { label, onClick, children, tone = 'light', className, ...aria },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      onClick={onClick}
      {...aria}
      className={clsx(
        'relative grid size-11 shrink-0 place-items-center rounded-full border transition-[border-color,color,scale] duration-150 motion-safe:active:scale-94',
        tone === 'dark'
          ? 'border-cream-50/25 text-cream-50 hover:border-gold-300 hover:text-gold-300'
          : 'border-line-200 bg-cream-50 text-ink-900 hover:border-copper-600',
        className,
      )}
    >
      {children}
    </button>
  )
})

export default IconButton
