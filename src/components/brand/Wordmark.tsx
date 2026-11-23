import { clsx } from 'clsx'
import CharminarMark from './CharminarMark'

interface Props {
  /** `dark`: ink on cream. `light`: cream on forest green. */
  tone?: 'dark' | 'light'
  showTagline?: boolean
  href?: string
  onClick?: () => void
  className?: string
}

/** The Food Munch wordmark: the Charminar mark, the name and the tagline (design.md §1). */
export default function Wordmark({ tone = 'dark', showTagline = true, href = '#home', onClick, className }: Props) {
  const light = tone === 'light'
  return (
    <a
      href={href}
      onClick={onClick}
      aria-label="Food Munch, home"
      className={clsx('inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg max-[374px]:gap-2', className)}
    >
      <CharminarMark variant="mark" className={clsx('size-9 max-[374px]:size-8', light ? 'text-gold-300' : 'text-copper-600')} />
      <span className="flex flex-col leading-none">
        <span
          className={clsx(
            'font-wordmark text-[1.625rem] font-bold tracking-[-0.01em] max-[374px]:text-[1.1875rem]',
            light ? 'text-cream-50' : 'text-ink-900',
          )}
        >
          Food <span className={light ? 'text-gold-300' : 'text-copper-500'}>Munch</span>
        </span>
        {showTagline && (
          <span className={clsx('mt-1 text-caption font-medium max-sm:hidden', light ? 'text-cream-200/85' : 'text-ink-600')}>
            Hyderabad food delivery
          </span>
        )}
      </span>
    </a>
  )
}
