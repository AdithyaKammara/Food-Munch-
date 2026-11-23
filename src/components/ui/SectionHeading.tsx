import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface Props {
  /** Copper capital label above the heading (owner decision D4: four sections only). */
  label?: string
  /** Heading level. Defaults to h2. */
  as?: 'h1' | 'h2' | 'h3'
  /** Heading size from the type scale. Defaults to the section size. */
  size?: 'display-xl' | 'display-lg' | 'display-md'
  align?: 'start' | 'center'
  id?: string
  className?: string
  children: ReactNode
}

/**
 * A section opening: an optional label with a short copper rule, then the heading.
 * Put <Accent> around the one word that should be italic copper (design.md §4).
 */
export default function SectionHeading({
  label,
  as: Heading = 'h2',
  size = 'display-lg',
  align = 'start',
  id,
  className,
  children,
}: Props) {
  return (
    <div className={clsx(align === 'center' && 'text-center', className)}>
      {label && (
        <p
          className={clsx(
            'flex items-center gap-3 text-label font-semibold uppercase text-copper-700',
            align === 'center' && 'justify-center',
          )}
        >
          {label}
          <span data-rule aria-hidden="true" className="h-px w-8 bg-copper-500" />
        </p>
      )}
      <Heading
        id={id}
        className={clsx(
          'font-display font-bold text-ink-900',
          size === 'display-xl' && 'text-display-xl',
          size === 'display-lg' && 'text-display-lg',
          size === 'display-md' && 'text-display-md',
          label && 'mt-3',
        )}
      >
        {children}
      </Heading>
    </div>
  )
}

/** The single italic copper word in a heading. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="accent">{children}</span>
}
