import { clsx } from 'clsx'

export type ButtonVariant = 'primary' | 'secondary' | 'quiet'
export type ButtonSize = 'md' | 'lg'

// Hover, press and keyboard focus each look different, so any combination shows all of its parts
// (modern-web-guidance: natural-interactions). Only colour, border and scale transition.
const base =
  'inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold ' +
  'transition-[background-color,border-color,color,scale] duration-150 ease-out ' +
  'disabled:pointer-events-none aria-disabled:pointer-events-none'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-copper-600 text-white hover:bg-copper-700 motion-safe:active:scale-97 active:bg-copper-800',
  secondary:
    'border-[1.5px] border-copper-600 text-copper-700 hover:bg-cream-300 motion-safe:active:scale-97 active:bg-cream-300',
  quiet: 'border border-line-200 bg-cream-50 text-ink-900 hover:border-copper-600 motion-safe:active:scale-94',
}

const sizes: Record<ButtonVariant, Record<ButtonSize, string>> = {
  primary: { md: 'h-12 px-6 text-base', lg: 'h-13 px-7 text-[1.0625rem]' },
  secondary: { md: 'h-11 px-5 text-[0.9375rem]', lg: 'h-12 px-6 text-base' },
  quiet: { md: 'size-11', lg: 'size-12' },
}

/** The class list for a button (component-guidelines.md §4), for elements that can't use <Button>. */
export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return clsx(base, variants[variant], sizes[variant][size], className)
}
