import { clsx } from 'clsx'

/**
 * The look of a form control inside dialogs: 44px tall, 16px text (smaller text makes iOS zoom in
 * on focus), an 8px radius, and a copper border on focus or a red one with an error.
 */
export function fieldClasses(error?: string | null, className?: string) {
  return clsx(
    'mt-1.5 block min-h-11 w-full rounded-sm border bg-cream-50 px-3.5 py-2.5 text-base text-ink-900 transition-colors placeholder:text-ink-600 focus:border-copper-600',
    error ? 'border-nonveg' : 'border-field-500',
    className,
  )
}
