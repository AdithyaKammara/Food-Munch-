import { useId } from 'react'
import { clsx } from 'clsx'

/** The repeating geometric band along the footer's bottom edge, in gold on forest (design.md §6). */
export default function OrnamentBorder({ className }: { className?: string }) {
  const id = `fm-ornament-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={clsx('block h-3.5 w-full text-gold-400', className)}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={id} width="28" height="14" patternUnits="userSpaceOnUse">
          {/* A diamond between two arches, the motif of the Charminar's gallery */}
          <path d="M14 2l5 5-5 5-5-5z" fill="currentColor" />
          <path d="M0 13c0-5 3-8 7-8M28 13c0-5-3-8-7-8" fill="none" stroke="currentColor" strokeWidth="1.25" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
